import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Award, CheckCircle2, Timer, ArrowRight, ShieldCheck, XCircle, Zap, PartyPopper } from 'lucide-react';
import api from '../api/client.js';
import { Loading, ErrorState } from '../components/ui.jsx';
import { errorMessage, daysRemaining, formatDate } from '../utils/format.js';
import { useAuth } from '../context/AuthContext.jsx';

const categoryColor = {
  General: 'bg-brand-sky/20 text-brand-sky',
  Physics: 'bg-brand-teal/20 text-brand-teal',
  Biology: 'bg-brand-green/20 text-brand-green',
  'Safety & Operations': 'bg-brand-saffron/20 text-brand-saffron',
};

const PASS_MESSAGES = [
  'Mission control is impressed. That rarely happens.',
  'Earth is officially less crowded (by one).',
  'Congratulations, astronaut. Try not to let it go to your head.',
  'Welcome aboard. The spaceship has been cleaned. Mostly.',
];

const FAIL_MESSAGES = [
  'The universe is willing to forgive. Eventually.',
  'Good effort. The Moon will wait for you.',
  'Houston detected you. Kindly retry in 7 days.',
  'Not today, Earthling. But soon.',
];

const resultMsg = (passed, percentage) => {
  if (!passed) return FAIL_MESSAGES[Math.floor(Math.random() * FAIL_MESSAGES.length)];
  if (percentage >= 90) return PASS_MESSAGES[Math.floor(Math.random() * 2)];
  return PASS_MESSAGES[2 + Math.floor(Math.random() * 2)];
};

