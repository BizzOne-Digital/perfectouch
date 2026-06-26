import { useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { Icons } from '../../components/public/Icons';
import api from '../../utils/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' });
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name:'', email:'', phone:'', message:'' });
    } catch { toast.error('Failed to send. Please call us directly.'); }
    finally { setLoading(false); }
  };

  const inputCls = "dark-input";

  return (
    <div className="min-h-screen font-body bg-gray-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mt-2">Contact <span className="text-brand-blue">Us</span></h1>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Have a question? Want to book? We're here to help.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="bg-gradient-to-br from-brand-blue to-blue-900 rounded-3xl p-8 text-white border border-brand-blue/30 shadow-2xl shadow-blue-500/20 h-full">
              <h2 className="font-display text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                {[
                  [Icons.Phone, 'Phone', '845-866-2430', 'tel:8458662430'],
                  [Icons.Mail, 'Email', 'perfecttouch.autodetailing29@gmail.com', 'mailto:perfecttouch.autodetailing29@gmail.com'],
                ].map(([Icon, label, value, href]) => (
                  <a key={label} href={href} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center group-hover:bg-white/25 transition-colors"><Icon /></div>
                    <div>
                      <div className="text-blue-200 text-sm">{label}</div>
                      <div className="font-bold break-all">{value}</div>
                    </div>
                  </a>
                ))}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center"><Icons.MapPin /></div>
                  <div>
                    <div className="text-blue-200 text-sm">Service Area</div>
                    <div className="font-bold">Sullivan County, NY</div>
                    <div className="text-blue-300 text-sm">We come to you!</div>
                  </div>
                </div>
                <a href="https://www.facebook.com/share/1981d6bG45/?mibextid=wwXIfr" target="_blank" rel="noreferrer"
                  className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center group-hover:bg-white/25 transition-colors"><Icons.Facebook /></div>
                  <div>
                    <div className="text-blue-200 text-sm">Facebook</div>
                    <div className="font-bold">PerfectTouch Auto Detailing</div>
                  </div>
                </a>
              </div>
              <div className="mt-10 bg-black/20 rounded-2xl p-5 border border-white/10">
                <h3 className="font-bold mb-2">Business Hours</h3>
                <div className="space-y-1 text-blue-200 text-sm">
                  <div className="flex justify-between"><span>Monday – Friday</span><span>8:00 AM – 6:00 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span>9:00 AM – 5:00 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span>By Appointment</span></div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Your Name *</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required placeholder="John Smith" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Email *</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="john@example.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="845-000-0000" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={e => update('message', e.target.value)} required placeholder="Tell us about your vehicle and what service you're interested in..." rows="5" className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue resize-none" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70">
                  <Icons.Send />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
