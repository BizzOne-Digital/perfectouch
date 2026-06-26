import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Icons } from '../../components/public/Icons';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchServices = () => { setLoading(true); api.get('/services').then(r => setServices(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { fetchServices(); }, []);

  const handleEdit = (service) => setEditing({ ...service, featuresText: service.features?.join('\n')||'' });

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...editing, features: editing.featuresText.split('\n').filter(f => f.trim()), price: parseFloat(editing.price) };
      delete payload.featuresText;
      await api.put(`/services/${editing._id}`, payload);
      toast.success('Service updated!');
      setEditing(null);
      fetchServices();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const ICONS = [Icons.Sparkle, Icons.Car, Icons.Shield];
  const inputCls = "w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Services</h1>
        <p className="text-gray-500 text-sm mt-1">Edit your service names, prices, descriptions, and features.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid gap-6">
          {services.map((service, idx) => {
            const Icon = ICONS[idx]||Icons.Car;
            return (
              <div key={service._id} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue"><Icon /></div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-white">{service.name}</h2>
                      <div className="text-brand-blue font-bold text-lg">${service.price}</div>
                    </div>
                  </div>
                  <button onClick={() => handleEdit(service)} className="flex items-center gap-2 text-sm text-brand-blue hover:bg-brand-blue/10 px-3 py-2 rounded-lg transition-colors">
                    <Icons.Edit /> Edit
                  </button>
                </div>
                <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(service.features||[]).map((f,i) => (
                    <span key={i} className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-3 py-1 rounded-full">{f}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Icons.Clock />{service.duration||'Duration TBD'}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${service.isActive?'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}`}>
                    {service.isActive?'Active':'Hidden'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg my-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
              <h2 className="font-display text-2xl font-bold text-white">Edit {editing.name}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-white"><Icons.Close /></button>
            </div>
            <div className="px-8 py-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Price ($)</label>
                  <input type="number" value={editing.price} onChange={e => setEditing(s => ({...s,price:e.target.value}))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Duration</label>
                  <input type="text" value={editing.duration||''} onChange={e => setEditing(s => ({...s,duration:e.target.value}))} placeholder="e.g. 2–3 hours" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
                <textarea value={editing.description} onChange={e => setEditing(s => ({...s,description:e.target.value}))} rows="3" className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Features <span className="text-gray-600 font-normal">(one per line)</span></label>
                <textarea value={editing.featuresText} onChange={e => setEditing(s => ({...s,featuresText:e.target.value}))} rows="6" placeholder="Vacuum all surfaces&#10;Dashboard wipe-down&#10;Window cleaning" className={`${inputCls} resize-none font-mono text-sm`} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={editing.isActive} onChange={e => setEditing(s => ({...s,isActive:e.target.checked}))} className="w-4 h-4 accent-brand-blue" />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-400">Service is active / visible on website</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditing(null)} className="btn-outline flex-1 py-3">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 py-3 disabled:opacity-70">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
