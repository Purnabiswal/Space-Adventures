import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Building2, Globe2, Briefcase, Layers, HelpCircle, TicketIcon, ShieldCheck } from 'lucide-react';
import api from '../api/client.js';
import { Loading, ErrorState } from '../components/ui.jsx';
import { formatINR, formatDate } from '../utils/format.js';

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'bookings', label: 'Bookings', icon: TicketIcon },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'companies', label: 'Companies', icon: Building2 },
  { key: 'destinations', label: 'Destinations', icon: Globe2 },
  { key: 'packages', label: 'Packages', icon: Briefcase },
  { key: 'classes', label: 'Travel Classes', icon: Layers },
  { key: 'questions', label: 'Question Bank', icon: HelpCircle },
  { key: 'results', label: 'Assessments', icon: ShieldCheck },
  { key: 'visas', label: 'Visas', icon: ShieldCheck },
];

function statusPill(status) {
  if (status === 'confirmed' || status === 'active') return 'bg-brand-green/20 text-brand-green';
  if (status === 'cancelled' || status === 'inactive') return 'bg-brand-coral/20 text-brand-coral';
  return 'bg-black text-[#B3BECE]';
}

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [classes, setClasses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/admin/stats'), api.get('/admin/bookings'), api.get('/admin/users'), api.get('/admin/companies'),
      api.get('/admin/destinations'), api.get('/admin/packages'), api.get('/admin/travel-classes'),
      api.get('/admin/questions'), api.get('/admin/assessment-results'), api.get('/admin/visas'),
    ])
      .then(([s, b, u, c, d, p, cl, q, r, v]) => {
        setStats(s.data.stats); setBookings(b.data.bookings); setUsers(u.data.users);
        setCompanies(c.data.companies); setDestinations(d.data.destinations); setPackages(p.data.packages);
        setClasses(cl.data.travelClasses); setQuestions(q.data.questions); setResults(r.data.attempts); setVisas(v.data.visas);
      })
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load admin data'))
      .finally(() => setLoading(false));
  }, [refresh]);

  const act = async (path, method = 'put', body) => {
    try { await api[method](path, body); setMessage('Updated successfully'); setRefresh((r) => r + 1); }
    catch (e) { setError(e?.response?.data?.message || 'Action failed'); }
  };

  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-7xl rounded-t-[2.5rem] bg-black px-4 py-10 text-white md:px-8">
        <h1 className="font-display text-3xl font-extrabold text-white">Mission Control</h1>
        <p className="mt-1 text-[#8492A6]">Also known as the admin dashboard. Handle with care — real humans have life decisions riding on this.</p>
        {message && <p className="mt-3 rounded-lg bg-brand-green/20 p-3 text-sm text-brand-green">{message}</p>}
        {error && <p className="mt-3 rounded-lg bg-brand-coral/20 p-3 text-sm text-brand-coral">{error}</p>}

        {loading ? <div className="text-white"><Loading /></div> : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
            <nav className="space-y-1">
              {TABS.map((t, i) => (
                <button key={t.key} onClick={() => { setTab(i); setMessage(''); setError(''); }}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${tab === i ? 'bg-navy-800 text-white' : 'text-[#8492A6] hover:bg-black hover:text-white'}`}>
                  <t.icon className="h-4 w-4" /> {t.label}
                </button>
              ))}
            </nav>

            <div>
              {tab === 0 && stats && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { l: 'Users', v: stats.users }, { l: 'Companies', v: stats.companies }, { l: 'Destinations', v: stats.destinations },
                    { l: 'Packages', v: stats.packages }, { l: 'Bookings', v: stats.bookings }, { l: 'Assessments', v: stats.attempts }, { l: 'Visas', v: stats.visas },
                  ].map((s) => (
                    <div key={s.l} className="card p-5">
                      <p className="text-sm text-[#8492A6]">{s.l}</p>
                      <p className="font-display text-3xl font-bold text-white">{s.v}</p>
                    </div>
                  ))}
                </div>
              )}

              {tab === 1 && (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                      <div>
                        <p className="font-semibold text-white">{b.passengerName}</p>
                        <p className="font-mono text-xs text-[#8492A6]">{b.bookingReference} · {b.destination?.name} · {formatINR(b.totalPrice)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`status-pill ${statusPill(b.status)}`}>{b.status}</span>
                        <select value={b.status} onChange={(e) => act(`/admin/bookings/${b._id}/status`, 'put', { status: e.target.value })}
                          className="rounded-lg border border-navy-500 bg-black px-2 py-1 text-sm text-white">
                          {['confirmed', 'cancelled', 'completed', 'expired'].map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 2 && (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th></tr></thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="font-medium">{u.name}</td><td>{u.email}</td>
                          <td>
                            <select value={u.role} onChange={(e) => act(`/admin/users/${u._id}`, 'put', { role: e.target.value })}
                              className="rounded border border-navy-500 bg-black px-2 py-1 text-sm text-white">
                              <option>user</option><option>admin</option>
                            </select>
                          </td>
                          <td>
                            <button onClick={() => act(`/admin/users/${u._id}`, 'put', { isActive: !u.isActive })} className={`status-pill ${statusPill(u.isActive ? 'active' : 'inactive')}`}>
                              {u.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 3 && <SimpleList title="Companies" rows={companies.map((c) => ({ id: c._id, main: c.name, sub: `${c.type} · ${c.headquarters}` }))} />}
              {tab === 4 && <SimpleList title="Destinations" rows={destinations.map((d) => ({ id: d._id, main: d.name, sub: d.type }))} />}
              {tab === 5 && <SimpleList title="Packages" rows={packages.map((p) => ({ id: p._id, main: p.name, sub: `${p.company?.name} · ${formatINR(p.basePrice)} · ${p.duration}` }))} />}
              {tab === 6 && <SimpleList title="Travel Classes" rows={classes.map((c) => ({ id: c._id, main: c.name, sub: `×${c.baseMultiplier} · ${c.company?.name || 'Global'}` }))} />}

              {tab === 7 && (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Category</th><th>Question</th></tr></thead>
                    <tbody>
                      {questions.map((q) => (
                        <tr key={q._id}>
                          <td><span className="badge-sky">{q.category}</span></td>
                          <td>{q.question}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 8 && (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>User</th><th>Score</th><th>Result</th><th>Date</th></tr></thead>
                    <tbody>
                      {results.map((a) => (
                        <tr key={a._id}>
                          <td className="font-medium">{a.user?.name}</td>
                          <td>{a.percentage}% ({a.score}/{a.questions?.length})</td>
                          <td>{a.passed ? <span className="font-semibold text-brand-green">Passed</span> : <span className="text-brand-coral">Failed</span>}</td>
                          <td>{formatDate(a.submittedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tab === 9 && (
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Visa</th><th>User</th><th>Status</th><th>Expires</th></tr></thead>
                    <tbody>
                      {visas.map((v) => (
                        <tr key={v._id}>
                          <td className="font-mono">{v.visaNumber}</td>
                          <td className="font-medium">{v.user?.name}</td>
                          <td><span className={`status-pill ${statusPill(v.status)}`}>{v.status}</span></td>
                          <td>{formatDate(v.expiresAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SimpleList({ title, rows }) {
  return (
    <div className="card overflow-x-auto">
      <h3 className="border-b border-navy-600 p-4 font-semibold text-white">{title} ({rows.length})</h3>
      <div className="divide-y divide-navy-50">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-white">{r.main}</p>
              <p className="text-xs text-[#8492A6]">{r.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


