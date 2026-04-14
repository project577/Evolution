import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  GraduationCap, 
  Users, 
  Calendar, 
  User as UserIcon,
  Mail
} from 'lucide-react';
import Logo from './Logo';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Mein Training', icon: LayoutDashboard },
    { path: '/chat', label: 'KI-Mentor', icon: MessageSquare },
    { path: '/academy', label: 'Akademie', icon: GraduationCap },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/messages', label: 'Nachrichten', icon: Mail },
    { path: '/booking', label: 'Vor-Ort Termine', icon: Calendar },
  ];

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 px-2 py-2 z-50 md:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 transition-all rounded-xl",
                  isActive ? "text-primary bg-primary/5" : "text-zinc-400 hover:text-zinc-600"
                )}
              >
                <Icon size={20} />
                <span className="text-[9px] font-medium">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 flex-col p-6 z-50">
        <Link to="/" className="flex items-center gap-3 mb-12 px-2">
          <Logo className="w-8 h-8 text-primary" strokeWidth={6} />
          <span className="font-serif text-xl font-bold text-zinc-900 tracking-tight">Evolution</span>
        </Link>
        
        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <Link 
            to="/profile"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
              location.pathname === '/profile'
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <UserIcon size={20} />
            <span>Profil</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
