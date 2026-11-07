import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Calendar, AlertTriangle, ArrowRight, Rocket, Building2 } from 'lucide-react';
import api from '../api/client.js';
import { Loading, ErrorState } from '../components/ui.jsx';
import { formatINR } from '../utils/format.js';

const QUIPS = {
  isro: 'Government-level ambition. Galactic-level dreams.',
  'skyroot-aerospace': 'Private rockets. Public excitement.',
  pixxel: 'Watching Earth from above. Someone has to keep an eye on us.',
  'agnikul-cosmos': 'Precision launch. Zero drama (mostly).',
  'dhruva-space': 'Building homes above the clouds. Carefully.',
};

export default function CompanyDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/companies/${slug}`)
      .then((res) => setData(res.data))
      .catch((e) => setError(e?.response?.data?.message || 'Company not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="bg-black text-white"><Loading /></div>;
  if (error || !data) return <ErrorState message={error} />;
  const { company: c, packages } = data;

  return (
    <div>
      <div className="relative h-52 overflow-hidden bg-black">
        <img src={c.coverImage} alt={c.name} className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
      </div>
      <div className="mx-auto mt-20 max-w-7xl px-4">
        <div className="-mt-14 flex flex-col gap-4 md:flex-row md:items-end">
          <img src={c.logo} alt={c.name} className="h-28 w-28 rounded-2xl border-4 border-navy-900 bg-black object-cover shadow-card-lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl font-extrabold text-white">{c.name}</h1>
              <span className={`badge ${c.type === 'Government' ? 'badge-saffron' : 'badge-sky'}`}>{c.type}</span>
            </div>
            <p className="mt-1 flex flex-wrap gap-4 text-sm text-[#8492A6]">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {c.headquarters}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Founded {c.founded}</span>
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <p className="font-display text-xl font-semibold text-white">{QUIPS[c.slug] || c.tagline}</p>
            <div>
              <h2 className="text-xl font-bold text-white">About</h2>
              <p className="mt-2 leading-relaxed text-[#8492A6]">{c.about}</p>
            </div>

            <div className="rounded-2xl border border-brand-saffron/30 bg-brand-saffron/10 p-5">
              <h3 className="flex items-center gap-2 font-semibold text-brand-saffron"><AlertTriangle className="h-5 w-5" /> Real-world scope</h3>
              <p className="mt-2 text-sm text-[#B3BECE]">{c.realWorldScope}</p>
              <p className="mt-2 text-xs text-brand-saffron/70">{c.fictionalDisclaimer}</p>
            </div>

            {/* {c.futureConcepts?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white">Fictional future concepts</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.futureConcepts.map((f, i) => <span key={i} className="badge-neutral"><Rocket className="h-3 w-3" /> {f}</span>)}
                </div>
              </div>
            )} */}
          </div>

          {/* <aside className="card h-fit p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white"><Building2 className="h-5 w-5 text-brand-sky" /> One-liner</h2>
            <p className="mt-2 text-sm text-[#8492A6]">{c.tagline}</p>
          </aside> */}
        </div>

        {/* {packages?.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title">Adventures by {c.name}</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {packages.map((p) => (
                <Link key={p._id} to={`/adventures/${p.slug}`} className="card card-hover group block overflow-hidden">
                  <div className="relative h-44 overflow-hidden">
                    <img src={p.coverImage || p.images?.[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/80 to-transparent p-3">
                      <span className="badge-sky">{p.destination?.name}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-white">{p.name}</h3>
                    <p className="mt-1 text-xs text-[#8492A6]">{p.duration}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-display font-bold text-brand-saffron">{formatINR(p.basePrice)}</span>
                      <ArrowRight className="h-4 w-4 text-brand-sky" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}


