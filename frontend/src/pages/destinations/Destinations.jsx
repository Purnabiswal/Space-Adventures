import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Thermometer, ArrowRight, Rocket, MapPin, CalendarDays, Sparkles, Globe2 } from 'lucide-react';
import api from '../../api/client.js';
import { SectionHeading, Loading, ErrorState } from '../../components/ui.jsx';
import { formatDate } from '../../utils/format.js';

const DEST_COPY = {
  moon: { quip: 'Only 3 days away, depending on traffic. No traffic signals yet.', fact: 'You can jump about 6x higher here. Highly recommended.' },
  mars: { quip: 'Red sand, beautiful views and absolutely no nearby grocery stores.', fact: 'Sunrise is blue. Settle your arguments now.' },
  'earth-orbit': { quip: 'See your house from space. Finding your parked vehicle is not guaranteed.', fact: 'You will see 16 sunrises a day. Sleep is optional.' },
  'orbital-station': { quip: 'Best window seat in human history.', fact: 'Gravity takes the day off. So will you.' },
  'space-hotel-chandrika': { quip: 'Room with a view. Literally, half the universe.', fact: 'The minibar charges extra for zero-gravity pours.' },
  'lagrange-1': { quip: 'Endless sunshine, zero sunburn. Probably.', fact: 'So isolated even the Wi-Fi gives up.' },
};

export default function Destinations() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selectors
  const [source, setSource] = useState('earth');
  const [destination, setDestination] = useState('moon');
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    api.get('/routes/destinations')
      .then((res) => setDestinations(res.data.destinations))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleExplore = () => {
    if (source === destination) {
      setError('Source and destination cannot be the same');
      return;
    }
    navigate(`/destinations/${destination}?source=${source}&date=${travelDate}`);
  };

  const today = new Date().toISOString().split('T')[0];

  const cards = destinations.filter((d) => d.slug !== 'earth' && d.featured);

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        {/* Route Selector */}
        <div className="mb-12 rounded-2xl border border-navy-600 bg-black/80 p-6 md:p-8 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2 text-blue-500">
            {/* <Globe2 className="h-5 w-5" /> */}
            <span className="text-sm font-semibold uppercase tracking-wider">
              Plan your journey
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Where to?
          </h2>
          <p className="mt-1 text-sm text-[#8492A6]">
            Choose your departure point, destination, and travel date.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_auto] md:items-end">
            <div>
              <label className="label">From</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="input"
              >
                {destinations
                  .filter((d) => d.slug !== destination)
                  .map((d) => (
                    <option key={d._id} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center justify-center pt-6">
              <ArrowRight className="hidden h-6 w-6 text-brand-sky md:block" />
              <ArrowRight className="h-6 w-6 rotate-90 text-brand-sky md:hidden" />
            </div>

            <div>
              <label className="label">To</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="input"
              >
                {destinations
                  .filter((d) => d.slug !== source)
                  .map((d) => (
                    <option key={d._id} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="label">Travel Date</label>
              <input
                type="date"
                value={travelDate}
                min={today}
                onChange={(e) => setTravelDate(e.target.value)}
                className="input text-white [color-scheme:dark]"
              />
            </div>
            <button
              onClick={handleExplore}
              className="bg-[#ff5f00] text-white font-bold px-7 py-3 rounded-[22px] whitespace-nowrap shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e65300] hover:shadow-lg"
            >
              Explore Journeys
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-brand-coral">{error}</p>}
        </div>

        {/* Destination Cards */}
        <SectionHeading
          eyebrow="Explore"
          title="Destinations"
          sub="The universe is enormous. These are the corners we've decided to open first."
        />
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((d, i) => {
              const copy = DEST_COPY[d.slug] || {};
              return (
                <Link
                  key={d._id}
                  to={`/destinations/${d.slug}?source=${source}&date=${travelDate}`}
                  className="card card-hover group block overflow-hidden"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/80 to-transparent p-3">
                      <span className="badge-sky">{d.type}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white">{d.name}</h3>
                    <p className="mt-1 font-mono text-xs text-[#8492A6]">
                      {d.distanceFromEarth}
                    </p>
                    <p className="mt-2 text-sm text-[#8492A6]">
                      {copy.quip || d.description}
                    </p>
                    {copy.fact && (
                      <p className="mt-2 flex items-start gap-1 rounded-lg bg-navy-800 p-2 text-xs text-brand-sky">
                        <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />{" "}
                        {copy.fact}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-navy-600 pt-3">
                      <div className="flex gap-3 text-xs text-[#8492A6]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-brand-sky" />{" "}
                          {d.travelDuration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3 text-brand-teal" />{" "}
                          {d.temperature?.split(" to ")[0]}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-saffron">
                        Details <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

