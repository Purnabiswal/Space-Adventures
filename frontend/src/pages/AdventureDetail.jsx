import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Users, Check, ArrowRight, AlertTriangle, Briefcase, PartyPopper } from 'lucide-react';
import api from '../api/client.js';
import { Loading, ErrorState } from '../components/ui.jsx';
import { formatINR, formatDate } from '../utils/format.js';
import { useAuth } from '../context/AuthContext.jsx';

const PKG_QUIPS = {
  'moon-escape': 'Because weekend trips to Goa are getting predictable.',
  'mars-expedition': 'Pack your bags. Oxygen is not complimentary.',
  'zero-gravity-experience': 'Finally, a chance to ignore gravity legally.',
  'earth-orbital-sightseeing': 'Best window seat in human history.',
  'space-station-stay': 'Hotel 400km up. The view never gets old.',
  'luxury-chandrika-retreat': 'Five-star service. Zero-star gravity (in a good way).',
  'l1-solar-retreat': 'So close to the Sun, yet so far from a sunburn.',
};

export default function AdventureDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [visaStatus, setVisaStatus] = useState(null);
  const [booking, setBooking] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    api.get(`/packages/${slug}`)
      .then((res) => { setData(res.data); setSelectedClass(res.data.travelClasses?.[0]?._id || null); })
      .catch((e) => setError(e?.response?.data?.message || 'Package not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (token) api.get('/assessments/status').then((res) => setVisaStatus(res.data.status)).catch(() => {});
  }, [token]);

  if (loading) return <div className="bg-black text-white"><Loading /></div>;
  if (error || !data) return <ErrorState message={error} />;
  const { package: pkg, travelClasses } = data;
  const seatClass = selectedClass ? travelClasses.find((c) => c._id === selectedClass) : null;
  const totalPrice = seatClass ? Math.round(pkg.basePrice * seatClass.baseMultiplier) : pkg.basePrice;
  const hasVisa = !!visaStatus?.hasVisa;

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingMsg('');
    setBookingError('');
    try {
      const res = await api.post('/bookings', { packageId: pkg._id, travelClassId: selectedClass, departureDate: departureDate || undefined });
      setBooking(res.data.booking);
      setBookingMsg('Congratulations! Your future self is going to have an incredible story.');
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2500);
    } catch (err) {
      setBookingError(err?.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-7xl rounded-t-[2.5rem] bg-black px-4 py-10 text-white md:px-8">
        <nav className="mb-6 text-sm text-[#8492A6]">
          <Link to="/adventures" className="hover:text-brand-sky">Adventures</Link> <span className="mx-1">/</span>
          <span className="text-white">{pkg.name}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative h-80 overflow-hidden rounded-2xl">
              <img src={pkg.coverImage || pkg.images?.[0]} alt={pkg.name} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-navy-900/80 to-transparent p-4">
                <span className="badge-saffron">{pkg.difficulty}</span>
                <span className="badge-sky">{pkg.company?.name}</span>
              </div>
            </div>
            <h1 className="mt-6 font-display text-3xl font-extrabold text-white">{pkg.name}</h1>
            <p className="mt-2 font-medium text-brand-sky">{PKG_QUIPS[pkg.slug] || pkg.description}</p>
            <p className="mt-2 flex flex-wrap gap-4 text-sm text-[#8492A6]">
              <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {pkg.company?.name}</span>
              <Link to={`/destinations/${pkg.destination?.slug}`} className="hover:text-brand-sky">Destination: {pkg.destination?.name}</Link>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {pkg.duration}</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {pkg.remainingSeats ?? (pkg.totalSeats - pkg.bookedSeats)} seats left</span>
            </p>
            <p className="mt-6 text-lg leading-relaxed text-[#8492A6]">{pkg.description}</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {pkg.features?.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-bold text-white">Features</h2>
                  <ul className="mt-3 space-y-2">
                    {pkg.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-[#B3BECE]"><Check className="h-4 w-4 text-brand-green" /> {f}</li>)}
                  </ul>
                </div>
              )}
              {pkg.amenities?.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-bold text-white">Amenities</h2>
                  <ul className="mt-3 space-y-2">
                    {pkg.amenities.map((a, i) => <li key={i} className="flex items-center gap-2 text-sm text-[#B3BECE]"><Check className="h-4 w-4 text-brand-sky" /> {a}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold text-white">Choose your escape route</h2>
              <p className="mt-1 text-sm text-[#8492A6]">Select your preferred spaceship seat.</p>

              <div className="mt-5">
                <label className="label">Travel class</label>
                <div className="space-y-2">
                  {travelClasses.map((tc) => (
                    <button key={tc._id} onClick={() => setSelectedClass(tc._id)}
                      className={`w-full rounded-xl border p-3 text-left transition ${selectedClass === tc._id ? 'border-brand-saffron bg-brand-saffron/10' : 'border-navy-500 hover:border-brand-saffron/50'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{tc.name}</span>
                        <span className="text-sm text-brand-saffron">×{tc.baseMultiplier}</span>
                      </div>
                      <p className="text-xs text-[#8492A6]">Est. {formatINR(Math.round(pkg.basePrice * tc.baseMultiplier))}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-navy-600 pt-4">
                <span className="text-[#8492A6]">Total (est.)</span>
                <span className="font-display text-2xl font-bold text-brand-saffron">{formatINR(totalPrice)}</span>
              </div>

              {!user && (
                <p className="mt-4 rounded-xl border border-brand-saffron/30 bg-brand-saffron/10 p-3 text-sm text-brand-saffron">
                  Please <Link to="/login" className="underline font-semibold">log in</Link> before you attempt to escape Earth.
                </p>
              )}

              {user && !hasVisa && visaStatus && (
                <div className="mt-4 rounded-xl border border-brand-coral/30 bg-brand-coral/10 p-3 text-sm text-brand-coral">
                  <AlertTriangle className="mr-1 inline h-4 w-4" /> No valid Space Travel Visa yet. Go prove your worth first.<br />
                  <Link to="/assessment" className="mt-1 inline-block font-semibold text-white underline">Take the assessment →</Link>
                </div>
              )}

              {booking && (
                <div className={`mt-4 rounded-xl border p-4 text-sm ${celebrate ? 'border-brand-saffron bg-brand-saffron/20' : 'border-brand-green/40 bg-brand-green/10'} text-white`}>
                  <PartyPopper className={`mb-1 h-5 w-5 ${celebrate ? 'animate-bounce text-brand-saffron' : 'text-brand-green'}`} />
                  <p className="font-semibold">{bookingMsg}</p>
                  <span className="font-mono text-xs">Booking ref: {booking.bookingReference}</span>
                  <button onClick={() => navigate('/dashboard')} className="btn-saffron mt-3 w-full justify-center text-sm">View My Missions</button>
                </div>
              )}

              {bookingError && <p className="mt-4 text-sm text-brand-coral">{bookingError}</p>}

              {user && hasVisa && !booking && (
                <form onSubmit={handleBook} className="mt-5">
                  <label className="label">Departure date</label>
                  <input type="date" className="input [color-scheme:light]" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} disabled={!!booking} />
                  <p className="mt-3 font-mono text-xs text-[#8492A6]">Final check before leaving your comfort zone.</p>
                  <button type="submit" className="btn-saffron mt-4 w-full justify-center">Confirm Booking <ArrowRight className="h-4 w-4" /></button>
                  <p className="mt-2 text-center text-xs text-[#8492A6]">Fictional simulated reservation</p>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


