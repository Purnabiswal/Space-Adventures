import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Rocket, Menu, X, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/companies', label: 'Space Companies' },
  // { to: '/adventures', label: 'Adventures' },
  { to: '/assessment', label: 'Astronaut Training' },
  { to: '/store', label: 'Space Store' },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  const navCls = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-saffron' : 'text-[#B3BECE] hover:text-white'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-navy-600 bg-black/[0.9] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy-800">
            {/* <img src="/public/logo.png" alt="" srcset="" /> */}
            <img
              src="https://res.cloudinary.com/duudfsjc6/image/upload/v1794134308/Space_Adventures__Cosmic_Orbit.png"
              alt=""
              srcset=""
            />
          </span>
          <span className="font-display text-lg font-bold tracking-wide text-white">
            ANTARIKSH
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navCls}>
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className="flex items-center gap-1 text-sm font-medium text-brand-saffron hover:text-brand-sky"
            >
              <ShieldCheck className="h-4 w-4" /> Admin
            </NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-navy-600"
              >
                <LayoutDashboard className="h-4 w-4" />{" "}
                {user.name.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                className="rounded-xl p-2 text-[#B3BECE] hover:bg-black hover:text-white"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[#B3BECE] hover:text-white"
              >
                Login
              </Link>
              <Link to="/register" className="btn-saffron !px-4 !py-2 text-sm">
                Become an Astronaut
              </Link>
            </>
          )}
        </div>

        <button className="text-white md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-navy-600 bg-navy-950 px-4 pb-4 pt-2 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-2 text-[#B3BECE] hover:text-white"
            >
              {l.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setOpen(false)}
              className="block py-2 text-brand-saffron"
            >
              Admin
            </NavLink>
          )}
          {user ? (
            <div className="mt-2 flex items-center gap-3 border-t border-navy-600 pt-3">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="btn-navy flex-1 justify-center text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="btn-saffron flex-1 justify-center text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-3 border-t border-navy-600 pt-3">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="btn-ghost flex-1 justify-center text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="btn-saffron flex-1 justify-center text-sm"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}


