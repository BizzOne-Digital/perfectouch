import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import BeforeAfterSlider from '../../components/public/BeforeAfterSlider';
import { Icons } from '../../components/public/Icons';
import api from '../../utils/api';

const HERO_BG = 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1600&q=80';
const BEFORE_1 = '/int1.png';
const AFTER_1 = '/int2.png';
const BEFORE_2 = '/ext1.png';
const AFTER_2 = '/ext2.png';

const SERVICES_DATA = [
  { name: 'Interior Detail', price: '$149', duration: '2–3 hrs', features: ['Deep vacuum & shampoo', 'Dashboard & console wipe-down', 'Window cleaning', 'Seat & upholstery cleaning', 'Door panels & trunk', 'Odor elimination'], color: 'from-blue-600 to-blue-800' },
  { name: 'Exterior Detail', price: '$119', duration: '1.5–2 hrs', features: ['Hand wash & rinse', 'Wheel & tire cleaning', 'Tire shine', 'Exterior window clean', 'Paint protection wipe-down', 'Trim restoration'], color: 'from-blue-500 to-indigo-700', popular: true },
  { name: 'Full Detail', price: '$249', duration: '4–5 hrs', features: ['Full interior detail', 'Full exterior detail', 'Spray ceramic sealant', 'Priority scheduling'], color: 'from-indigo-600 to-blue-900' }
];

const TESTIMONIALS = [
  { name: 'Mike R.', rating: 5, text: "Joshua did an incredible job on my truck — looked brand new! Mobile service is super convenient and the price is unbeatable." },
  { name: 'Sarah T.', rating: 5, text: "Used the 15% first-time discount and I'm blown away by the results. My car hasn't looked this clean since I bought it!" },
  { name: 'James K.', rating: 5, text: "Fast, professional, and thorough. He came to my office while I worked. The full detail was worth every penny." }
];

