import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight } from 'lucide-react';
import api from '../../api/client.js';
import { SectionHeading, Loading, ErrorState } from '../../components/ui.jsx';
import { formatINR } from '../../utils/format.js';

const PKG_QUIPS = {
  'moon-escape': 'Because weekend trips to Goa are getting predictable.',
  'mars-expedition': 'Pack your bags. Oxygen is not complimentary.',
  'zero-gravity-experience': 'Finally, a chance to ignore gravity legally.',
  'earth-orbital-sightseeing': 'Best window seat in human history.',
  'space-station-stay': 'Hotel 400km up. The view never gets old.',
  'luxury-chandrika-retreat': 'Five-star service. Zero-star gravity (in a good way).',
  'l1-solar-retreat': 'So close to the Sun, yet so far from a sunburn.',
};

export default function Adventures() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/packages')
      .then((res) => setPackages(res.data.packages))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl rounded-t-[2.5rem] bg-black px-4 py-16 md:px-8">
        <SectionHeading eyebrow="Adventures" title="Choose your escape route"
          sub="You'll need a Space Travel Visa to book. Oxygen sold separately on some missions." />
        {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p, i) => (
              <Link key={p._id} to={`/adventures/${p.slug}`} className="card card-hover group block overflow-hidden">
                <div className="relative h-52 overflow-hidden">
                  <img src={p.coverImage || p.images?.[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/80 to-transparent p-3 flex justify-between items-center">
                    <span className="badge-saffron">{p.difficulty}</span>
                    <span className="badge-sky">{p.company?.name}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white">{p.name}</h3>
                  <p className="mt-1 font-medium text-brand-sky text-sm">{PKG_QUIPS[p.slug] || p.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-navy-600 pt-4">
                    <div className="flex gap-4 text-xs text-[#8492A6]">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.duration}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.remainingSeats ?? (p.totalSeats - p.bookedSeats)} seats</span>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-brand-saffron">{formatINR(p.basePrice)}</p>
                      <span className="inline-flex items-center gap-1 text-xs text-brand-sky">Book <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



