import { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import BeforeAfterSlider from '../../components/public/BeforeAfterSlider';
import { Icons } from '../../components/public/Icons';
import api from '../../utils/api';

const TABS = ['All','Before & After','Photos','Videos'];

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(null);

  useEffect(() => { api.get('/gallery').then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const filtered = items.filter(i => {
    if (tab === 'All') return true;
    if (tab === 'Before & After') return i.type === 'before-after';
    if (tab === 'Photos') return i.type === 'photo';
    if (tab === 'Videos') return i.type === 'video';
    return true;
  });

  return (
    <div className="min-h-screen font-body bg-gray-950">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-widest">Our Work</span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mt-2">Results <span className="text-brand-blue">Gallery</span></h1>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Real transformations from real clients across Sullivan County, NY.</p>
          </div>
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${tab === t ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/30' : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700'}`}>
                {t}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-700 flex justify-center mb-4"><Icons.Image /></div>
              <p className="text-gray-500 text-lg">No items in this category yet.</p>
              <p className="text-gray-600 text-sm mt-2">Check back soon — we're always detailing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <div key={item._id || idx} className="group rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50">
                  {item.type === 'before-after' ? (
                    <div>
                      <BeforeAfterSlider before={item.beforeImage} after={item.afterImage} label={item.description} />
                      {item.title && <div className="p-3 bg-gray-900"><p className="text-sm font-medium text-gray-300">{item.title}</p></div>}
                    </div>
                  ) : item.type === 'video' ? (
                    <div className="relative aspect-video bg-gray-900 cursor-pointer" onClick={() => setVideoPlaying(idx)}>
                      {videoPlaying === idx ? (
                        <video src={item.videoUrl} autoPlay controls className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <img src={item.image || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600'} alt={item.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center"><Icons.Play /></div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="relative aspect-video overflow-hidden cursor-pointer bg-gray-900" onClick={() => setLightbox(item)}>
                      <img src={item.image} alt={item.title || 'Detail work'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 rounded-full p-3 text-white"><Icons.Eye /></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {lightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"><Icons.Close /></button>
          <img src={lightbox.image} alt={lightbox.title} className="max-w-full max-h-[90vh] rounded-xl object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
      <Footer />
    </div>
  );
}
