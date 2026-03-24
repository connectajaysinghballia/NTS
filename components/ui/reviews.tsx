"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const reviewsData = [
  { id: 1, name: "Alexander Rivers", role: "CTO, TechGrowth", content: "NOVALYTIX transformed our data infrastructure. The offshore model was seamless and delivered beyond our expectations.", avatar: "AR" },
  { id: 2, name: "Sarah Chen", role: "Director of AI, RetailMax", content: "Their AI solutions are truly cutting-edge. We saw a 40% increase in operational efficiency within six months.", avatar: "SC" },
  { id: 3, name: "James Sterling", role: "CEO, GlobalMedia", content: "Highly reliable and scalable solutions. They are our go-to partner for all complex technical challenges.", avatar: "JS" },
  { id: 4, name: "Elena Volkov", role: "Security Lead, CyberSafe", content: "Uncompromising security standards and technical excellence. The best team we've worked with.", avatar: "EV" },
];

export function Reviews() {
  const [items, setItems] = useState(reviewsData);

  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      setItems((prev) => {
        const newItems = [...prev];
        const lastItem = newItems.pop();
        if (lastItem) newItems.unshift(lastItem);
        return newItems;
      });
    }, 3500);
    return () => clearInterval(shuffleInterval);
  }, []);

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[300px] bg-[#00b4d8]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Left Side: Content & Trust Markers */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h4 className="text-[#00b4d8] font-black uppercase tracking-[0.4em] text-xs lg:text-sm mb-6">
                Client Success
              </h4>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0a1128] tracking-tighter mb-8 leading-[1.1]">
                Trusted by <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] to-[#03045e]">Industry Leaders</span>
              </h3>
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12 max-w-xl">
                We empower media, retail, and tech enterprises through cutting-edge solutions and a high-performance global delivery model.
              </p>

              {/* Stats/Trust Grid */}
              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-3xl font-black text-[#0a1128]">4.9<span className="text-[#00b4d8] text-xl">/5</span></p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Avg. Client Satisfaction</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#0a1128]">50<span className="text-[#00b4d8] text-xl">+</span></p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Enterprise Partners</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Shuffle Cards Section */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-[420px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {items.slice(0, 3).map((review, index) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, x: 50 }}
                    animate={{ 
                      opacity: index === 0 ? 1 : index === 1 ? 0.6 : 0.2,
                      scale: 1 - index * 0.08,
                      y: index * 35,
                      x: index * 12,
                      zIndex: items.length - index,
                    }}
                    exit={{ opacity: 0, x: 180, rotate: 15, scale: 0.8 }}
                    transition={{ 
                      duration: 0.8, 
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute w-full max-w-[480px] p-12 rounded-[3rem] bg-white border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] flex flex-col justify-between"
                    style={{ transformOrigin: 'center right' }}
                  >
                    <p className="text-slate-600 text-[17px] font-medium italic mb-10 leading-relaxed relative">
                      <span className="absolute -top-6 -left-3 text-5xl text-[#00b4d8]/20 font-serif">"</span>
                      {review.content}
                    </p>
                    <div className="flex items-center gap-5">
                      <div className="size-12 rounded-full bg-gradient-to-br from-[#00b4d8] to-[#03045e] flex items-center justify-center text-white text-[11px] font-black tracking-tighter shadow-xl shadow-[#00b4d8]/20">
                        {review.avatar}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[16px] font-black text-[#0a1128]">{review.name}</span>
                        <span className="text-[11px] font-bold text-[#00b4d8] uppercase tracking-[0.2em]">{review.role}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
