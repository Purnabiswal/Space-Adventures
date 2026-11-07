import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import api from '../api/client.js';
import { SectionHeading, Loading, ErrorState } from '../components/ui.jsx';

const QUIPS = {
  isro: 'Government-level ambition. Galactic-level dreams.',
  'skyroot-aerospace': 'Private rockets. Public excitement.',
  pixxel: 'Watching Earth from above. Someone has to keep an eye on us.',
  'agnikul-cosmos': 'Precision launch. Zero drama (mostly).',
  'dhruva-space': 'Building homes above the clouds. Carefully.',
};

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/companies')
      .then((res) => setCompanies(res.data.companies))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl rounded-t-[2.5rem] bg-black px-4 py-16 md:px-8">
        <SectionHeading eyebrow="Partners" title="India's space companies"
          sub="Real organisations building real space tech — with entirely fictional future tourism concepts shown here." />
        {loading ? <Loading /> : error ? <ErrorState message={error} /> : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((c, i) => (
              <Link key={c._id} to={`/companies/${c.slug}`} className="card card-hover group block p-6">
                <div className="flex items-center gap-4">
                  <img src={c.logo} alt={c.name} className="h-16 w-16 rounded-2xl object-cover" loading="lazy" />
                  <div>
                    <h3 className="font-bold text-white">{c.name}</h3>
                    <span className={`badge ${c.type === 'Government' ? 'badge-saffron' : 'badge-sky'}`}>{c.type}</span>
                  </div>
                </div>
                <p className="mt-4 font-medium text-[#B3BECE]">{QUIPS[c.slug] || c.tagline}</p>
                <p className="mt-2 line-clamp-3 text-sm text-[#8492A6]">{c.about}</p>
                <p className="mt-3 flex items-center gap-1 text-xs text-[#8492A6]"><MapPin className="h-3 w-3" /> {c.headquarters}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-saffron">View profile <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


