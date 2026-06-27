import { useEffect, useMemo, useState } from 'react';
import { FiGithub, FiMenu, FiX } from 'react-icons/fi';
import { Link, NavLink, useLocation } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  const sectionLinkClass = (hash) =>
    `transition-colors duration-200 ${
      location.pathname === '/' && location.hash === hash
        ? 'text-indigo-600'
        : 'text-slate-600 hover:text-slate-950'
    }`;

  const mobileLinkClass = (hash) =>
    `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
      location.pathname === '/' && location.hash === hash
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  const navItems = useMemo(
    () => [
      { label: 'Home', to: '/#hero', hash: '#hero' },
      { label: 'Features', to: '/#features', hash: '#features' },
      { label: 'How It Works', to: '/#how-it-works', hash: '#how-it-works' },
      { label: 'About', to: '/about', hash: '' },
    ],
    [],
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? 'border-white/60 bg-white/75 backdrop-blur-xl shadow-sm'
          : 'border-transparent bg-white/40 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/#hero" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
            N
          </span>
          <span className="text-xl font-semibold tracking-tight text-slate-950">NexML</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) =>
            item.hash ? (
              <Link key={item.label} to={item.to} className={sectionLinkClass(item.hash)}>
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-950'}`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950"
          >
            <FiGithub />
            GitHub
          </a>
          <Link
            to="/#hero"
            className="inline-flex items-center rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-slate-200/70 bg-white/90 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          isMenuOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
          {navItems.map((item) =>
            item.hash ? (
              <Link key={item.label} to={item.to} className={mobileLinkClass(item.hash)}>
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}

          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
          >
            <FiGithub />
            GitHub
          </a>
          <Link
            to="/#hero"
            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;