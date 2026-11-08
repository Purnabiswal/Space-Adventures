import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Ruler, Clock, Gauge, Thermometer, Wind, MapPin, ArrowRight, Sparkles, ShieldCheck, Users, Star, Rocket, Info, AlertTriangle } from 'lucide-react';
import api from '../../api/client.js';
import { Loading, ErrorState } from '../../components/ui.jsx';
import { formatINR, formatDate } from '../../utils/format.js';
import { useAuth } from '../../context/AuthContext.jsx';

const DEST_COPY = {
  moon: { quip: 'Only 3 days away, depending on traffic. No traffic signals yet.', warning: 'Please do not attempt to weigh yourself on the Moon. It will ruin your ego.' },
  mars: { quip: 'Red sand, beautiful views and absolutely no nearby grocery stores.', warning: 'Bring snacks. The nearest shop is 225 million km away.' },
  'earth-orbit': { quip: 'See your house from space. Finding your parked vehicle is not guaranteed.', warning: 'Do not wave at your house. Nobody will wave back.' },
  'orbital-station': { quip: 'Best window seat in human history.', warning: 'Objects float in microgravity. So does your water.' },
  'space-hotel-chandrika': { quip: 'Room with a view. Literally, half the universe.', warning: 'The minibar charges extra for zero-gravity pours.' },
  'lagrange-1': { quip: 'Endless sunshine, zero sunburn. Probably.', warning: 'So isolated even the Wi-Fi gives up.' },
};

