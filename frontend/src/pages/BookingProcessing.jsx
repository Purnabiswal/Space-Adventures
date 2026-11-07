import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Rocket, ShieldCheck, Clock, Globe2, Sparkles, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import api from '../api/client.js';
import { errorMessage } from '../utils/format.js';

const PROCESSING_MESSAGES = [
  'Contacting Mission Control...',
  'Computing your trajectory...',
  'Reserving your seat among the stars...',
  'Running pre-flight checks...',
  'Preparing your space suit...',
  "Checking your Galaxy Visa...",
  'Making sure Mercury is not in retrograde...',
  'Aligning your spacecraft with the universe...',
  'Confirming your seat...',
  'Mission Control has approved your adventure!',
];

const MESSAGE_INTERVAL = 2000;

export default function BookingProcessing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref');
  const idk = searchParams.get('idk');
  const [currentMsg, setCurrentMsg] = useState(0);
  const [progress, setProgress] = useState(5);
  const [status, setStatus] = useState('processing'); // processing | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const confirmedRef = useRef(false);

  // Animated messages
  useEffect(() => {
    if (status !== 'processing') return;
    const msgInterval = setInterval(() => {
      setCurrentMsg((m) => {
        if (m < PROCESSING_MESSAGES.length - 1) return m + 1;
        return m;
      });
    }, MESSAGE_INTERVAL);
    return () => clearInterval(msgInterval);
  }, [status]);

  // Progress bar
  useEffect(() => {
    if (status !== 'processing') return;
    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p < 90) return p + Math.random() * 8;
        return p;
      });
    }, 1500);
    return () => clearInterval(progInterval);
  }, [status]);

  // Confirm booking on backend
  useEffect(() => {
    if (!ref || confirmedRef.current) return;
    confirmedRef.current = true;

    const confirmBooking = async () => {
      try {
        await api.post('/bookings/confirm', {
          bookingReference: ref,
          idempotencyKey: idk,
        });

        // Let the animation complete
        setTimeout(() => {
          setCurrentMsg(PROCESSING_MESSAGES.length - 1);
          setProgress(100);
          setTimeout(() => {
            setStatus('success');
          }, 1500);
        }, 2000);
      } catch (e) {
        setErrorMsg(errorMessage(e, 'Booking confirmation failed'));
        setStatus('error');
      }
    };

    // If recovering from refresh
    const checkExisting = async () => {
      try {
        const res = await api.get(`/bookings/reference/${ref}`);
        if (res.data.booking.status === 'confirmed' || res.data.booking.status === 'pending') {
          setCurrentMsg(PROCESSING_MESSAGES.length - 1);
          setProgress(100);
          setTimeout(() => {
            setStatus('success');
          }, 1500);
          return true;
        }
      } catch (e) {
        // Continue with new booking
      }
      return false;
    };

    checkExisting().then((found) => {
      if (!found) {
        setTimeout(confirmBooking, 3000);
      }
    });
  }, [ref, idk]);

  const handleRetry = () => {
    confirmedRef.current = false;
    setStatus('processing');
    setProgress(5);
    setCurrentMsg(0);
    setErrorMsg('');
  };

  const handleViewTicket = () => {
    if (ref) navigate(`/booking/success/${ref}`);
  };

  if (status === 'success') {
    return (
      <div className="bg-black text-white">
        <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 animate-pulse-slow">
            <CheckCircle2 className="h-20 w-20 text-brand-green" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white">Booking Confirmed!</h1>
          <p className="mt-3 text-[#B3BECE]">Your seat among the stars is secured. Mission Control is thrilled.</p>
          <p className="mt-2 font-mono text-sm text-brand-saffron">Ref: {ref}</p>
          <button onClick={handleViewTicket} className="btn-saffron mt-8 !px-8 !py-3 text-base">
            View My Ticket <Rocket className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-black text-white">
        <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-4 text-center">
          <XCircle className="h-16 w-16 text-brand-coral" />
          <h1 className="mt-4 font-display text-2xl font-bold text-white">Booking Failed</h1>
          <p className="mt-2 text-[#8492A6]">{errorMsg || 'Something went wrong. Please try again.'}</p>
          <div className="mt-8 flex gap-4">
            <button onClick={handleRetry} className="btn-saffron"><RefreshCw className="h-4 w-4" /> Retry</button>
            <button onClick={() => navigate('/destinations')} className="btn-ghost">Back to Destinations</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        {/* Animated icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse-slow rounded-full bg-brand-sky/20 blur-xl" />
          <Rocket className="relative h-16 w-16 text-brand-sky" />
        </div>

        <h1 className="font-display text-2xl font-bold text-white">Preparing Your Journey</h1>
        <p className="mt-2 text-sm text-[#8492A6]">Please wait while we process your booking...</p>

        {/* Progress bar */}
        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-black">
          <div
            className="h-full rounded-full bg-brand-saffron transition-all duration-700 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Messages */}
        <div className="mt-6 h-16">
          <p className="animate-pulse font-mono text-sm text-brand-sky">
            {PROCESSING_MESSAGES[currentMsg]}
          </p>
        </div>

        {/* Stars */}
        <div className="mt-12 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Sparkles key={i} className={`h-4 w-4 text-brand-saffron animate-pulse`} style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
