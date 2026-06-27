import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from './Icons';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-950/95 backdrop-blur-md shadow-lg shadow-black/40 border-b border-gray-800'
               : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/">
            <img
              src="/logo.png"
              alt="PerfectTouch Auto Detailing"
              className="h-14 w-auto object-contain drop-shadow-lg"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`font-medium text-sm tracking-wide transition-colors duration-200 relative group ${
                  location.pathname === l.to ? 'text-brand-blue' : 'text-gray-300 hover:text-white'
                }`}>
                {l.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-blue transition-all duration-300 ${
                  location.pathname === l.to ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:8458662430" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <Icons.Phone />
              <span>845-866-2430</span>
            </a>
            <Link to="/booking" className="btn-primary text-sm py-2.5 px-6">
              Book Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-300 hover:text-white">
            {open ? <Icons.Close /> : <Icons.Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  location.pathname === l.to ? 'bg-brand-blue/20 text-brand-blue' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}>
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-800">
              <a href="tel:8458662430" className="flex items-center gap-2 px-4 py-3 text-gray-400">
                <Icons.Phone />
                <span>845-866-2430</span>
              </a>
              <Link to="/booking" className="block text-center btn-primary mt-2 py-3">
                Book Now — 15% Off First Visit!
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}