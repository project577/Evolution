import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Lock, CheckCircle2, Calendar, Clock, Filter, CreditCard, Ticket } from 'lucide-react';
import { api, Video, User } from '../services/api';
import { hasAccess } from '../services/stripeService';

export default function Academy({ user }: { user: User }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [filter, setFilter] = useState('Alle');
  const [showPaywall, setShowPaywall] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    api.getVideos().then(setVideos);
  }, []);

  const categories = ['Alle', 'Körperarbeit-Praxis', 'Kundenumgang', 'Anatomie'];
  const filteredVideos = filter === 'Alle' ? videos : videos.filter(v => v.category === filter);

  const handleVideoSelect = (video: Video) => {
    if (!hasAccess(user, video)) {
      setShowPaywall(true);
      setActiveVideo(null);
    } else {
      setShowPaywall(false);
      setActiveVideo(video);
      // Mock progress update
      console.log(`Updating progress for lesson ${video.id}`);
    }
  };

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'EVOLVED2024') {
      alert('Promo Code akzeptiert! Du hast nun Zugriff.');
      // In a real app, update user state/Firestore
    } else {
      alert('Ungültiger Code.');
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl text-zinc-900 mb-2">Video-Akademie</h1>
          <p className="text-zinc-500">Hochwertige Ausbildungsinhalte für deine professionelle Entwicklung.</p>
        </div>
      </header>

      {/* Categories Filter */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <div className="p-2 bg-white rounded-xl border border-slate-100 text-zinc-400">
          <Filter size={18} />
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filter === cat 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white text-zinc-500 border border-slate-100 hover:border-primary/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Video Player Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-zinc-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl group">
            {showPaywall ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-white p-12 text-center bg-zinc-800">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 mb-6">
                  <Lock size={40} />
                </div>
                <h3 className="text-2xl font-serif">Premium Inhalt</h3>
                <p className="text-zinc-400 mt-2 max-w-xs mx-auto mb-8">Diese Lektion ist nur für Abonnenten verfügbar.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <button className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all">
                    <CreditCard size={18} /> Abo abschließen
                  </button>
                  <form onSubmit={handlePromoSubmit} className="flex-1 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Promo Code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 text-sm focus:outline-none focus:border-primary"
                    />
                    <button type="submit" className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                      <Ticket size={18} />
                    </button>
                  </form>
                </div>
              </div>
            ) : activeVideo ? (
              <video 
                src={activeVideo.url} 
                controls 
                className="w-full h-full object-cover"
                poster={`https://picsum.photos/seed/ev${activeVideo.id}/1280/720`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white p-12 text-center bg-zinc-800">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6 animate-pulse">
                  <Play size={40} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-serif">Wähle eine Lektion</h3>
                <p className="text-zinc-400 mt-2 max-w-xs mx-auto">Wähle ein Video aus dem Lehrplan rechts aus, um mit dem Lernen zu beginnen.</p>
              </div>
            )}
          </div>

          {activeVideo && !showPaywall && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-evolated p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                  {activeVideo.category}
                </span>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Clock size={16} /> 45 Min
                </div>
              </div>
              <h2 className="text-3xl font-serif text-zinc-900 mb-4">{activeVideo.title}</h2>
              <p className="text-zinc-600 leading-relaxed text-lg">{activeVideo.description}</p>
              
              <div className="mt-10 pt-8 border-t border-slate-50 flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Status</p>
                    <p className="text-sm font-bold text-zinc-900">Abgeschlossen</p>
                  </div>
                </div>
                <button className="ml-auto px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all">
                  Materialien herunterladen
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Curriculum Sidebar */}
        <div className="space-y-6">
          <h3 className="font-serif text-xl text-zinc-900 px-2">Lehrplan</h3>
          <div className="space-y-4">
            {filteredVideos.map((video, index) => {
              const locked = !hasAccess(user, video);
              return (
                <button
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 group ${
                    activeVideo?.id === video.id
                      ? 'bg-white border-primary shadow-lg shadow-primary/5 ring-1 ring-primary'
                      : 'bg-white border-slate-100 hover:border-primary/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm transition-colors ${
                    activeVideo?.id === video.id ? 'bg-primary text-white' : 'bg-zinc-50 text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    {locked ? <Lock size={16} /> : String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-zinc-900 truncate text-sm">{video.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-zinc-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-primary transition-all duration-500 ${activeVideo?.id === video.id ? 'w-full' : 'w-0'}`} />
                      </div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{video.category.split('-')[0]}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-primary text-white p-8 rounded-[2rem] mt-10 relative overflow-hidden">
            <div className="relative z-10">
              <Calendar className="text-white/50 mb-4" size={32} />
              <h4 className="font-serif text-2xl mb-2">Live Q&A</h4>
              <p className="text-white/70 text-sm mb-6">Wöchentliche Live-Sitzung mit dem Evolated Expert Team.</p>
              <button className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm font-bold hover:bg-white/20 transition-all">
                Termin sichern
              </button>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
