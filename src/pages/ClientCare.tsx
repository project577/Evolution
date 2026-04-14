import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Calendar, MessageSquare, Sparkles, Send, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { User as UserType } from '../services/api';
import { generateFollowUpMessage } from '../services/gemini';

interface Client extends UserType {
  lastSession?: string;
  sessionTopic?: string;
}

export default function ClientCare({ user }: { user: UserType }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentMessages, setSentMessages] = useState<number[]>([]);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        // Mocking some session data for the demo
        const enhancedClients = data.map((c: any) => ({
          ...c,
          lastSession: 'Vor 2 Tagen',
          sessionTopic: c.id % 2 === 0 ? 'Schulter-Nacken-Verspannung' : 'Unruhiger Schlaf & Stress'
        }));
        setClients(enhancedClients);
        setLoading(false);
      });
  }, []);

  const handleGenerate = async (client: Client) => {
    setSelectedClient(client);
    setIsGenerating(true);
    setGeneratedMessage('');
    try {
      const msg = await generateFollowUpMessage(client.name, client.sessionTopic || 'Allgemeines Wohlbefinden');
      setGeneratedMessage(msg || '');
    } catch (error) {
      console.error('Error generating message:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = (clientId: number) => {
    // In a real app, we would save this to the database
    setSentMessages([...sentMessages, clientId]);
    setSelectedClient(null);
    setGeneratedMessage('');
  };

  if (loading) return <div className="p-12 text-center text-zinc-400">Lade Klienten...</div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-4xl text-zinc-900 mb-2">Klientenbetreuung</h1>
        <p className="text-zinc-500">KI-gestützte Nachsorge und Beziehungsmanagement.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-4 px-2">Aktive Klienten</h2>
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => handleGenerate(client)}
              className={`w-full text-left p-6 rounded-[2rem] border transition-all group ${
                selectedClient?.id === client.id 
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                  : 'bg-white border-slate-100 hover:border-primary/30 text-zinc-900'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedClient?.id === client.id ? 'bg-white/20' : 'bg-zinc-50 text-zinc-400'
                }`}>
                  <User size={24} />
                </div>
                {sentMessages.includes(client.id) && (
                  <div className="bg-emerald-500/20 text-emerald-500 p-1.5 rounded-full">
                    <CheckCircle2 size={14} />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-lg mb-1">{client.name}</h3>
              <div className={`flex items-center gap-2 text-xs mb-4 ${
                selectedClient?.id === client.id ? 'text-white/70' : 'text-zinc-400'
              }`}>
                <Clock size={12} /> {client.lastSession}
              </div>
              <div className={`text-xs p-3 rounded-xl ${
                selectedClient?.id === client.id ? 'bg-white/10' : 'bg-zinc-50 text-zinc-500'
              }`}>
                Thema: {client.sessionTopic}
              </div>
              <div className="mt-4 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>

        {/* AI Message Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedClient ? (
              <motion.div
                key={selectedClient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col"
              >
                <div className="p-8 border-b border-slate-50 bg-zinc-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-zinc-900">KI-Follow-up für {selectedClient.name}</h3>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Generiert basierend auf Evolution-Methodik</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8">
                  {isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles size={48} />
                      </motion.div>
                      <p className="font-medium animate-pulse">KI formuliert Nachricht...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-zinc-50 p-6 rounded-3xl border border-slate-100 relative">
                        <textarea
                          value={generatedMessage}
                          onChange={(e) => setGeneratedMessage(e.target.value)}
                          className="w-full bg-transparent border-none focus:outline-none text-zinc-800 leading-relaxed min-h-[200px] resize-none"
                        />
                        <div className="absolute -top-3 -left-3 bg-white px-3 py-1 rounded-full border border-slate-100 text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm">
                          Entwurf
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                          <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Kontext</h4>
                          <p className="text-xs text-blue-800">Nachricht bezieht sich auf: {selectedClient.sessionTopic}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                          <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Tipp</h4>
                          <p className="text-xs text-amber-800">Du kannst den Text oben manuell anpassen, bevor du ihn sendest.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-slate-50 bg-zinc-50/30 flex gap-4">
                  <button
                    onClick={() => handleSend(selectedClient.id)}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                    <Send size={20} /> Nachricht senden
                  </button>
                  <button
                    onClick={() => handleGenerate(selectedClient)}
                    className="px-6 py-4 bg-white text-zinc-500 rounded-2xl font-bold border border-slate-200 hover:bg-zinc-50 transition-all"
                  >
                    Neu generieren
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-zinc-50 rounded-[2.5rem] border border-dashed border-slate-200 h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                <div className="w-20 h-20 rounded-[2rem] bg-white shadow-sm flex items-center justify-center text-zinc-300 mb-6">
                  <MessageSquare size={40} />
                </div>
                <h3 className="font-serif text-2xl text-zinc-900 mb-2">Wähle einen Klienten</h3>
                <p className="max-w-xs text-zinc-500">Wähle links einen Klienten aus, um ein personalisiertes KI-Follow-up zu erstellen.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
