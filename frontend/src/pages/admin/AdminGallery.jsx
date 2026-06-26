import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { Icons } from '../../components/public/Icons';

const TYPES = [{ value:'photo', label:'Photo' },{ value:'before-after', label:'Before & After' },{ value:'video', label:'Video' }];

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [tabFilter, setTabFilter] = useState('all');
  const [form, setForm] = useState({ title:'', type:'photo', description:'', service:'', videoUrl:'' });
  const [files, setFiles] = useState({ image:null, before:null, after:null });
  const fileRef = useRef(); const beforeRef = useRef(); const afterRef = useRef();

  const fetchItems = () => { setLoading(true); api.get('/gallery').then(r => setItems(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { fetchItems(); }, []);

  const uploadFile = async (file) => {
    const data = new FormData(); data.append('image', file);
    const res = await api.post('/gallery/upload', data, { headers:{ 'Content-Type':'multipart/form-data' } });
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setUploading(true);
    try {
      let payload = { ...form };
      if (form.type==='photo'&&files.image) payload.image = await uploadFile(files.image);
      else if (form.type==='before-after') { if (files.before) payload.beforeImage=await uploadFile(files.before); if (files.after) payload.afterImage=await uploadFile(files.after); }
      else if (form.type==='video'&&files.image) payload.image=await uploadFile(files.image);
      await api.post('/gallery', payload);
      toast.success('Gallery item added!');
      setShowForm(false); setForm({ title:'', type:'photo', description:'', service:'', videoUrl:'' }); setFiles({ image:null, before:null, after:null });
      fetchItems();
    } catch { toast.error('Upload failed. Check Cloudinary settings.'); }
    finally { setUploading(false); }
  };

  const deleteItem = async (id) => { if (!confirm('Delete this item?')) return; try { await api.delete(`/gallery/${id}`); toast.success('Deleted'); fetchItems(); } catch { toast.error('Failed to delete'); } };
  const toggleActive = async (item) => { try { await api.put(`/gallery/${item._id}`, { isActive:!item.isActive }); fetchItems(); } catch { toast.error('Failed to update'); } };
  const filtered = tabFilter==='all' ? items : items.filter(i => i.type===tabFilter);

  const uploadBox = (key, label, ref) => (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-brand-blue transition-colors" onClick={() => ref.current?.click()}>
        {files[key] ? <p className="text-sm text-brand-blue font-medium truncate">{files[key].name}</p> : <div className="text-gray-600"><div className="flex justify-center mb-1"><Icons.Upload /></div><p className="text-sm">Click to upload</p></div>}
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => setFiles(f => ({...f,[key]:e.target.files[0]}))} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-white">Gallery</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><Icons.Plus /> Add Item</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[['all','All'],['photo','Photos'],['before-after','Before & After'],['video','Videos']].map(([val,label]) => (
          <button key={val} onClick={() => setTabFilter(val)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tabFilter===val?'bg-brand-blue text-white':'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length===0 ? (
        <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-2xl py-20 text-center">
          <div className="text-gray-700 flex justify-center mb-3"><Icons.Upload /></div>
          <p className="text-gray-500 mb-3">No items yet. Add your first gallery item.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2"><Icons.Plus /> Add Now</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item._id} className={`bg-gray-900 rounded-2xl border overflow-hidden ${!item.isActive?'opacity-50 border-gray-800':'border-gray-800 hover:border-gray-700'} transition-all`}>
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                {item.type==='video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    {item.image && <img src={item.image} alt="thumb" className="w-full h-full object-cover opacity-40" />}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500"><Icons.Video /></div>
                  </div>
                ) : item.type==='before-after' ? (
                  <div className="w-full h-full flex">
                    {item.beforeImage&&<img src={item.beforeImage} alt="before" className="w-1/2 h-full object-cover" />}
                    {item.afterImage&&<img src={item.afterImage} alt="after" className="w-1/2 h-full object-cover" />}
                    {!item.beforeImage&&!item.afterImage&&<div className="w-full flex items-center justify-center text-gray-600 text-sm">Before & After</div>}
                  </div>
                ) : item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700"><Icons.Image /></div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full capitalize">{item.type}</div>
              </div>
              <div className="p-3">
                <div className="font-medium text-white text-sm truncate">{item.title||'Untitled'}</div>
                {item.description&&<div className="text-xs text-gray-500 truncate mt-0.5">{item.description}</div>}
                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => toggleActive(item)} className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.isActive?'bg-green-500/20 text-green-400':'bg-gray-800 text-gray-500'}`}>
                    {item.isActive?'Active':'Hidden'}
                  </button>
                  <button onClick={() => deleteItem(item._id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Icons.Trash /></button>
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
              <h2 className="font-display text-2xl font-bold text-white">Add Gallery Item</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><Icons.Close /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => setForm(f => ({...f,type:t.value}))}
                      className={`py-2 rounded-xl text-sm font-medium border-2 transition-all ${form.type===t.value?'border-brand-blue bg-brand-blue/10 text-brand-blue':'border-gray-700 text-gray-500 hover:border-gray-600'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Title</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({...f,title:e.target.value}))} placeholder="e.g. BMW Interior Deep Clean" className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Description</label>
                <input type="text" value={form.description} onChange={e => setForm(f => ({...f,description:e.target.value}))} placeholder="Short description..." className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue" />
              </div>
              {form.type==='photo' && uploadBox('image','Photo *',fileRef)}
              {form.type==='before-after' && <div className="grid grid-cols-2 gap-3">{uploadBox('before','Before Photo',beforeRef)}{uploadBox('after','After Photo',afterRef)}</div>}
              {form.type==='video' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Video URL</label>
                    <input type="url" value={form.videoUrl} onChange={e => setForm(f => ({...f,videoUrl:e.target.value}))} placeholder="https://youtube.com/..." className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue" />
                  </div>
                  {uploadBox('image','Thumbnail Image',fileRef)}
                </>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline flex-1 py-3">Cancel</button>
                <button type="submit" disabled={uploading} className="btn-primary flex-1 py-3 disabled:opacity-70">{uploading?'Uploading...':'Add to Gallery'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
