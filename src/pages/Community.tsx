import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Share2, Send, Image as ImageIcon } from 'lucide-react';
import { User } from '../services/api';

interface Post {
  id: number;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  image?: string;
}

export default function Community({ user }: { user: User }) {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Sarah Meyer',
      role: 'Yoga Lehrerin',
      content: 'Heute haben wir uns intensiv mit der Ausrichtung im herabschauenden Hund beschäftigt. Die Fortschritte der Gruppe sind unglaublich! 🧘‍♀️',
      timestamp: 'Vor 2 Stunden',
      likes: 12,
      comments: 3,
      image: 'https://picsum.photos/seed/post1/800/400'
    },
    {
      id: 2,
      author: 'Evolated Expert Team',
      role: 'Admin',
      content: 'Erinnerung: Morgen um 18:00 Uhr findet unser wöchentlicher Live Q&A Call statt. Bereitet eure Fragen zur Anatomie vor! 📚',
      timestamp: 'Vor 5 Stunden',
      likes: 24,
      comments: 8
    },
    {
      id: 3,
      author: 'Thomas Wagner',
      role: 'Student',
      content: 'Die Lektion über die Biomechanik des Beckens war ein echter Augenöffner. Endlich verstehe ich, warum ich bei bestimmten Asanas Einschränkungen hatte.',
      timestamp: 'Gestern',
      likes: 15,
      comments: 2
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now(),
      author: user.name,
      role: 'Student',
      content: newPost,
      timestamp: 'Gerade eben',
      likes: 0,
      comments: 0
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <header>
        <h1 className="font-serif text-4xl text-zinc-900 mb-2">Community Wall</h1>
        <p className="text-zinc-500">Tausche dich mit anderen Schülern und Experten aus.</p>
      </header>

      {/* Create Post */}
      <div className="card-evolated p-6">
        <form onSubmit={handlePost} className="space-y-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Teile deine Gedanken oder Fragen..."
            className="w-full bg-zinc-50 border border-slate-100 rounded-2xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
          <div className="flex items-center justify-between">
            <button type="button" className="p-2 text-zinc-400 hover:text-primary transition-colors">
              <ImageIcon size={20} />
            </button>
            <button 
              type="submit"
              disabled={!newPost.trim()}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              Veröffentlichen <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-evolated overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-serif text-xl">
                      {post.author[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">{post.author}</h4>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-primary">{post.role}</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">{post.timestamp}</span>
                </div>

                <p className="text-zinc-600 leading-relaxed text-lg">
                  {post.content}
                </p>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden border border-slate-100">
                    <img src={post.image} className="w-full h-auto" referrerPolicy="no-referrer" />
                  </div>
                )}

                <div className="pt-6 border-t border-slate-50 flex items-center gap-8">
                  <button className="flex items-center gap-2 text-zinc-400 hover:text-rose-500 transition-colors group">
                    <Heart size={18} className="group-hover:fill-rose-500" />
                    <span className="text-sm font-bold">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors">
                    <MessageSquare size={18} />
                    <span className="text-sm font-bold">{post.comments}</span>
                  </button>
                  <button className="ml-auto text-zinc-400 hover:text-zinc-600 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