export default function DestinationDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const sourceSlug = searchParams.get('source') || 'earth';
  const dateParam = searchParams.get('date');

  const [data, setData] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassData, setSelectedClassData] = useState(null);

  useEffect(() => {
    api.get(`/destinations/${slug}`)
      .then((res) => setData(res.data))
      .catch((e) => setError(e?.response?.data?.message || 'Destination not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setRoutesLoading(true);
    api.get(`/routes/available?source=${sourceSlug}&destination=${slug}&date=${dateParam || ''}`)
      .then((res) => setRoutes(res.data))
      .catch(() => {})
      .finally(() => setRoutesLoading(false));
  }, [slug, sourceSlug, dateParam]);

  const handleSelectClass = (pkg, tc) => {
    setSelectedPkg(pkg);
    setSelectedClass(tc._id);
    setSelectedClassData(tc);
  };

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedPkg || !selectedClass) return;
    navigate(`/booking/passengers?packageId=${selectedPkg._id}&travelClassId=${selectedClass}&source=${sourceSlug || 'earth'}&destination=${slug}&date=${dateParam || ''}&className=${encodeURIComponent(selectedClassData.displayName)}&price=${selectedClassData.price}&pkgName=${encodeURIComponent(selectedPkg.name)}`);
  };

  if (loading) return <div className="bg-black text-white"><Loading /></div>;
  if (error || !data) return <ErrorState message={error} />;
  const { destination: d } = data;
  const copy = DEST_COPY[d.slug] || {};

  const facts = [
    { icon: Ruler, label: 'Distance', value: d.distanceFromEarth },
    { icon: Clock, label: 'Travel Time', value: d.travelDuration },
    { icon: Gauge, label: 'Gravity', value: d.gravity },
    { icon: Thermometer, label: 'Temperature', value: d.temperature },
    { icon: Wind, label: 'Atmosphere', value: d.atmosphere },
  ];

  return (
    <div>
      {/* Hero header */}
      <div className="relative h-[40vh] overflow-hidden bg-black">
        <img
          src={d.image}
          alt={d.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-6">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand-saffron">
            {d.type}
          </p>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            {d.name}
          </h1>
          <p className="mt-2 flex items-center gap-2 font-mono text-sm text-[#B3BECE]">
            <MapPin className="h-4 w-4" /> {d.distanceFromEarth} from Earth
            &middot; via {routes?.source?.name || "Earth"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* LEFT COLUMN – Destination Info (3/5) */}
          <div className="lg:col-span-3">
            <p className="font-display text-xl font-semibold text-white">
              {copy.quip || d.description}
            </p>
            <p className="mt-3 leading-relaxed text-[#8492A6]">
              {d.longDescription}
            </p>

            {/* Fun facts grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="card p-3">
                  <f.icon className="h-4 w-4 text-brand-sky" />
                  <p className="mt-1 text-xs uppercase tracking-wide text-[#8492A6]">
                    {f.label}
                  </p>
                  <p className="text-sm text-white">{f.value}</p>
                </div>
              ))}
            </div>

            {d.highlights?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold text-white">Highlights</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {d.highlights.map((h, i) => (
                    <span key={i} className="badge-neutral">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {d.experiences?.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold text-white">Experiences</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {d.experiences.map((e, i) => (
                    <div key={i} className="card p-4">
                      <p className="font-semibold text-white">{e.title}</p>
                      <p className="mt-1 text-sm text-[#8492A6]">
                        {e.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {copy.warning && (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-brand-coral/30 bg-brand-coral/10 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-brand-coral" />
                <div>
                  <p className="font-semibold text-white">Travel warning</p>
                  <p className="text-sm text-[#8492A6]">{copy.warning}</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN – Spacecraft & Booking (2/5) */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Journey info */}
              {/* Journey info */}
              <div className="card p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white">
                    Your Journey
                  </h2>

                  <Link
                    to="/destinations"
                    className="inline-flex items-center gap-1 text-xs text-brand-sky"
                  >
                    Change <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#8492A6]">
                      From
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {routes?.source?.name || "Earth"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#8492A6]">
                      To
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {d.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[#8492A6]">
                      Date
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {dateParam ? formatDate(dateParam) : "Flexible"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Available Spacecraft */}
              <div>
                <h2 className="text-lg font-bold text-white">
                  Available Spacecraft
                </h2>
                <p className="text-xs text-[#8492A6]">
                  For {routes?.source?.name || "Earth"} &rarr; {d.name}
                </p>
              </div>

              {routesLoading ? (
                <Loading />
              ) : routes?.routes?.length > 0 ? (
                <div className="space-y-3">
                  {routes.routes.map((route) => (
                    <div key={route.package._id} className="card p-4">
                      {/* Spacecraft Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-white">
                              {route.package.name}
                            </h3>

                            <span className="badge-saffron text-[10px]">
                              {route.package.company?.name || "Space Co."}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-[#8492A6]">
                            {route.package.description?.slice(0, 90)}
                            {route.package.description?.length > 90
                              ? "..."
                              : ""}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 text-xs text-[#8492A6]">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-brand-sky" />
                            {route.package.duration}
                          </span>

                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-brand-teal" />
                            {route.package.remainingSeats}
                          </span>
                        </div>
                      </div>

                      {/* Travel Classes */}
                      <div className="mt-3 space-y-2">
                        {route.travelClasses.map((tc) => {
                          // const isSelected = selectedClass === tc._id;
                          const isSelected =
                            selectedPkg?._id === route.package._id &&
                            selectedClass === tc._id;

                          return (
                            <button
                              key={tc._id}
                              onClick={() =>
                                handleSelectClass(route.package, tc)
                              }
                              className={`w-full rounded-lg border px-3 py-2 text-left transition-all ${
                                isSelected
                                  ? "border-brand-saffron bg-brand-saffron/10"
                                  : "border-navy-600 bg-navy-800 hover:border-brand-sky/50"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-white">
                                    {tc.displayName}
                                  </p>

                                  <p className="truncate text-[11px] text-[#8492A6]">
                                    {tc.tagline}
                                  </p>
                                </div>

                                <div className="shrink-0 text-right">
                                  <p className="text-sm font-bold text-brand-saffron">
                                    {formatINR(tc.price)}
                                  </p>

                                  <p className="text-[10px] text-[#8492A6]">
                                    {tc.availableSeats} seats
                                  </p>
                                </div>
                              </div>

                              {isSelected && tc.perks?.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1 border-t border-navy-600 pt-2">
                                  {tc.perks.slice(0, 3).map((p, i) => (
                                    <span
                                      key={i}
                                      className="badge-neutral text-[10px]"
                                    >
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Book button */}
                  {selectedPkg && selectedClassData && (
                    <button
                      onClick={handleBook}
                      className="btn-saffron w-full justify-center !py-2.5 text-sm"
                    >
                      Continue with {selectedClassData.displayName}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="card p-5 text-center">
                  <Rocket className="mx-auto h-7 w-7 text-[#8492A6]" />

                  <p className="mt-2 text-sm text-[#8492A6]">
                    No spacecraft available for this route on the selected date.
                  </p>

                  <p className="mt-1 text-xs text-[#8492A6]">
                    Try a different source, destination, or date.
                  </p>
                </div>
              )}

              {/* Visa check */}
              <div className="card p-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-brand-green" />
                  <span className="font-semibold text-white">
                    Galaxy Visa required
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#8492A6]">
                  You need a valid Space Travel Visa to book.{" "}
                  <Link to="/assessment" className="text-brand-sky">
                    Take the assessment
                  </Link>{" "}
                  if you don't have one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

