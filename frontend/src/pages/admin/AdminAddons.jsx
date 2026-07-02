import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Icons } from '../../components/public/Icons';

const emptyForm = { name: '', description: '', price: '', duration: '', image: '', isActive: true };

export default function AdminAddons() {
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const fetchAddons = () => { setLoading(true); api.get('/addons?all=true').then(r => setAddons(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { fetchAddons(); }, []);

  const openNew = () => { setForm(emptyForm); setFile(null); setShowForm(true); };
  const openEdit = (a) => { setForm({ ...a }); setFile(null); setShowForm(true); };

  const uploadFile = async (f) => {
    const data = new FormData(); data.append('image', f);
    const res = await api.post('/addons/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      let payload = { ...form, price: parseFloat(form.price) };
      if (file) { const up = await uploadFile(file); payload.image = up.url; payload.cloudinaryId = up.publicId; }
      if (form._id) await api.put(`/addons/${form._id}`, payload);
      else await api.post('/addons', payload);
      toast.success(form._id ? 'Add-on updated!' : 'Add-on added!');
      setShowForm(false); setForm(emptyForm); setFile(null);
      fetchAddons();
    } catch { toast.error('Failed to save. Check Cloudinary settings.'); }
    finally { setSaving(false); }
  };

  const deleteAddon = async (id) => { if (!confirm('Delete this add-on?')) return; try { await api.delete(`/addons/${id}`); toast.success('Deleted'); fetchAddons(); } catch { toast.error('Failed to delete'); } };
  const toggleActive = async (a) => { try { await api.put(`/addons/${a._id}`, { isActive: !a.isActive }); fetchAddons(); } catch { toast.error('Failed to update'); } };

  const inputCls = "w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Add-ons</h1>
          <p className="text-gray-500 text-sm mt-1">Extra services customers can add to any detail. Images upload to Cloudinary.</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2"><Icons.Plus /> Add Add-on</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>
      ) : addons.length === 0 ? (
        <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl py-20 text-center">
          <p className="text-gray-500 mb-3">No add-ons yet. Add your first one.</p>
          <button onClick={openNew} className="btn-primary inline-flex items-center gap-2"><Icons.Plus /> Add Now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addons.map(a => (
            <div key={a._id} className={`bg-gray-900 rounded-2xl border overflow-hidden ${!a.isActive ? 'opacity-50 border-gray-800' : 'border-gray-800 hover:border-gray-700'} transition-all`}>
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                {a.image ? <img src={a.image} alt={a.name} className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700"><Icons.Image /></div>
                )}
                <div className="absolute top-2 right-2 bg-brand-blue text-white text-sm font-bold px-2.5 py-0.5 rounded-full">${a.price}</div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-white">{a.name}</div>
                {a.duration && <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Icons.Clock />{a.duration}</div>}
                {a.description && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</div>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                  <button onClick={() => toggleActive(a)} className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                    {a.isActive ? 'Active' : 'Hidden'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(a)} className="p-1.5 text-brand-blue hover:bg-brand-blue/10 rounded-lg"><Icons.Edit /></button>
                    <button onClick={() => deleteAddon(a._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Icons.Trash /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl w-full max-w-lg my-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
              <h2 className="font-display text-2xl font-bold text-white">{form._id ? 'Edit Add-on' : 'Add Add-on'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><Icons.Close /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Pet Hair Removal" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Price ($) *</label>
                  <input type="number" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="50" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Duration</label>
                  <input type="text" value={form.duration || ''} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 30 min" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
                <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows="2" placeholder="Short description..." className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Image</label>
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-brand-blue transition-colors" onClick={() => fileRef.current?.click()}>
                  {file ? <p className="text-sm text-brand-blue font-medium truncate">{file.name}</p>
                    : form.image ? <img src={form.image} alt="current" className="h-24 mx-auto rounded-lg object-cover" />
                    : <div className="text-gray-600"><div className="flex justify-center mb-1"><Icons.Upload /></div><p className="text-sm">Click to upload</p></div>}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="addonActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-brand-blue" />
                <label htmlFor="addonActive" className="text-sm font-medium text-gray-400">Active / visible on website</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 py-3">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 disabled:opacity-70">{saving ? 'Saving...' : form._id ? 'Save Changes' : 'Add Add-on'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
