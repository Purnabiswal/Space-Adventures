import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Users, MapPin, CalendarDays, Rocket, CreditCard, AlertTriangle } from 'lucide-react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatINR, formatDate } from '../../utils/format.js';
import { errorMessage } from '../../utils/format.js';

export default function BookingSummary() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const packageId = searchParams.get('packageId');
  const travelClassId = searchParams.get('travelClassId');
  const source = searchParams.get('source') || 'earth';
  const destinationSlug = searchParams.get('destination');
  const date = searchParams.get('date');
  const className = searchParams.get('className') || '';
  const price = parseInt(searchParams.get('price') || '0');
  const pkgName = searchParams.get('pkgName') || '';
  const passengerCount = parseInt(searchParams.get('passengerCount') || '1');

  const passengers = [];
  for (let i = 0; i < passengerCount; i++) {
    passengers.push({
      name: searchParams.get(`passenger${i}_name`) || '',
      age: searchParams.get(`passenger${i}_age`) || '',
      berth: searchParams.get(`passenger${i}_berth`) || 'any',
    });
  }

  const totalPrice = price * passengerCount;

  const handlePurchase = async () => {
    if (!user) { navigate('/login'); return; }

    setSubmitting(true);
    setSubmitError('');

    const idempotencyKey = `trip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    try {
      // Step 1: Submit booking
      const payload = {
        packageId,
        travelClassId,
        departureDate: date || undefined,
        sourceSlug: source,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: p.age ? parseInt(p.age) : undefined,
          berth: p.berth,
        })),
        idempotencyKey,
      };

      const res = await api.post('/bookings/destination-book', payload);
      const { booking } = res.data;

      // Step 2: Navigate to processing page with booking reference
      navigate(`/booking/processing?ref=${booking.bookingReference}&idk=${idempotencyKey}`);
    } catch (e) {
      setSubmitError(errorMessage(e, 'Booking failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-[#8492A6]">
            <span className="font-semibold text-white">1. Passengers</span>
            <span className="font-semibold text-brand-saffron">2. Summary</span>
            <span>3. Payment</span>
            <span>4. Confirmation</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black">
            <div className="h-full w-1/2 rounded-full bg-brand-saffron transition-all" />
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-white mb-2">Review your booking</h1>
        <p className="text-sm text-[#8492A6] mb-6">Please review your journey details before purchase.</p>

        {/* Journey summary */}
        <div className="card p-6 mb-4">
          <h2 className="font-bold text-white mb-3 flex items-center gap-2">
            <Rocket className="h-4 w-4 text-brand-saffron" /> Journey Details
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-brand-sky shrink-0" />
              <div>
                <p className="text-xs text-[#8492A6]">From</p>
                <p className="font-semibold text-white">{source.charAt(0).toUpperCase() + source.slice(1)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-brand-saffron shrink-0" />
              <div>
                <p className="text-xs text-[#8492A6]">Destination</p>
                <p className="font-semibold text-white">{destinationSlug?.charAt(0).toUpperCase() + destinationSlug?.slice(1)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 text-brand-teal shrink-0" />
              <div>
                <p className="text-xs text-[#8492A6]">Travel Date</p>
                <p className="font-semibold text-white">{date ? formatDate(date) : 'Flexible'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Rocket className="h-4 w-4 text-brand-sky shrink-0" />
              <div>
                <p className="text-xs text-[#8492A6]">Spacecraft & Class</p>
                <p className="font-semibold text-white">{pkgName} &middot; {className}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className="card p-6 mb-4">
          <h2 className="font-bold text-white mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-sky" /> Passengers ({passengerCount})
          </h2>
          {passengers.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between border-b border-navy-600 py-2 last:border-0">
              <div>
                <p className="text-sm font-medium text-white">{p.name}</p>
                <p className="text-xs text-[#8492A6]">Age: {p.age || 'N/A'} &middot; Berth: {p.berth}</p>
              </div>
              <span className="text-sm text-brand-saffron">{formatINR(price)}</span>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="card p-6 mb-4">
          <h2 className="font-bold text-white mb-3 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-saffron" /> Price Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[#8492A6]">
              <span>Price per passenger ({className})</span>
              <span>{formatINR(price)}</span>
            </div>
            <div className="flex justify-between text-[#8492A6]">
              <span>Passengers</span>
              <span>&times; {passengerCount}</span>
            </div>
            <div className="flex justify-between border-t border-navy-600 pt-2 font-bold text-white">
              <span>Total</span>
              <span className="font-display text-brand-saffron text-lg">{formatINR(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Visa notice */}
        <div className="card p-4 mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-brand-green shrink-0" />
            <div>
              <p className="font-semibold text-white">Galaxy Visa check</p>
              <p className="text-xs text-[#8492A6]">Your Galaxy Visa will be validated before purchase. Ensure you have a valid Space Travel Visa.</p>
            </div>
          </div>
        </div>

        {submitError && <p className="mb-4 rounded-xl border border-brand-coral/40 bg-brand-coral/10 p-3 text-sm text-brand-coral">{submitError}</p>}

        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-sm text-[#8492A6] hover:text-white">&larr; Edit Passengers</button>
          <button onClick={handlePurchase} disabled={submitting} className="btn-saffron !px-8 !py-3 text-base">
            {submitting ? 'Processing...' : `Purchase for ${formatINR(totalPrice)}`} <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

