"use client";

import React from 'react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="relative pt-12 pb-24 px-4 md:px-6 overflow-hidden bg-[#fafcff]">
      <div className="w-full max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden relative bg-[#030712] py-20 lg:py-24 px-6 md:px-12 flex flex-col items-center">
        {/* Background Visuals */}
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80" 
          alt="Earth from space" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale mix-blend-screen pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]"></div>
        
        {/* Decorative glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-[#00b4d8]/50 to-transparent pointer-events-none"></div>
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00b4d8]/15 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white mb-8 leading-[1.05]">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] via-[#90e0ef] to-white">Transform?</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl mx-auto opacity-90">
            Leverage advanced tech solutions tailored purely to your business needs. Get in touch with us for a free evaluation and discover the incredible NOVALYTIX advantage.
          </p>
          <Link 
            href="/contact"
            className="px-10 py-5 bg-[#00b4d8] text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-[#0a1128] hover:shadow-[0_0_60px_rgba(0,180,216,0.5)] transition-all duration-500 transform hover:-translate-y-1.5 active:scale-95 inline-block"
          >
            Claim Free Evaluation Now
          </Link>
        </div>
      </div>
    </section>
  );
}
