
"use client";


import React, { useState, useEffect } from 'react';
// import { Cobe } from '@/components/ui/globe';
import styles from './bubble.module.css';
import Counter from '@/components/ui/counter';
import { motion } from 'framer-motion';
import { Timeline } from '@/components/ui/timeline';
import { Footer } from '@/components/ui/footer';
import { CTA } from '@/components/ui/cta';
import { Reviews } from '@/components/ui/reviews';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ThreeGlobeHero = dynamic(() => import('@/components/ui/three-globe').then(m => m.ThreeGlobeComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-64 h-64 bg-[#00b4d8]/5 rounded-full animate-pulse border border-[#00b4d8]/10 blur-xl" />
    </div>
  )
});

const heroGlobeConfig = {
  pointSize: 1,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#38bdf8",
  atmosphereAltitude: 0.1,
  emissive: "#012a4a",
  emissiveIntensity: 0.5,
  shininess: 0.8,
  polygonColor: "rgba(0,180,216,1.0)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1200,
  arcLength: 0.9,
  autoRotate: true,
  autoRotateSpeed: 3.5,
};

const heroArcs = [
  {
    order: 1,
    startLat: 26.4499,
    startLng: 80.3319,
    endLat: -33.8688,
    endLng: 151.2093,
    arcAlt: 0.1,
    color: "#ffffff"
  }
];

