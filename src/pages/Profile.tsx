import React from 'react';
import { motion } from 'motion/react';
import { User as UserIcon, Settings, CreditCard, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { User } from '../services/api';

export default function Profile({ user }: { user: User }) {
  const menuItems = [
    { icon: <UserIcon size={20} />, label: 'Persönliche Daten', sub: 'Name, E-Mail, Adresse' },
    { icon: <CreditCard size={20} />, label: 'Abonnement', sub: 'Evolution Pro - 89 €/Monat' },
    { icon: <Bell size={20} />, label: 'Benachrichtigungen', sub: 'E-Mail & Push-Mitteilungen' },
    { icon: <Shield size={20} />, label: 'Datenschutz & Sicherheit', sub: 'Passwort & Berechtigungen' },
    { icon: <Settings size={20} />, label: 'App-Einstellungen', sub: 'Sprache, Design, Cache' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-100 flex items-center justify-center text-zinc-400 font-serif text-5xl border-4 border-white shadow-xl">
            {user.name[0]}
          </div>
          <button className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Settings size={18} />
          </button>
        </div>
        <div>
          <h1 className="font-serif text-4xl text-zinc-900 mb-1">{user.name}</h1>
          <p className="text-zinc-500">{user.email}</p>
          <div className="mt-4 inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            Zertifizierter Student
          </div>
        </div>
      </header>

      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="w-full card-evolated p-6 flex items-center gap-6 hover:border-primary/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-400 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-zinc-900">{item.label}</h4>
              <p className="text-xs text-zinc-400">{item.sub}</p>
            </div>
            <ChevronRight size={20} className="text-zinc-300 group-hover:text-primary transition-colors" />
          </motion.button>
        ))}
      </div>

      <div className="pt-6">
        <button 
          onClick={() => window.location.reload()}
          className="w-full p-6 rounded-3xl border border-rose-100 bg-rose-50/30 text-rose-600 font-bold flex items-center justify-center gap-3 hover:bg-rose-50 transition-all"
        >
          <LogOut size={20} /> Abmelden
        </button>
      </div>

      <footer className="text-center space-y-2 opacity-30">
        <p className="text-[10px] uppercase tracking-widest font-bold">Evolution v1.0.4</p>
        <p className="text-[10px]">© 2024 Evolution. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
