import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User as UserIcon, Bot, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api, User, Message } from '../services/api';
import { getChatResponse } from '../services/gemini';

export default function Chat({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getChatHistory(user.id).then(setMessages);
  }, [user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    
    // Optimistic update
    const newUserMsg: Message = {
      id: Date.now(),
      user_id: user.id,
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMsg]);
    
    setIsTyping(true);

    try {
      // Save to DB
      await api.saveMessage(user.id, 'user', userMessage);

      // Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      history.push({ role: 'user', parts: [{ text: userMessage }] });

      // Get AI response
      const aiResponse = await getChatResponse(history);
      
      if (aiResponse) {
        // Save AI response to DB
        await api.saveMessage(user.id, 'model', aiResponse);
        
        const newAiMsg: Message = {
          id: Date.now() + 1,
          user_id: user.id,
          role: 'model',
          content: aiResponse,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newAiMsg]);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-[2.5rem] border border-black/5 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="font-serif text-xl text-zinc-900">Evolated-Expert</h2>
            <p className="text-xs text-primary font-bold uppercase tracking-widest">KI-Mentor Online</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <Bot size={48} className="text-primary" />
            <p className="font-serif text-xl text-zinc-900">Wie kann ich dir heute helfen?</p>
            <p className="text-sm max-w-xs">Frage nach deiner Ausbildung, Körperarbeit oder dem nächsten Termin.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                message.role === 'user' ? 'bg-zinc-100 text-zinc-600' : 'bg-primary/10 text-primary'
              }`}>
                {message.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed ${
                message.role === 'user' 
                  ? 'bg-zinc-100 text-zinc-800 rounded-tr-none border border-slate-200' 
                  : 'bg-primary text-white rounded-tl-none shadow-lg shadow-primary/10'
              }`}>
                <div className={`prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-serif ${message.role === 'model' ? 'prose-invert' : ''}`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="bg-primary p-5 rounded-3xl rounded-tl-none flex gap-1">
              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-white rounded-full" />
              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-white rounded-full" />
              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-zinc-50/50 border-t border-slate-100">
        <form 
          onSubmit={handleSend}
          className="relative flex items-center"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Schreibe dem Evolated-Expert..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-zinc-400 text-center mt-4 uppercase tracking-widest font-bold">
          KI-Mentor kann Fehler machen. Überprüfe wichtige Informationen.
        </p>
      </div>
    </div>
  );
}
