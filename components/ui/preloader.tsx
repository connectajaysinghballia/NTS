"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000); // 1-second total time for the logo reveal

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#020617]"
        >
          {/* Background Glows for a premium feel */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent" />
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#00b4d8]/20 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00b4d8]/10 rounded-full blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for a premium pop
            }}
            className="relative flex flex-col items-center gap-6"
          >
            <div className="relative size-32 lg:size-48">
              {/* Outer Glow Ring */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 rounded-full border border-[#00b4d8]/30 blur-[4px]"
              />
              <img 
                src="/herologo.png" 
                alt="NOVALYTIX" 
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_50px_rgba(0,180,216,0.3)]" 
              />
            </div>

            {/* Loading Accent Line */}
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[2px] bg-gradient-to-r from-transparent via-[#00b4d8] to-transparent mt-4"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