export default function Assessment() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [remaining, setRemaining] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [startError, setStartError] = useState('');
  const [celebrate, setCelebrate] = useState(false);

  const loadStatus = () => {
    if (!token) { setLoading(false); return; }
    api.get('/assessments/status')
      .then((res) => setStatus(res.data.status))
      .catch((e) => setError(errorMessage(e, 'Failed to load status')))
      .finally(() => setLoading(false));
  };
  useEffect(loadStatus, [token]);

  const start = async () => {
    setStartError('');
    try {
      const res = await api.post('/assessments/start');
      setQuiz(res.data);
      setRemaining(res.data.durationMinutes * 60);
    } catch (e) {
      setStartError(errorMessage(e));
      loadStatus();
    }
  };

  useEffect(() => {
    if (!quiz || result) return;
    const id = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [quiz, result]);

  const submit = async () => {
    setSubmitLoading(true);
    try {
      const res = await api.post('/assessments/submit', { attemptId: quiz.attemptId, answers });
      setResult({ ...res.data, funny: resultMsg(res.data.passed, res.data.percentage) });
      if (res.data.passed) { setCelebrate(true); setTimeout(() => setCelebrate(false), 2500); }
      loadStatus();
    } catch (e) {
      setStartError(errorMessage(e));
      loadStatus();
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="bg-black text-white"><Loading /></div>;

  // ACTIVE QUIZ
  if (quiz && !result) {
    const answered = Object.keys(answers).length;
    const progress = quiz.questions.length ? (answered / quiz.questions.length) * 100 : 0;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return (
      <div className="bg-black text-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Astronaut Training</h1>
              <p className="font-mono text-xs text-[#8492A6]">Mission Control is judging your decisions. No pressure.</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-brand-saffron/40 bg-brand-saffron/10 px-4 py-1.5 font-mono text-sm text-brand-saffron">
              <Timer className="h-4 w-4" /> T-{mins}:{String(secs).padStart(2, '0')}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-[#8492A6]">
              <span>Mission progress: {answered}/{quiz.questions.length}</span>
              <button onClick={() => { setQuiz(null); loadStatus(); }} className="text-[#8492A6] hover:text-white">Abort mission</button>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/10">
              <div className="h-full rounded-full bg-brand-saffron transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((q, idx) => (
              <div key={q.questionId} className="panel-dark p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs text-[#8492A6]">Q{String(idx + 1).padStart(2, '0')} / {quiz.questions.length}</span>
                  <span className={`rounded-full px-3 py-1 text-xs ${categoryColor[q.category] || 'bg-black/10 text-[#B3BECE]'}`}>{q.category}</span>
                </div>
                <p className="font-medium text-white">{q.question}</p>
                <div className="mt-4 space-y-2">
                  {q.options.map((opt, oi) => {
                    const selected = answers[q.questionId] === oi;
                    return (
                      <button key={oi} onClick={() => setAnswers({ ...answers, [q.questionId]: oi })}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected ? 'border-brand-saffron bg-brand-saffron/20' : 'border-white/20 hover:border-white/30'}`}>
                        <span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${selected ? 'bg-brand-saffron text-white' : 'bg-black/10 text-[#B3BECE]'}`}>{String.fromCharCode(65 + oi)}</span>
                        <span className="text-[#B3BECE]">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button onClick={submit} disabled={submitLoading} className="btn-saffron mt-8 w-full justify-center !py-3 text-base">
            {submitLoading ? 'Calculating your chances of leaving Earth…' : `Submit (${answered}/${quiz.questions.length})`} {!submitLoading && <ArrowRight className="h-5 w-5" />}
          </button>
        </div>
      </div>
    );
  }

  // RESULT
  if (result) {
    return (
      <div className="bg-black text-white">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          {result.passed
            ? <PartyPopper className={`mx-auto h-20 w-20 text-brand-green ${celebrate ? 'animate-bounce' : ''}`} />
            : <XCircle className="mx-auto h-20 w-20 text-brand-coral" />}
          <h1 className={`mt-4 font-display text-3xl font-bold ${result.passed ? 'text-brand-green' : 'text-brand-coral'}`}>
            {result.passed ? 'Recruit accepted. Welcome, astronaut.' : 'Recruitment decl— wait, retry available.'}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-[#B3BECE]">{result.funny}</p>
          <div className="mx-auto mt-6 inline-block rounded-2xl panel-dark px-8 py-5">
            <p className="text-sm text-[#8492A6]">Mission score</p>
            <p className="font-display text-5xl font-extrabold text-brand-saffron">{result.percentage}%</p>
            <p className="mt-1 text-sm text-[#8492A6]">{result.score}/{result.total} correct · pass mark {status?.passingScore ?? 70}%</p>
          </div>
          {result.passed && result.visa && (
            <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-brand-green/40 bg-brand-green/10 p-5">
              <Award className="mx-auto h-8 w-8 text-brand-green" />
              <p className="mt-2 font-semibold text-white">Space Travel Visa Issued</p>
              <p className="font-mono text-sm text-brand-green">{result.visa.visaNumber}</p>
              <p className="text-xs text-[#8492A6]">Expires {formatDate(result.visa.expiresAt)}</p>
            </div>
          )}
          {!result.passed && (
            <p className="mx-auto mt-6 max-w-md text-sm text-[#8492A6]">You'll be able to try again after the 7-day cooldown. Think of it as a sabbatical for your ego.</p>
          )}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => { setQuiz(null); setResult(null); loadStatus(); }} className="btn-outline-light">Back to Control</button>
            <Link to="/destinations" className="btn-saffron">Explore Destinations <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-black text-white">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <Award className="mx-auto h-16 w-16 text-brand-sky" />
          <h1 className="mt-4 font-display text-3xl font-bold text-white">Think you've got what it takes to leave Earth?</h1>
          <p className="mt-3 text-[#B3BECE]">We're looking for brave explorers, quick thinkers and people who don't panic at "Houston, we have a problem."</p>
          <p className="mt-4 text-[#8492A6]">Log in to begin your training and earn a Space Travel Visa.</p>
          <Link to="/login" className="btn-saffron mt-6">Login to Continue <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    );
  }

  const cooldownDays = status?.cooldownRemaining ? Math.ceil(status.cooldownRemaining / (24 * 60 * 60 * 1000)) : 0;

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="eyebrow text-brand-saffron"> Astronaut recruitment</p>
        <h1 className="font-display text-3xl font-extrabold text-white">Think you've got what it takes to leave Earth?</h1>
        <p className="mt-3 text-[#B3BECE]">We're looking for brave explorers, quick thinkers and people who don't panic when someone says "Houston, we have a problem."</p>
        <p className="mt-2 font-mono text-xs text-[#8492A6]">Scoring: 70%+ earns your fictional 6-month Space Travel Visa.</p>

        {status?.hasVisa && status?.visa ? (
          <div className="mt-8 rounded-2xl border border-brand-green/40 bg-brand-green/10 p-6">
            <ShieldCheck className="h-8 w-8 text-brand-green" />
            <h2 className="mt-2 font-bold text-white">You're already cleared for launch</h2>
            <p className="text-sm text-[#B3BECE]">Visa <span className="font-mono text-brand-green">{status.visa.visaNumber}</span> · valid until {formatDate(status.visa.expiresAt)}</p>
            <p className="text-xs text-[#8492A6]">Expires in {daysRemaining(status.visa.expiresAt)} days. Time to stop procrastinating.</p>
            <Link to="/dashboard" className="btn-navy mt-4">Go to Dashboard</Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="card-dark p-5 text-center">
                <p className="font-display text-3xl font-bold text-brand-saffron">{status?.passingScore ?? 70}%</p>
                <p className="text-xs text-[#8492A6]">Pass mark</p>
              </div>
              <div className="card-dark p-5 text-center">
                <p className="font-display text-3xl font-bold text-brand-sky">8</p>
                <p className="text-xs text-[#8492A6]">Randomised questions</p>
              </div>
              <div className="card-dark p-5 text-center">
                <p className="font-display text-3xl font-bold text-brand-teal">6 mo</p>
                <p className="text-xs text-[#8492A6]">Visa validity</p>
              </div>
            </div>

            {status?.lastAttempt && !status?.lastAttempt?.passed && cooldownDays > 0 && (
              <div className="mt-6 rounded-2xl border border-brand-saffron/40 bg-brand-saffron/10 p-5">
                <div className="flex items-center gap-2 font-semibold text-brand-saffron"><Timer className="h-5 w-5" /> Cooldown in progress</div>
                <p className="mt-1 text-sm text-[#B3BECE]">You last scored {status.lastAttempt.percentage}%. You can try again in about {cooldownDays} day(s). The universe is patient. Mostly.</p>
              </div>
            )}

            {startError && <p className="mt-6 rounded-xl border border-brand-coral/40 bg-brand-coral/10 p-3 text-sm text-brand-coral">{startError}</p>}

            {(!status?.lastAttempt || (status.lastAttempt && (status.lastAttempt.passed || cooldownDays === 0))) && (
              <button onClick={start} className="btn-saffron mt-8 w-full justify-center !py-3 text-base">Test My Space IQ <ArrowRight className="h-5 w-5" /></button>
            )}
          </>
        )}
      </div>
    </div>
  );
}


