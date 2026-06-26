import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { Icons } from '../../components/public/Icons';
import api from '../../utils/api';

const SERVICES = [
  { name: 'Interior Detail', price: 149, duration: '2–3 hrs' },
  { name: 'Exterior Detail', price: 119, duration: '1.5–2 hrs' },
  { name: 'Full Detail', price: 249, duration: '4–5 hrs' }
];
const TIME_SLOTS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ customerName:'', email:'', phone:'', service:'', vehicleType:'Sedan', vehicleMake:'', vehicleModel:'', vehicleYear:'', date:'', timeSlot:'', address:'', notes:'', isFirstTime:false });

  const selectedService = SERVICES.find(s => s.name === form.service);
  const finalPrice = selectedService ? (form.isFirstTime ? selectedService.price * 0.5 : selectedService.price) : 0;
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/bookings', form);
      setSubmitted(true);
      toast.success('Booking confirmed! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  const inputCls = "dark-input";
  const selectCls = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue";

  if (submitted) return (
    <div className="min-h-screen font-body bg-gray-950">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
            <Icons.CheckCircle />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Booking Confirmed!</h2>
          <p className="text-gray-400 mb-2">Thank you, <strong className="text-white">{form.customerName}</strong>!</p>
          <p className="text-gray-400 mb-6">Confirmation sent to <strong className="text-white">{form.email}</strong>.</p>
          {form.isFirstTime && (
            <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-xl p-4 mb-6">
              <p className="text-brand-blue font-bold text-lg">50% Discount Applied!</p>
              <p className="text-gray-400">Your price: <strong className="text-white">${finalPrice}</strong></p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <a href="tel:8458662430" className="btn-outline flex items-center justify-center gap-2"><Icons.Phone /> 845-866-2430</a>
            <Link to="/" className="btn-primary text-center">Back to Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen font-body bg-gray-950">
      <Navbar />
      <div className="pt-28 pb-16 max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">Book Your <span className="text-brand-blue">Detail</span></h1>
          <p className="text-gray-500">We'll come to your location — no shop visit needed.</p>
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full px-5 py-2 mt-4">
            <span className="text-brand-blue"><Icons.Tag /></span>
            <span className="text-brand-blue font-semibold text-sm">First-time customers save 50%!</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {['Select Service','Your Details','Date & Location','Review'].map((label, idx) => (
            <div key={idx} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step === idx+1 ? 'bg-brand-blue text-white' : step > idx+1 ? 'bg-brand-blue/20 text-brand-blue' : 'text-gray-600'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === idx+1 ? 'bg-white text-brand-blue' : step > idx+1 ? 'bg-brand-blue text-white' : 'bg-gray-800 text-gray-500'}`}>{idx+1}</span>
                <span className="hidden sm:block">{label}</span>
              </div>
              {idx < 3 && <div className={`w-8 h-0.5 ${step > idx+1 ? 'bg-brand-blue' : 'bg-gray-800'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl shadow-xl p-8">

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6">Choose Your Service</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {SERVICES.map(s => (
                  <button key={s.name} onClick={() => update('service', s.name)}
                    className={`text-left p-6 rounded-2xl border-2 transition-all ${form.service === s.name ? 'border-brand-blue bg-brand-blue/10' : 'border-gray-700 hover:border-gray-600 bg-gray-800'}`}>
                    <div className="font-display text-xl font-bold text-white">{s.name}</div>
                    <div className="text-3xl font-bold text-brand-blue mt-1">${s.price}</div>
                    {form.isFirstTime && <div className="text-green-400 text-sm font-medium">${s.price * 0.5} with 50% off</div>}
                    <div className="text-gray-500 text-sm mt-1 flex items-center gap-1"><Icons.Clock />{s.duration}</div>
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isFirstTime} onChange={e => update('isFirstTime', e.target.checked)} className="w-5 h-5 accent-brand-blue" />
                  <div><span className="font-medium text-white">I'm a first-time customer </span><span className="text-brand-blue font-bold">(50% discount!)</span></div>
                </label>
              </div>
              <button onClick={() => setStep(2)} disabled={!form.service} className="btn-primary w-full mt-6 py-4 disabled:opacity-40 disabled:cursor-not-allowed">Continue</button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6">Your Details</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {[['customerName','Full Name','John Smith','text'],['email','Email','john@example.com','email'],['phone','Phone','845-000-0000','tel']].map(([k,label,ph,type]) => (
                  <div key={k}>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">{label} *</label>
                    <input type={type} value={form[k]} onChange={e => update(k, e.target.value)} placeholder={ph} className={inputCls} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Vehicle Type *</label>
                  <select value={form.vehicleType} onChange={e => update('vehicleType', e.target.value)} className={selectCls}>
                    {['Sedan','SUV','Truck','Van','Coupe','Minivan','Motorcycle','Other'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                {[['vehicleMake','Vehicle Make','Toyota'],['vehicleModel','Vehicle Model','Camry'],['vehicleYear','Vehicle Year','2020']].map(([k,label,ph]) => (
                  <div key={k}>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
                    <input type="text" value={form[k]} onChange={e => update(k, e.target.value)} placeholder={ph} className={inputCls} />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                <button onClick={() => setStep(3)} disabled={!form.customerName || !form.email || !form.phone} className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6">Date & Location</h2>
              <div className="grid gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Preferred Date *</label>
                    <input type="date" value={form.date} onChange={e => update('date', e.target.value)} min={new Date().toISOString().split('T')[0]} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Preferred Time *</label>
                    <select value={form.timeSlot} onChange={e => update('timeSlot', e.target.value)} className={selectCls}>
                      <option value="">Select a time</option>
                      {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Service Address * <span className="text-gray-600 font-normal">(where we'll come)</span></label>
                  <input type="text" value={form.address} onChange={e => update('address', e.target.value)} placeholder="123 Main St, Monticello, NY 12701" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Additional Notes</label>
                  <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Special requests, gate codes, parking instructions..." rows="3" className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue resize-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-outline flex-1">Back</button>
                <button onClick={() => setStep(4)} disabled={!form.date || !form.timeSlot || !form.address} className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">Review Booking</button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-6">Review Your Booking</h2>
              <div className="space-y-2">
                {[['Service',form.service],['Vehicle',`${form.vehicleYear} ${form.vehicleMake} ${form.vehicleModel} ${form.vehicleType}`.trim()],['Name',form.customerName],['Email',form.email],['Phone',form.phone],['Date',form.date && new Date(form.date).toLocaleDateString()],['Time',form.timeSlot],['Address',form.address],form.notes?['Notes',form.notes]:null].filter(Boolean).map(([label, value]) => (
                  <div key={label} className="flex justify-between py-3 border-b border-gray-800">
                    <span className="text-gray-500 text-sm">{label}</span>
                    <span className="font-medium text-white text-sm text-right max-w-xs">{value}</span>
                  </div>
                ))}
                <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-xl p-5 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Base Price</span>
                    <span className="text-white">${selectedService?.price}</span>
                  </div>
                  {form.isFirstTime && (
                    <div className="flex justify-between items-center mb-2 text-green-400">
                      <span>First-Time Discount (50%)</span>
                      <span>-${selectedService ? selectedService.price * 0.5 : 0}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-brand-blue/20 pt-3 mt-3">
                    <span className="font-bold text-white text-lg">Total</span>
                    <span className="font-bold text-brand-blue text-2xl">${finalPrice}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Payment collected at time of service</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(3)} className="btn-outline flex-1">Back</button>
                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 py-4 disabled:opacity-70">
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
