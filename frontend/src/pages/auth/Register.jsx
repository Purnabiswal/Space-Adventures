import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { errorMessage } from '../../utils/format.js';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', nationality: 'Indian' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password.length < 6) { setErr('Password must be at least 6 characters. Space is no excuse.'); return; }
    setLoading(true);
    try {
      const u = await register(form);
      navigate('/dashboard');
    } catch (e2) {
      setErr(errorMessage(e2));
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center bg-black px-4 py-16 text-white">
      <div className="relative w-full max-w-md rounded-2xl border border-white/20 bg-navy-800/95 p-8 shadow-card-lg backdrop-blur">
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-800">
            {/* <img src="/public/logo.png" alt="" srcset="" /> */}
            <img
              src="https://res.cloudinary.com/duudfsjc6/image/upload/v1794134308/Space_Adventures__Cosmic_Orbit.png"
              alt=""
              srcset=""
            />
          </span>
          <span className="font-display text-xl font-bold text-white">
            Become an Astronaut
          </span>
        </div>
        <p className="mb-4 text-sm text-[#8492A6]">
          First step: leave Earth. First step of first step: make an account.
        </p>
        {err && (
          <p className="mb-4 rounded-xl border border-brand-coral/40 bg-brand-coral/10 p-3 text-sm text-brand-coral">
            {err}
          </p>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label-dark">Full name</label>
            <input
              className="input-dark"
              type="text"
              required
              value={form.name}
              onChange={set("name")}
              placeholder="Purna Biswal"
            />
          </div>
          <div>
            <label className="label-dark">Email</label>
            <input
              className="input-dark"
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-dark">Phone</label>
              <input
                className="input-dark"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+91"
              />
            </div>
            <div>
              <label className="label-dark">Nationality</label>
              <input
                className="input-dark"
                value={form.nationality}
                onChange={set("nationality")}
              />
            </div>
          </div>
          <div>
            <label className="label-dark">Password</label>
            <input
              className="input-dark"
              type="password"
              required
              value={form.password}
              onChange={set("password")}
              placeholder="Min 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-saffron w-full justify-center !py-3"
          >
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#8492A6]">
          Already aboard?{" "}
          <Link to="/login" className="font-medium text-brand-saffron">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}



