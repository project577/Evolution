import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Search, Mail, Info, User, Bot, Sparkles, Check, CheckCheck } from 'lucide-react';
import { User as UserType } from '../services/api';

interface Message {
  id: number;
  role: 'user' | 'support' | 'ai';
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: number;
  name: string;
  type: 'support' | 'ai';
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
  avatar?: string;
}

export default function Messages({ user }: { user: UserType }) {
  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'KI-Mentor',
      type: 'ai',
      lastMessage: 'Wie kann ich dir heute bei deiner Ausbildung helfen?',
      timestamp: '10:30',
      online: true,
    },
    {
      id: 2,
      name: 'Persönlicher Support',
      type: 'support',
      lastMessage: 'Deine Frage zur Buchung wurde bearbeitet.',
      timestamp: 'Gestern',
      unread: 1,
      online: false,
    }
  ]);

  const [activeId, setActiveId] = useState<number>(1);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, role: 'ai', content: 'Hallo! Ich bin dein Evolution Mentor. Wie kann ich dir heute bei deiner Ausbildung oder Körperarbeit helfen?', timestamp: '10:25' }
    ],
    2: [
      { id: 1, role: 'support', content: 'Hallo! Hier ist das Support-Team von Evolution. Wie können wir dir helfen?', timestamp: 'Gestern' },
      { id: 2, role: 'user', content: 'Ich habe eine Frage zu meinem nächsten Vor-Ort Termin.', timestamp: 'Gestern' },
      { id: 3, role: 'support', content: 'Deine Frage zur Buchung wurde bearbeitet. Du findest alle Details in deinem Profil unter Buchungen.', timestamp: 'Gestern', status: 'read' }
    ]
  });

  const activeConversation = conversations.find(c => c.id === activeId);
  const activeMessages = messages[activeId] || [];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMessage]
    }));
    setInput('');

    // Simulate AI response if it's the AI chat
    if (activeId === 1) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          role: 'ai',
          content: 'Das ist eine interessante Frage. Lass mich kurz in meiner Wissensbasis nachsehen...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), aiResponse]
        }));
      }, 1500);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
      {/* Sidebar: Conversation List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-zinc-50/30">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-serif text-2xl text-zinc-900 mb-4">Nachrichten</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              placeholder="Suchen..." 
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`w-full p-4 flex gap-4 transition-all hover:bg-white border-b border-slate-50 ${
                activeId === conv.id ? 'bg-white' : ''
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  conv.type === 'ai' ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {conv.type === 'ai' ? <Sparkles size={24} /> : <User size={24} />}
                </div>
                {conv.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-zinc-900 truncate text-sm">{conv.name}</h4>
                  <span className="text-[10px] text-zinc-400 font-medium">{conv.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread && (
                <div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                  {conv.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-zinc-50/30">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeConversation.type === 'ai' ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {activeConversation.type === 'ai' ? <Sparkles size={20} /> : <User size={20} />}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-zinc-900">{activeConversation.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${activeConversation.online ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                      {activeConversation.type === 'ai' ? 'KI-Mentor Online' : 'Persönlicher Support'}
                    </p>
                  </div>
                </div>
              </div>
              {activeConversation.type === 'support' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                  <Info size={14} className="text-amber-600" />
                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-tight">
                    Antwortet in der Regel innerhalb von 24h
                  </p>
                </div>
              )}
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
            >
              <AnimatePresence initial={false}>
                {activeMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-zinc-100 text-zinc-400' : 
                      msg.role === 'ai' ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-400'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : 
                       msg.role === 'ai' ? <Sparkles size={16} /> : <User size={16} />}
                    </div>
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' 
                        : 'bg-zinc-100 text-zinc-800 rounded-tl-none border border-slate-200'
                    }`}>
                      <p>{msg.content}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                        msg.role === 'user' ? 'text-white/60' : 'text-zinc-400'
                      }`}>
                        {msg.timestamp}
                        {msg.role === 'user' && (
                          msg.status === 'read' ? <CheckCheck size={10} /> : <Check size={10} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-8 border-t border-slate-100 bg-zinc-50/30">
              <form 
                onSubmit={handleSend}
                className="relative flex items-center"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Schreibe eine Nachricht..."
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
            <Mail size={64} className="text-primary mb-6" />
            <h3 className="font-serif text-2xl text-zinc-900">Deine Inbox</h3>
            <p className="max-w-xs mt-2">Wähle eine Konversation aus, um Nachrichten zu lesen oder zu schreiben.</p>
          </div>
        )}
      </div>
    </div>
  );
}
