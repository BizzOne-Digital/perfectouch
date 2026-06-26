import { Link } from 'react-router-dom';
import { Icons } from './Icons';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white border-t border-gray-800">
      {/* CTA Strip */}
      <div className="bg-gradient-to-r from-brand-blue/90 to-blue-800 py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Ready for a Showroom Shine?</h2>
          <p className="text-blue-200 mb-6 text-lg">First-time customers get 50% off — We come to you!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="bg-white text-brand-blue font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Book Your Detail Now
            </Link>
            <a href="tel:8458662430" className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <Icons.Phone /> Call Us Now
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand - Logo */}
        <div>
          <Link to="/" className="inline-block mb-4">
            <img
              src="/logo.png"
              alt="PerfectTouch Auto Detailing"
              className="h-20 w-auto object-contain"
            />
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            Professional mobile auto detailing serving Sullivan County, NY. We bring the shine to you.
          </p>
          <a href="https://www.facebook.com/share/1981d6bG45/?mibextid=wwXIfr" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-white transition-colors">
            <Icons.Facebook /> Follow on Facebook
          </a>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-display text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2">
            {[['/', 'Home'], ['/services', 'Services'], ['/gallery', 'Gallery'], ['/booking', 'Book Now'], ['/contact', 'Contact']].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-gray-500 hover:text-brand-blue transition-colors text-sm flex items-center gap-2">
                  <Icons.ChevronRight />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-lg font-semibold mb-4 text-white">Contact</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="text-brand-blue"><Icons.Phone /></span>
              <a href="tel:8458662430">845-866-2430</a>
            </li>
            <li className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="text-brand-blue"><Icons.Mail /></span>
              <a href="mailto:perfecttouch.autodetailing29@gmail.com" className="break-all">
                perfecttouch.autodetailing29@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-blue"><Icons.Location /></span>
              <span>Sullivan County, NY<br/>We come to your location!</span>
            </li>
          </ul>
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-white mb-2">Our Services</h4>
            <div className="flex flex-wrap gap-2">
              {['Interior Detail', 'Exterior Detail', 'Full Detail'].map(s => (
                <span key={s} className="text-xs bg-gray-800 border border-gray-700 px-3 py-1 rounded-full text-gray-400">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 px-4 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} PerfectTouch Auto Detailing. All rights reserved.</p>
          <p>Built for Sullivan County, NY</p>
        </div>
      </div>
    </footer>
  );
}