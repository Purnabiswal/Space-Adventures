import User from '../models/User.js';
import Question from '../models/Question.js';
import AssessmentConfiguration from '../models/AssessmentConfiguration.js';
import AssessmentAttempt from '../models/AssessmentAttempt.js';
import { issueVisaFromAttempt, getActiveVisa } from '../services/visaService.js';
import { AppError, asyncHandler } from '../utils/appError.js';

async function getConfig() {
  let config = await AssessmentConfiguration.findOne({ isActive: true });
  if (!config) {
    config = await AssessmentConfiguration.create({});
  }
  return config;
}

// returns ms remaining in cooldown or 0
function getCooldownRemaining(lastAttempt, cooldownDays) {
  if (!lastAttempt) return 0;
  const cooldownEnd = new Date(lastAttempt.submittedAt.getTime() + cooldownDays * 24 * 60 * 60 * 1000);
  return Math.max(0, cooldownEnd.getTime() - Date.now());
}

export const getAssessmentConfig = asyncHandler(async (req, res) => {
  const config = await getConfig();
  res.json({
    success: true,
    config: {
      name: config.name,
      passingScore: config.passingScore,
      totalQuestions: config.totalQuestions,
      durationMinutes: config.durationMinutes,
      cooldownDays: config.cooldownDays,
      categories: config.categories,
    },
  });
});

export const getStatus = asyncHandler(async (req, res) => {
  const [config, lastAttempt, activeVisa] = await Promise.all([
    getConfig(),
    AssessmentAttempt.findOne({ user: req.user._id, status: 'submitted' }).sort({ submittedAt: -1 }),
    getActiveVisa(req.user._id),
  ]);

  const cooldownRemaining = getCooldownRemaining(lastAttempt, config.cooldownDays);

  res.json({
    success: true,
    status: {
      hasVisa: !!activeVisa,
      visa: activeVisa,
      lastAttempt,
      cooldownRemaining,
      canAttempt: !lastAttempt || cooldownRemaining === 0,
      passingScore: config.passingScore,
    },
  });
});

export const startAssessment = asyncHandler(async (req, res) => {
  const config = await getConfig();
  const lastAttempt = await AssessmentAttempt.findOne({ user: req.user._id, status: 'submitted' }).sort({ submittedAt: -1 });

  const cooldownRemaining = getCooldownRemaining(lastAttempt, config.cooldownDays);
  if (cooldownRemaining > 0) {
    const hours = Math.ceil(cooldownRemaining / (60 * 60 * 1000));
    throw new AppError(`Please wait ${hours}h before attempting again`, 400);
  }

  // Build question pool from categories
  const categories = config.categories && config.categories.length ? config.categories : [{ category: 'General', count: config.totalQuestions }];
  const selected = [];
  for (const cat of categories) {
    const pool = await Question.aggregate([
      { $match: { category: cat.category, isActive: true } },
      { $sample: { size: Math.min(cat.count || 2, 100) } },
    ]);
    selected.push(...pool);
  }
  // Shuffle globally
  selected.sort(() => Math.random() - 0.5);
  const finalQuestions = selected.slice(0, config.totalQuestions);

  if (finalQuestions.length === 0) {
    throw new AppError('Question bank is empty. Please seed questions.', 500);
  }

  const attempt = await AssessmentAttempt.create({
    user: req.user._id,
    config: config._id,
    questions: finalQuestions.map((q) => ({ questionId: q._id })),
    startedAt: new Date(),
    status: 'in_progress',
  });

  // Return sanitized questions (without correctIndex)
  const sanitized = finalQuestions.map((q) => ({
    questionId: q._id,
    category: q.category,
    question: q.question,
    options: q.options,
  }));

  res.status(201).json({
    success: true,
    attemptId: attempt._id,
    durationMinutes: config.durationMinutes,
    questions: sanitized,
  });
});

export const submitAssessment = asyncHandler(async (req, res) => {
  const { attemptId, answers } = req.body;
  const attempt = await AssessmentAttempt.findOne({ _id: attemptId, user: req.user._id, status: 'in_progress' });
  if (!attempt) throw new AppError('Attempt not found or already submitted', 400);

  const config = await getConfig();
  const populated = await Question.find({ _id: { $in: attempt.questions.map((a) => a.questionId) } });

  const map = {};
  populated.forEach((q) => (map[String(q._id)] = q));

  let correct = 0;
  const graded = attempt.questions.map((entry) => {
    const q = map[String(entry.questionId)];
    const selectedIndex = answers ? answers[String(entry.questionId)] : undefined;
    const isCorrect = q && selectedIndex === q.correctIndex;
    if (isCorrect) correct += 1;
    return { questionId: entry.questionId, selectedIndex, isCorrect };
  });

  const total = graded.length;
  const percentage = total ? Math.round((correct / total) * 100) : 0;
  const passed = percentage >= config.passingScore;

  attempt.questions = graded;
  attempt.score = correct;
  attempt.percentage = percentage;
  attempt.passed = passed;
  attempt.status = 'submitted';
  attempt.submittedAt = new Date();
  await attempt.save();

  let visa = null;
  if (passed) {
    const user = await User.findById(req.user._id);
    visa = await issueVisaFromAttempt(user, attempt);
  }

  res.json({ success: true, attempt, passed, percentage, score: correct, total, visa });
});
