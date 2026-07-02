import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { Icons } from '../../components/public/Icons';
import api from '../../utils/api';

const SERVICES = [
  { name: 'Interior Detail', price: 149, duration: '2–3 hours', description: "Bring your vehicle's interior back to life with a deep cleaning designed to remove dirt, dust, and everyday buildup.", features: ['Full vacuum of seats, floors, and trunk', 'Shampoo upholstery & floor mats', 'Dashboard, console & trim wipe-down', 'Window cleaning (interior)', 'Door panel cleaning', 'Air vent detailing', 'Odor elimination treatment'], gradient: 'from-blue-600 to-blue-800' },
  { name: 'Exterior Detail', price: 119, duration: '1.5–2 hours', description: 'Comprehensive exterior detailing including wash, wheel and tire cleaning, and finish enhancement to restore shine and protection.', features: ['Professional hand wash & rinse', 'Wheel & rim cleaning', 'Tire cleaning & shine application', 'Exterior window cleaning', 'Paint surface wipe & protection', 'Chrome & trim restoration', 'Door jamb cleaning'], gradient: 'from-blue-500 to-indigo-700', popular: true },
  { name: 'Full Detail', price: 249, duration: '4–5 hours', description: "Our Full Detail service combines interior and exterior detailing to give your vehicle a fresh, well-maintained appearance.", features: ['Everything in Interior Detail', 'Everything in Exterior Detail', 'Full interior shampoo & extraction', 'Spray ceramic sealant', 'Priority scheduling & booking'], gradient: 'from-indigo-600 to-blue-900' }
];

export default function ServicesPage() {
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    api.get('/addons').then(r => setAddons(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen font-body bg-gray-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-widest">Professional Mobile Detailing</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mt-2 mb-4">Our <span className="text-brand-blue">Services</span></h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Three professional packages to keep your vehicle looking its best. All services include our satisfaction guarantee.</p>
            <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full px-6 py-2.5 mt-4">
              <span className="text-brand-blue"><Icons.Tag /></span>
              <span className="text-brand-blue font-semibold">First-time customers get 15% off any service!</span>
            </div>
          </div>
          <div className="space-y-8">
            {SERVICES.map((s, idx) => (
              <div key={s.name} className={`bg-gray-900 rounded-3xl overflow-hidden border ${s.popular ? 'border-brand-blue shadow-lg shadow-brand-blue/20' : 'border-gray-800'}`}>
                {s.popular && (
                  <div className={`bg-gradient-to-r ${s.gradient} text-white text-center py-2 text-sm font-bold tracking-wide`}>
                    ⭐ Most Popular Choice
                  </div>
                )}
                <div className="p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}>
                      {idx === 0 && <Icons.Sparkle />}
                      {idx === 1 && <Icons.Car />}
                      {idx === 2 && <Icons.Shield />}
                    </div>
                    <h2 className="font-display text-3xl font-bold text-white">{s.name}</h2>
                    <div className="flex items-center gap-4 my-3">
                      <span className="text-4xl font-bold text-brand-blue">${s.price}</span>
                      <span className="text-gray-500 flex items-center gap-1"><Icons.Clock />{s.duration}</span>
                    </div>
                    <p className="text-gray-500 leading-relaxed mb-6">{s.description}</p>
                    <Link to="/booking" className={`inline-flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl transition-all ${s.popular ? 'btn-primary' : 'btn-outline'}`}>
                      Book {s.name} <Icons.ArrowRight />
                    </Link>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="font-semibold text-white mb-4">What's Included:</h3>
                    <ul className="space-y-2.5">
                      {s.features.map(f => (
                        <li key={f} className="flex items-center gap-3 text-gray-400">
                          <span className="text-brand-blue"><Icons.CheckCircle /></span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {addons.length > 0 && (
            <div className="mt-24">
              <div className="text-center mb-12">
                <span className="text-brand-blue font-semibold text-sm uppercase tracking-widest">Customize Your Detail</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Popular <span className="text-brand-blue">Add-ons</span></h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">Add any of these extras to your service for a more complete finish.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {addons.map(a => (
                  <div key={a._id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-blue transition-all group">
                    <div className="aspect-video bg-gray-800 relative overflow-hidden">
                      {a.image ? (
                        <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700"><Icons.Image /></div>
                      )}
                      <div className="absolute top-3 right-3 bg-brand-blue text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">${a.price}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-bold text-white">{a.name}</h3>
                      {a.duration && (
                        <div className="text-gray-500 text-sm flex items-center gap-1 mt-1"><Icons.Clock />{a.duration}</div>
                      )}
                      {a.description && <p className="text-gray-500 text-sm mt-2 leading-relaxed">{a.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/booking" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5">
                  Book & Add Extras <Icons.ArrowRight />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}