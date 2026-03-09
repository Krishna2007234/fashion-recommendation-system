/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  ChevronRight, 
  User, 
  ShoppingBag, 
  ArrowLeft,
  Loader2,
  Shirt,
  Heart
} from 'lucide-react';
import { getFashionRecommendations, RecommendationResponse, OutfitRecommendation } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [occasion, setOccasion] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!occasion.trim() || !gender) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getFashionRecommendations(occasion, gender);
      setRecommendations(data);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRecommendations(null);
    setOccasion('');
    setError(null);
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-brand-gold/20 rounded-full"
            />
            <Shirt className="w-20 h-20 text-brand-gold" />
          </div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 font-display text-6xl tracking-tighter uppercase"
          >
            VogueAI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8 }}
            className="mt-2 text-sm tracking-[0.3em] uppercase"
          >
            Curated by Intelligence
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark overflow-x-hidden">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <Shirt className="w-6 h-6 text-brand-gold" />
          <span className="font-display text-2xl tracking-tighter uppercase">VogueAI</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Collections</button>
          <button className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Trends</button>
          <ShoppingBag className="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer" />
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!recommendations ? (
            <motion.div
              key="search-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center mt-12"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <span className="inline-block px-4 py-1 rounded-full border border-brand-gold/30 text-[10px] uppercase tracking-[0.2em] text-brand-gold mb-4">
                  AI Fashion Assistant
                </span>
                <h2 className="text-5xl md:text-7xl font-display uppercase leading-[0.9] tracking-tighter max-w-3xl">
                  Redefine Your <span className="text-brand-gold italic font-serif normal-case tracking-normal">Style</span> For Every Occasion
                </h2>
              </motion.div>

              <div className="w-full max-w-2xl mt-8 space-y-8">
                {/* Gender Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGender('male')}
                    className={cn(
                      "flex flex-col items-center justify-center p-8 rounded-2xl border transition-all duration-500 group",
                      gender === 'male' 
                        ? "bg-white text-brand-dark border-white" 
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    )}
                  >
                    <User className={cn("w-8 h-8 mb-3 transition-transform duration-500", gender === 'male' && "scale-110")} />
                    <span className="font-display text-xl uppercase tracking-wider">Male</span>
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={cn(
                      "flex flex-col items-center justify-center p-8 rounded-2xl border transition-all duration-500 group",
                      gender === 'female' 
                        ? "bg-white text-brand-dark border-white" 
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    )}
                  >
                    <User className={cn("w-8 h-8 mb-3 transition-transform duration-500", gender === 'female' && "scale-110")} />
                    <span className="font-display text-xl uppercase tracking-wider">Female</span>
                  </button>
                </div>

                {/* Search Box */}
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g. Wedding in Tuscany, Holi Festival, Job Interview..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-xl focus:outline-none focus:border-brand-gold/50 transition-all placeholder:text-white/20"
                  />
                  <button
                    type="submit"
                    disabled={loading || !occasion || !gender}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-gold text-brand-dark px-6 py-3 rounded-xl font-display uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    {loading ? 'Consulting...' : 'Suggest'}
                  </button>
                </form>

                {error && (
                  <p className="text-red-400 text-sm mt-4">{error}</p>
                )}

                {/* Quick Suggestions */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {['Holi', 'Summer Wedding', 'Business Casual', 'Beach Party', 'Diwali', 'Gala Dinner'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setOccasion(s)}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <button 
                    onClick={reset}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 hover:opacity-100 mb-4 transition-opacity"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Search
                  </button>
                  <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter">
                    Curated for <span className="text-brand-gold italic font-serif normal-case tracking-normal">{recommendations.occasion}</span>
                  </h2>
                </div>
                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.2em] opacity-80">AI Analysis Complete</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.recommendations.map((outfit, index) => (
                  <OutfitCard key={index} outfit={outfit} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shirt className="w-5 h-5 text-brand-gold" />
            <span className="font-display text-xl tracking-tighter uppercase">VogueAI</span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">
            © 2026 VogueAI Fashion Systems. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Instagram', 'Twitter', 'Pinterest'].map(s => (
              <button key={s} className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">{s}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function OutfitCard({ outfit, index }: { outfit: OutfitRecommendation; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Use picsum with the search keyword for a consistent feel
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(outfit.imageSearchKeyword)}/800/1200`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-white/5">
        <motion.img
          src={imageUrl}
          alt={outfit.name}
          referrerPolicy="no-referrer"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Quick Action */}
        <div className="absolute top-6 right-6">
          <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-dark transition-all">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-semibold">Look {index + 1}</span>
            <h3 className="text-3xl font-display uppercase tracking-tight leading-none">{outfit.name}</h3>
          </div>
          
          <p className="text-sm text-white/60 line-clamp-2 font-light leading-relaxed group-hover:text-white/90 transition-colors">
            {outfit.description}
          </p>

          <div className="pt-4">
            <a
              href={outfit.shoppingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-xl font-display uppercase tracking-widest text-xs hover:bg-brand-gold transition-colors"
            >
              Shop this look <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
