"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total opening time: 800ms
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            transition: { duration: 0.3, ease: "easeOut" } 
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white"
          style={{ willChange: "opacity, transform" }}
        >
          <div className="relative flex flex-col items-center gap-10">
            {/* Logo Group */}
            <div className="relative size-32 lg:size-44 flex items-center justify-center">
              {/* Ultra-smooth spinning ring */}
              <motion.div 
                initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 360, scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-0 rounded-full border-[2px] border-slate-100 border-t-[#00b4d8]"
                style={{ backfaceVisibility: "hidden" }}
              />
              
              {/* Logo Reveal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.2, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.5, 
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.1
                }}
                className="relative z-10 w-24 h-24 lg:w-32 lg:h-32"
              >
                <Image 
                  src="/logi-Photoroom.png" 
                  alt="NTS Logo" 
                  fill
                  className="object-contain" 
                  priority
                />
              </motion.div>
            </div>

            {/* Note: Removed progress bar to fix "blue block" overlay issue */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
