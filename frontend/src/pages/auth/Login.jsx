import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { errorMessage } from '../../utils/format.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      navigate(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (e2) {
      setErr(errorMessage(e2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center bg-black px-4 py-16 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80')] bg-cover bg-center opacity-20" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-navy-800/95 p-8 shadow-card-lg backdrop-blur">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-black"><Rocket className="h-5 w-5 text-brand-saffron" /></span>
          <span className="font-display text-xl font-bold text-white">Welcome back, Earthling.</span>
        </div>
        <p className="mb-4 text-sm text-[#8492A6]">We were starting to think you'd given up on escaping.</p>
        {err && <p className="mb-4 rounded-xl border border-brand-coral/40 bg-brand-coral/10 p-3 text-sm text-brand-coral">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label-dark">Email</label>
            <input className="input-dark" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></div>
          <div><label className="label-dark">Password</label>
            <input className="input-dark" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></div>
          <button type="submit" disabled={loading} className="btn-saffron w-full justify-center !py-3">{loading ? 'Authorising…' : 'Login'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-[#8492A6]">
          New to ANTARIKSH? <Link to="/register" className="font-medium text-brand-saffron">Create an account</Link>
        </p>
        <p className="mt-3 rounded-lg bg-black/5 p-2 text-center font-mono text-xs text-[#8492A6]">Demo: aarav@antariksh.test / password123</p>
      </div>
    </div>
  );
}



