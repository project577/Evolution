import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Academy from './pages/Academy';
import Chat from './pages/Chat';
import Community from './pages/Community';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import { api, User } from './services/api';
import Logo from './components/Logo';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    try {
      if (isResetting) {
        await api.resetPassword(email);
        setSuccess('Ein Link zum Zurücksetzen Ihres Passworts wurde an Ihre E-Mail-Adresse gesendet.');
        setIsResetting(false);
        return;
      }

      let loggedInUser: User;
      if (isRegistering) {
        loggedInUser = await api.register(name, email, password);
      } else {
        loggedInUser = await api.login(email, password);
      }
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-soft flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 w-full max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-8">
            <Logo className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-4xl mb-2 text-zinc-900">Evolution</h1>
          <p className="text-zinc-500 mb-10">
            {isResetting ? 'Passwort zurücksetzen' : isRegistering ? 'Konto erstellen' : 'Willkommen zurück'}
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegistering && !isResetting && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Vollständiger Name</label>
                <input name="name" required className="w-full p-4 rounded-2xl bg-zinc-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="z.B. Max Mustermann" />
              </div>
            )}
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">E-Mail Adresse</label>
              <input name="email" type="email" required className="w-full p-4 rounded-2xl bg-zinc-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="name@beispiel.de" />
            </div>
            {!isResetting && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-400">Passwort</label>
                  {!isRegistering && (
                    <button 
                      type="button"
                      onClick={() => {
                        setIsResetting(true);
                        setError(null);
                        setSuccess(null);
                      }}
                      className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline"
                    >
                      Vergessen?
                    </button>
                  )}
                </div>
                <input name="password" type="password" required className="w-full p-4 rounded-2xl bg-zinc-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="••••••••" />
              </div>
            )}
            <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              {isResetting ? 'Link senden' : isRegistering ? 'Registrieren' : 'Anmelden'}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-4">
            {!isResetting ? (
              <button 
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                  setSuccess(null);
                }}
                className="w-full text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
              >
                {isRegistering ? 'Bereits ein Konto? Login' : 'Noch kein Konto? Registrieren'}
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsResetting(false);
                  setError(null);
                  setSuccess(null);
                }}
                className="w-full text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors"
              >
                Zurück zum Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-bg-soft flex">
        <Navbar />
        <main className="flex-1 md:ml-64 px-6 py-10 pb-24 md:pb-10">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/academy" element={<Academy user={user} />} />
              <Route path="/chat" element={<Chat user={user} />} />
              <Route path="/community" element={<Community user={user} />} />
              <Route path="/booking" element={<Booking user={user} />} />
              <Route path="/messages" element={<Messages user={user} />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

// Add Circle import to App.tsx
import { Circle } from 'lucide-react';