export default function HomePage() {
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    api.get('/gallery').then(r => setGalleryItems(r.data)).catch(() => {});
  }, []);

  const beforeAfterItems = galleryItems.filter(g => g.type === 'before-after');

  const displayBeforeAfter = beforeAfterItems.length >= 2 ? beforeAfterItems : [
    { beforeImage: BEFORE_1, afterImage: AFTER_1, description: 'Interior Deep Clean' },
    { beforeImage: BEFORE_2, afterImage: AFTER_2, description: 'Exterior Shine Restore' }
  ];

  return (
    <div className="min-h-screen font-body bg-gray-950">
      <Navbar />

      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="Auto Detailing" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/95 to-gray-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
        </div>
        {/* Animated orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-blue-800/10 rounded-full blur-3xl animate-pulse" style={{animationDelay:'1s'}} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
              Serving Sullivan County, NY
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              We Bring the
              <span className="text-brand-blue block text-glow">Shine to You</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Professional mobile auto detailing — at your home, office, or wherever you are. Premium results without the hassle of driving to a shop.
            </p>
            <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-5 py-3 mb-8">
              <span className="text-yellow-400"><Icons.Tag /></span>
              <span className="text-yellow-400 font-bold text-lg">15% OFF</span>
              <span className="text-gray-400">your first detail — limited time!</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/booking" className="btn-primary text-center text-lg py-4 px-10 shadow-xl shadow-blue-500/30">
                Book Now — 15% Off!
              </Link>
              <a href="tel:8458662430" className="flex items-center justify-center gap-2 border-2 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-all font-semibold py-4 px-8 rounded-lg">
                <Icons.Phone /> Call 845-866-2430
              </a>
            </div>
            <div className="flex flex-wrap gap-8">
              {[['100%', 'Satisfaction'], ['Mobile', 'Service'], ['Sullivan Co.', 'Coverage'], ['Licensed', 'Detailer']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display text-2xl font-bold text-brand-blue">{val}</div>
                  <div className="text-gray-500 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs">
          <span>Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-gray-600 to-transparent" />
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section className="py-20 bg-gray-950" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h2 className="section-title text-white mt-2">Our <span className="text-brand-blue">Services</span></h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Professional detailing packages — all delivered at your location.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service, idx) => (
              <div key={service.name} className={`relative bg-gray-900 rounded-2xl overflow-hidden card-hover border ${service.popular ? 'border-brand-blue shadow-lg shadow-brand-blue/20' : 'border-gray-800'}`}>
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
                )}
                <div className={`h-1.5 bg-gradient-to-r ${service.color}`} />
                <div className="p-8">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                    {idx === 0 && <Icons.Sparkle />}
                    {idx === 1 && <Icons.Car />}
                    {idx === 2 && <Icons.Shield />}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-1">{service.name}</h3>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl font-bold text-brand-blue">{service.price}</span>
                    <span className="text-gray-500 text-sm flex items-center gap-1"><Icons.Clock />{service.duration}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {service.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="text-brand-blue"><Icons.CheckCircle /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking" className={`block text-center font-semibold py-3 rounded-lg transition-all ${service.popular ? 'btn-primary' : 'btn-outline'}`}>
                    Book This Service
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl px-8 py-4">
              <span className="text-brand-blue"><Icons.Tag /></span>
              <p className="text-gray-300">
                <span className="font-bold text-brand-blue">First-Time Customers: </span>
                Get <span className="font-bold text-brand-blue">15% off</span> any service!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== BEFORE / AFTER ====== */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-widest">Results That Speak</span>
            <h2 className="section-title text-white mt-2">Before <span className="text-brand-blue">&</span> After</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Drag the slider to see the transformation. Real results from real clients.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayBeforeAfter.slice(0, 4).map((item, idx) => (
              <div key={idx}>
                <BeforeAfterSlider
                  before={item.beforeImage}
                  after={item.afterImage}
                  label={item.description || `Detail Job ${idx + 1}`}
                />
                {item.description && (
                  <p className="text-center text-sm text-gray-500 mt-3 font-medium">{item.description}</p>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery" className="btn-outline inline-flex items-center gap-2">
              View Full Gallery <Icons.ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== VIDEO SECTION ====== */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-widest">See Us In Action</span>
            <h2 className="section-title text-white mt-2">Watch the <span className="text-brand-blue">Process</span></h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">See how PerfectTouch transforms vehicles — precision and care in every step.</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-blue-500/10 bg-gray-900">
            <video
              className="w-full aspect-video object-cover"
              controls
              playsInline
              preload="metadata"
            >
              <source src="/vid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-brand-blue/20 pointer-events-none" />
          </div>
          <p className="text-center text-gray-600 text-sm mt-4">Professional Mobile Auto Detailing · Sullivan County, NY</p>
        </div>
      </section>

      {/* ====== WHY CHOOSE US ====== */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-blue font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
              <h2 className="section-title text-white mt-2 mb-6">The <span className="text-brand-blue">PerfectTouch</span> Difference</h2>
              <div className="space-y-5">
                {[
                  ['We Come to You', 'No need to drive anywhere. We bring pro-grade equipment directly to your location — home, office, or anywhere in Sullivan County.', Icons.Location],
                  ['Expert Attention to Detail', 'Every vehicle is treated with the same care and precision. We use professional products designed to protect and enhance your vehicle.', Icons.Shield],
                  ['Fast & Reliable', 'We show up on time, work efficiently, and deliver results you can be proud of. Punctuality and quality go hand in hand.', Icons.Clock],
                  ['Satisfaction Guaranteed', "We're not done until you're happy. Your satisfaction is our top priority, every single time.", Icons.CheckCircle]
                ].map(([title, desc, Icon]) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-white mb-1">{title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand-blue to-blue-900 rounded-3xl p-10 text-white border border-brand-blue/30 shadow-2xl shadow-blue-500/20">
              <h3 className="font-display text-3xl font-bold mb-2">First Time Customer?</h3>
              <p className="text-blue-200 mb-6 text-lg">Save 15% on your first detail!</p>
              <div className="space-y-3 mb-8">
                {[['Interior Detail', '$149', '$126.65'], ['Exterior Detail', '$119', '$101.15'], ['Full Detail', '$249', '$211.65']].map(([s, orig, disc]) => (
                  <div key={s} className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3 border border-white/10">
                    <span className="font-medium">{s}</span>
                    <div className="text-right">
                      <span className="line-through text-blue-300 text-sm mr-2">{orig}</span>
                      <span className="font-bold text-xl">{disc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/booking" className="block text-center bg-white text-brand-blue font-bold py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg">
                Claim Your 15% Discount
              </Link>
              <p className="text-blue-300 text-xs text-center mt-3">Check "First Time Customer" when booking</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-widest">Client Reviews</span>
            <h2 className="section-title text-white mt-2">What Our Clients <span className="text-brand-blue">Say</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-gray-900 rounded-2xl p-7 border border-gray-800 card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Icons.Star key={i} />)}
                </div>
                <p className="text-gray-400 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-gray-600">Verified Client</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-20 bg-gradient-to-r from-brand-blue to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Ready to Book Your Detail?</h2>
          <p className="text-blue-200 text-lg mb-8">We serve all of Sullivan County, NY. Book online or call us directly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="bg-white text-brand-blue font-bold px-10 py-4 rounded-xl hover:bg-blue-50 transition-all text-lg shadow-xl">
              Book Online Now
            </Link>
            <a href="tel:8458662430" className="border-2 border-white text-white font-bold px-10 py-4 rounded-xl hover:bg-white/10 transition-all text-lg flex items-center justify-center gap-2">
              <Icons.Phone /> 845-866-2430
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}