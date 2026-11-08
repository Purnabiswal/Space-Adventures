import { Link } from 'react-router-dom';
import { Rocket, Mail, MapPin, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-navy-800 bg-black text-[#8492A6]">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy-800"><Rocket className="h-4 w-4 text-brand-saffron" /></span>
              <span className="font-display text-lg font-bold text-white">ANTARIKSH</span>
            </div>
            <p className="mt-3 text-sm text-[#8492A6]">
              India's gateway to space. Moon vacations, zero gravity and questionable life decisions — a fictional simulation.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-brand-saffron" to="/destinations">Destinations</Link></li>
              <li><Link className="hover:text-brand-saffron" to="/companies">Space Companies</Link></li>
              {/* <li><Link className="hover:text-brand-saffron" to="/adventures">Adventures</Link></li> */}
              <li><Link className="hover:text-brand-saffron" to="/assessment">Astronaut Training</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="hover:text-brand-saffron" to="/login">Login</Link></li>
              <li><Link className="hover:text-brand-saffron" to="/register">Register</Link></li>
              {/* <li><Link className="hover:text-brand-saffron" to="/verify">Verify Ticket</Link></li> */}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Mission Control</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-sky" /> hello@antariksh.test</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-sky" /> Bengaluru, India</li>
              <li className="flex items-start gap-2 text-amber-400/90"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> Simulation only — no real humans have left Earth through us yet.</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-navy-800 pt-6 text-center text-xs text-[#8492A6]">
          © {new Date().getFullYear()} ANTARIKSH. All space-tourism offerings are fictional future concepts, not real services of ISRO or the companies listed.
        </div>
      </div>
    </footer>
  );
}


