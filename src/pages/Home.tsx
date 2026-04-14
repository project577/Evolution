import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calendar, CreditCard, Star, Users, Play, Clock } from 'lucide-react';
import { User } from '../services/api';
import { Link } from 'react-router-dom';

export default function Home({ user }: { user: User }) {
  return (
    <div className="space-y-10">
      {/* Dashboard Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl text-zinc-900 mb-2">Willkommen, {user.name}</h1>
          <p className="text-zinc-500">Dein Fortschritt in der Evolution Ausbildung.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Abo-Status</p>
              <p className="text-sm font-bold text-zinc-900">89 € / Monat</p>
            </div>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Nächster Termin</p>
              <p className="text-sm font-bold text-zinc-900">Do, 10:00 Uhr</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero / Featured */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-primary text-white p-10 md:p-16">
        <div className="relative z-10 max-w-xl">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/20"
          >
            Aktuelle Lektion
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl mb-6 leading-tight"
          >
            Die Kunst der <span className="italic text-white/80">Körperarbeit</span>
          </motion.h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Vertiefe dein Verständnis für anatomische Zusammenhänge und lerne, wie du deine Kunden noch effektiver begleiten kannst.
          </p>
          <Link to="/academy" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-bold hover:bg-zinc-50 transition-all shadow-xl shadow-black/10">
            Jetzt fortfahren <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-150 translate-x-1/4">
            <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.2C87.4,-33.3,90,-16.6,88.4,-0.9C86.8,14.8,81,29.6,72.4,42.4C63.8,55.2,52.4,66,39.1,73.1C25.8,80.2,10.6,83.6,-4.1,90.7C-18.8,97.8,-33,108.6,-45.4,106.5C-57.8,104.4,-68.4,89.4,-76.1,74.5C-83.8,59.6,-88.6,44.8,-91.3,29.8C-94,14.8,-94.6,-0.4,-91.8,-15.1C-89,-29.8,-82.8,-44,-72.8,-55.5C-62.8,-67,-49,-75.8,-35.1,-83.1C-21.2,-90.4,-7.1,-96.2,4.4,-103.8C15.9,-111.4,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-slate-100 shadow-sm text-center max-w-4xl mx-auto">
        <div className="w-12 h-1.5 bg-primary/20 mx-auto mb-8 rounded-full" />
        <h3 className="font-serif text-2xl md:text-3xl text-zinc-900 mb-8 leading-relaxed italic">
          "Haltungsfehlstellungen sind mehr als nur sichtbare Probleme – sie spiegeln komplexe Zusammenhänge wieder."
        </h3>
        <div className="space-y-6 text-zinc-600 leading-relaxed">
          <p>
            Strukturelle Fehlstellungen, innere Organbelastungen und emotionale Spannungen beeinflussen unbewusst die Körperhaltung.
          </p>
          <p className="font-medium text-zinc-900">
            Durch das Erkennen und Behandeln der tatsächlichen Ursachen schafft die <span className="text-primary">Nerven-Punkt Manipulation</span> nachhaltige Verbesserungen für Ihre Gesundheit und Ihr Wohlbefinden.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-evolated p-8">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <Play size={24} />
          </div>
          <h3 className="font-serif text-xl mb-2 text-zinc-900">Gesehene Videos</h3>
          <p className="text-zinc-500 text-sm mb-6">Du hast 12 von 30 Videos der Ausbildung bereits gesehen.</p>
          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[40%] rounded-full" />
          </div>
        </div>
        <div className="card-evolated p-8">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
            <Star size={24} />
          </div>
          <h3 className="font-serif text-xl mb-2 text-zinc-900">Zertifizierung</h3>
          <p className="text-zinc-500 text-sm mb-6">Noch 4 Module bis zum Abschluss deiner Ausbildung.</p>
          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 w-[65%] rounded-full" />
          </div>
        </div>
        <div className="card-evolated p-8">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
            <Users size={24} />
          </div>
          <h3 className="font-serif text-xl mb-2 text-zinc-900">Community</h3>
          <p className="text-zinc-500 text-sm mb-6">3 neue Beiträge in der Evolution Community Wall.</p>
          <Link to="/community" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Ansehen</Link>
        </div>
      </div>

      {/* Recent Activity / Recommendations */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-zinc-900">Empfohlene Lektionen</h2>
          <Link to="/academy" className="text-primary text-sm font-bold hover:underline">Alle ansehen</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group card-evolated cursor-pointer">
            <div className="aspect-[16/9] relative overflow-hidden">
              <img 
                src="https://picsum.photos/seed/ev1/800/450" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-zinc-900">Anatomie</span>
                <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                  <Clock size={10} /> 15 Min
                </span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-serif text-xl mb-2 text-zinc-900">Die Biomechanik des Beckens</h4>
              <p className="text-zinc-500 text-sm line-clamp-2">Verstehe die komplexen Bewegungsabläufe des Beckens und deren Auswirkung auf die Körperhaltung.</p>
            </div>
          </div>
          <div className="group card-evolated cursor-pointer">
            <div className="aspect-[16/9] relative overflow-hidden">
              <img 
                src="https://picsum.photos/seed/ev2/800/450" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-zinc-900">Kundenumgang</span>
                <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                  <Clock size={10} /> 12 Min
                </span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-serif text-xl mb-2 text-zinc-900">Aktives Zuhören in der Praxis</h4>
              <p className="text-zinc-500 text-sm line-clamp-2">Lerne Techniken, um die Bedürfnisse deiner Kunden besser zu verstehen und Vertrauen aufzubauen.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
