import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Users, Plus, Minus, User, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR } from '../utils/format.js';

const BERTH_OPTIONS = ['any', 'lower', 'middle', 'upper', 'window', 'aisle'];

export default function BookingPassengers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const packageId = searchParams.get('packageId');
  const travelClassId = searchParams.get('travelClassId');
  const source = searchParams.get('source') || 'earth';
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');
  const className = searchParams.get('className') || '';
  const price = parseInt(searchParams.get('price') || '0');
  const pkgName = searchParams.get('pkgName') || '';

  const [passengers, setPassengers] = useState([
    { name: user?.name || '', age: '', berth: 'any' },
  ]);
  const [error, setError] = useState('');

  const addPassenger = () => {
    if (passengers.length >= 4) return;
    setPassengers([...passengers, { name: '', age: '', berth: 'any' }]);
  };

  const removePassenger = (idx) => {
    if (passengers.length <= 1) return;
    setPassengers(passengers.filter((_, i) => i !== idx));
  };

  const updatePassenger = (idx, field, value) => {
    const updated = [...passengers];
    updated[idx] = { ...updated[idx], [field]: value };
    setPassengers(updated);
  };

  const handleContinue = () => {
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name.trim()) {
        setError(`Please enter name for passenger ${i + 1}`);
        return;
      }
    }
    setError('');

    const params = new URLSearchParams({
      packageId, travelClassId, source, destination, className, price, pkgName,
      date: date || '',
      passengerCount: passengers.length,
    });
    passengers.forEach((p, i) => {
      params.set(`passenger${i}_name`, p.name);
      params.set(`passenger${i}_age`, p.age);
      params.set(`passenger${i}_berth`, p.berth);
    });

    navigate(`/booking/summary?${params.toString()}`);
  };

  if (!packageId || !travelClassId) {
    return (
      <div className="bg-black text-white">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-brand-coral" />
          <h1 className="mt-4 font-display text-2xl font-bold text-white">Booking information missing</h1>
          <p className="mt-2 text-[#8492A6]">Please start your journey from the destination page.</p>
          <button onClick={() => navigate('/destinations')} className="btn-saffron mt-6">Go to Destinations</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-[#8492A6]">
            <span className="font-semibold text-brand-saffron">1. Passengers</span>
            <span>2. Summary</span>
            <span>3. Payment</span>
            <span>4. Confirmation</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black">
            <div className="h-full w-1/4 rounded-full bg-brand-saffron transition-all" />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Users className="h-6 w-6 text-brand-sky" />
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Passenger Details</h1>
            <p className="text-sm text-[#8492A6]">{pkgName} &middot; {className}</p>
          </div>
        </div>

        <div className="card p-6 mb-4">
          <div className="flex items-start gap-3 rounded-xl bg-brand-sky/10 p-3 text-xs text-brand-sky">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Enter details for each passenger. All passengers need a valid Galaxy Visa.</span>
          </div>
        </div>

        {passengers.map((p, idx) => (
          <div key={idx} className="card p-5 mb-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-brand-sky" />
                <span className="font-semibold text-white">Passenger {idx + 1}</span>
              </div>
              {passengers.length > 1 && (
                <button onClick={() => removePassenger(idx)} className="text-brand-coral hover:text-red-400">
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="label">Full Name</label>
                <input type="text" value={p.name} onChange={(e) => updatePassenger(idx, 'name', e.target.value)}
                  className="input" placeholder="Enter full name" />
              </div>
              <div>
                <label className="label">Age</label>
                <input type="number" value={p.age} onChange={(e) => updatePassenger(idx, 'age', e.target.value)}
                  className="input" placeholder="Age" min="1" max="150" />
              </div>
            </div>
            <div className="mt-3">
              <label className="label">Berth Preference</label>
              <select value={p.berth} onChange={(e) => updatePassenger(idx, 'berth', e.target.value)} className="input">
                {BERTH_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {passengers.length < 4 && (
          <button onClick={addPassenger} className="btn-ghost w-full justify-center !py-3 text-sm">
            <Plus className="h-4 w-4" /> Add another passenger (max 4)
          </button>
        )}

        {error && <p className="mt-3 text-sm text-brand-coral">{error}</p>}

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-sm text-[#8492A6] hover:text-white">&larr; Back</button>
          <button onClick={handleContinue} className="btn-saffron !px-6 !py-3 text-base">
            Review Booking <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-[#8492A6]">
          Total: {formatINR(price * passengers.length)} ({passengers.length} passenger{passengers.length > 1 ? 's' : ''} &times; {formatINR(price)})
        </p>
      </div>
    </div>
  );
}