const expertiseData = [
  {
    title: "Data & Analytics",
    content: (
      <div className="mb-10">
        <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mb-8">
          Harness the power of data. We uncover trends, patterns, and opportunities to drive deeply informed business decisions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group rounded-2xl overflow-hidden h-40 md:h-60 shadow-lg border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
              alt="Data Analytics"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/80 via-[#00b4d8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
              <Link href="/contact" className="px-5 py-2.5 bg-white text-[#0a1128] text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-400 flex items-center gap-2">
                Learn More <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
          <div className="relative group rounded-2xl overflow-hidden h-40 md:h-60 shadow-lg border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
              alt="Business Dashboard"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/80 via-[#00b4d8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
              <Link href="/contact" className="px-5 py-2.5 bg-white text-[#0a1128] text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-400 flex items-center gap-2">
                Learn More <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Digital Solutions",
    content: (
      <div className="mb-10">
        <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mb-8">
          Embrace transformation with tailored web, mobile, and e-commerce platforms that drive agility and unshakeable customer engagement.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group rounded-2xl overflow-hidden h-40 md:h-60 shadow-lg border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
              alt="Digital Solutions"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/80 via-[#00b4d8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
              <Link href="/contact" className="px-5 py-2.5 bg-white text-[#0a1128] text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-400 flex items-center gap-2">
                Learn More <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
          <div className="relative group rounded-2xl overflow-hidden h-40 md:h-60 shadow-lg border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80"
              alt="Digital Transformation"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/80 via-[#00b4d8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
              <Link href="/contact" className="px-5 py-2.5 bg-white text-[#0a1128] text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-400 flex items-center gap-2">
                Learn More <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "AI Solutions",
    content: (
      <div className="mb-10">
        <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mb-8">
          From cognitive computing to advanced ML algorithms, we develop intelligent systems that fundamentally transform business capabilities.
        </p>
        <div className="w-full">
          <div className="relative group rounded-2xl overflow-hidden h-40 md:h-80 shadow-lg border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"
              alt="Artificial Intelligence"
              className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/80 via-[#00b4d8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
              <Link href="/contact" className="px-5 py-2.5 bg-white text-[#0a1128] text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-400 flex items-center gap-2">
                Learn More <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Cyber Security",
    content: (
      <div className="mb-10">
        <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mb-8">
          Protecting digital assets is paramount. We offer uncompromising, robust protection against the most advanced and evolving threats.
        </p>
        <div className="w-full">
          <div className="relative group rounded-2xl overflow-hidden h-40 md:h-80 shadow-lg border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
              alt="Cyber Security"
              className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/80 via-[#00b4d8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
              <Link href="/contact" className="px-5 py-2.5 bg-white text-[#0a1128] text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-400 flex items-center gap-2">
                Learn More <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Managed IT",
    content: (
      <div className="mb-10">
        <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mb-8">
          Tailored network solutions focusing fiercely on scalability, reliability, and performance to solve your unique infrastructure challenges.
        </p>
        <div className="w-full">
          <div className="relative group rounded-2xl overflow-hidden h-40 md:h-80 shadow-lg border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
              alt="IT Infrastructure"
              className="object-cover w-full h-full object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/80 via-[#00b4d8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
              <Link href="/contact" className="px-5 py-2.5 bg-white text-[#0a1128] text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-400 flex items-center gap-2">
                Learn More <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Graduate Internship",
    content: (
      <div className="mb-10">
        <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mb-8">
          Empower your career. Hands-on experience, elite mentorship, and real-world projects to launch outstanding technology careers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group rounded-2xl overflow-hidden h-40 md:h-60 shadow-lg border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Team mentorship"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0077b6]/80 via-[#00b4d8]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
              <Link href="/contact" className="px-5 py-2.5 bg-white text-[#0a1128] text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-400 flex items-center gap-2">
                Learn More <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-[#0a1128] text-white p-8 flex flex-col justify-center h-40 md:h-60 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#00b4d8] rounded-full blur-[60px] opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
             <h4 className="text-2xl font-black mb-2 relative z-10">Join Us</h4>
             <p className="text-slate-400 text-sm mb-6 relative z-10">Launch your tech career with real-world projects.</p>
             <Link href="/careers" className="px-5 py-3 w-fit bg-[#00b4d8] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white hover:text-[#0a1128] shadow-[0_10px_20px_-5px_rgba(0,180,216,0.4)] transition-all relative z-10">
                Apply Now
             </Link>
          </div>
        </div>
      </div>
    )
  }
];

import { Navbar } from '@/components/ui/navbar';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dynamicGlobeConfig = {
    ...heroGlobeConfig,
    autoRotateSpeed: isMobile ? 8.0 : 3.5,
  };

  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-800 font-sans selection:bg-[#00b4d8] selection:text-white">
      <Navbar />

      {/* Premium Hero Section with Video Background and Animated Stats */}
      <section className="relative w-full min-h-[100vh] lg:h-[100vh] lg:max-h-[850px] flex items-start lg:items-center bg-[#020617] overflow-hidden pt-36 md:pt-32 lg:pt-28 xl:pt-32 pb-48 lg:pb-20">
        {/* Background Video Layer */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-60 scale-[1.05] grayscale brightness-[0.5] transition-transform duration-[10s] hover:scale-100"
          >
            <source src="/bgvideo.mp4" type="video/mp4" />
          </video>
          {/* Enhanced Light & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/60"></div>
          
          {/* Animated Glow Globes */}
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#00b4d8]/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#0077b6]/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
          
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#00b4d8 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-8 lg:gap-12 mt-4 lg:-mt-12 xl:-mt-20 2xl:-mt-24">
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <h1 className="text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] 2xl:text-6xl font-bold leading-[1.1] tracking-tighter text-white mb-4 lg:mb-5 2xl:mb-6 max-w-5xl">
              <motion.span
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.01 } }
                }}
                className="md:whitespace-nowrap"
              >
                {"Innovative Technology".split("").map((child, idx) => (
                  <motion.span 
                    key={idx} 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 300 } }
                    }}
                    className={styles.hoverText}
                  >
                    {child === " " ? "\u00A0" : child}
                  </motion.span>
                ))}
              </motion.span>
              <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] via-[#90e0ef] to-white">
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.01, delayChildren: 0.2 } }
                  }}
                >
                  {"Solutions".split("").map((child, idx) => (
                    <motion.span 
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 300 } }
                      }}
                      className={styles.hoverText}
                    >
                      {child === " " ? "\u00A0" : child}
                    </motion.span>
                  ))}
                </motion.span>
              </span>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
              className="text-slate-400 text-sm xl:text-base font-light leading-relaxed mb-4 lg:mb-6 max-w-2xl"
            >
              Providing cutting-edge technology solutions for media and retail through our seamless offshore/onsite delivery model.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <Link href="/contact" className={styles.cta}>
                <span>Get Started Now</span>
                <svg width="15px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5" />
                  <polyline points="8 1 12 5 8 9" />
                </svg>
              </Link>
            </motion.div>

            {/* Stats Section */}
            <div className="mt-8 lg:mt-10 flex flex-nowrap items-center justify-between lg:justify-start gap-4 lg:gap-8 xl:gap-10 w-full animate-fade-in-up delay-100 overflow-x-auto pb-4 no-scrollbar">
               {[
                 { val: '50', unit: '+', label: 'Enterprise Clients' },
                 { val: '5', unit: '+', label: 'Global Regions' },
                 { val: '100', unit: '%', label: 'Client Retention' }
               ].map((stat, idx) => (
                 <div key={idx} className="relative group transition-all duration-500 min-w-fit flex-1 lg:flex-none">
                    <div className="flex items-baseline gap-0.5 lg:gap-1 relative z-10">
                      <h4 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-white group-hover:text-[#00b4d8] transition-all duration-500 tracking-tighter"><Counter value={Number(stat.val)} /></h4>
                      <span className="text-xs md:text-sm lg:text-lg font-black text-[#00b4d8]">{stat.unit}</span>
                    </div>
                    <p className="text-[#90e0ef] font-bold tracking-[0.1em] text-[5px] md:text-[6px] lg:text-[8px] uppercase mt-0.5 lg:mt-1 opacity-70 group-hover:opacity-100 transition-opacity whitespace-nowrap">{stat.label}</p>
                 </div>
               ))}
            </div>
          </motion.div>

          <div className="flex justify-center items-center h-[280px] w-[280px] sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px] xl:h-[420px] xl:w-[420px] 2xl:h-[480px] 2xl:w-[480px] mx-auto lg:ml-auto lg:mr-0 relative mt-8 lg:mt-0 xl:-mt-4">
            <div className="absolute inset-0 bg-[#00b4d8]/10 rounded-full blur-[60px] lg:blur-[80px] animate-pulse"></div>
            <ThreeGlobeHero 
              globeConfig={dynamicGlobeConfig}
              data={heroArcs}
            />
          </div>
          
        </div>


        {/* Full-Width Partner Logo Strip */}
        <div className="absolute bottom-0 left-0 w-full py-8 lg:py-10 bg-black border-t border-white/5 flex flex-wrap justify-center items-center divide-x divide-white/10 hover:opacity-100 transition-all duration-700">
           {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="px-6 md:px-10 lg:px-8 xl:px-16 2xl:px-20 flex items-center justify-center transition-all group relative cursor-pointer">
                {/* Blue glow overlay */}
                <div className="absolute inset-0 bg-[#00b4d8]/0 group-hover:bg-[#00b4d8]/15 rounded-xl transition-all duration-400 blur-sm"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{ background: 'radial-gradient(ellipse at center, rgba(0,180,216,0.2) 0%, transparent 70%)' }}></div>
                <img
                  src="/herologo.png"
                  alt="Partner Logo"
                  className="h-12 md:h-16 lg:h-16 xl:h-20 2xl:h-24 object-contain brightness-[0.6] group-hover:brightness-100 group-hover:scale-110 transition-all duration-400 relative z-10"
                />
              </div>
           ))}
        </div>
      </section>



      <div className="relative z-20 overflow-hidden w-full">
        <Timeline data={expertiseData} />
      </div>

      <CTA />
      <Reviews />
      <Footer />

    </div>
  );
}
