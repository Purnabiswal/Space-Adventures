import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedIndex: { type: Number },
    isCorrect: { type: Boolean },
  },
  { _id: false }
);

const assessmentAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    config: { type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentConfiguration' },
    questions: [answerSchema],
    score: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    status: { type: String, enum: ['in_progress', 'submitted'], default: 'in_progress' },
  },
  { timestamps: true }
);

assessmentAttemptSchema.index({ user: 1, submittedAt: -1 });

const AssessmentAttempt = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
export default AssessmentAttempt;
