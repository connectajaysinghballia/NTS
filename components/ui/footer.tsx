"use client";

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Instagram, Linkedin, Twitter, Github, Mail, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navColumns = [
    {
      title: "Navigation",
      links: [
        { text: "Home", url: "/" },
        { text: "Why Choose Us", url: "/why-choose-us" },
        { text: "Industries", url: "/industries" },
        { text: "Careers", url: "/careers" },
        { text: "Blog", url: "/blog" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { text: "AI & ML Ops", url: "#" },
        { text: "Cloud Architecture", url: "#" },
        { text: "Cyber Infrastructure", url: "#" },
        { text: "Data Engineering", url: "#" },
        { text: "Digital Strategy", url: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", name: "LinkedIn" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Github, href: "#", name: "GitHub" },
  ];

  return (
    <footer className={cn('w-full bg-[#030712] relative overflow-hidden border-t border-white/10')}>
      {/* Background Visuals - Restored Dark Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover grayscale brightness-[0.4] scale-110"
        >
          <source src="/bgvideo.mp4" type="video/mp4" />
        </video>
        {/* Subtle Cyan Shade/Tint */}
        <div className="absolute inset-0 bg-[#00b4d8]/15 mix-blend-overlay"></div>
      </div>
      
      {/* Decorative Gradients - Darkened */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/90 to-[#030712]/50 z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00b4d8]/30 to-transparent"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00b4d8]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#0077b6]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        className='max-w-7xl mx-auto px-8 pt-10 pb-8 md:px-12 relative z-10'
      >
        {/* Top Section: Brand Hub */}
        <div className='flex flex-col gap-8 md:flex-row md:items-start md:justify-between mb-10'>
          <motion.div variants={itemVariants} className="flex flex-col gap-6 max-w-xl">
            <div className="flex items-center gap-5">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <img src="/logi-Photoroom.png" alt="NTS" className="w-14 h-14 object-contain relative z-10" />
                <div className="absolute inset-0 bg-[#00b4d8]/20 rounded-full blur-xl scale-150"></div>
              </div>
              <div className="flex flex-col text-left">
                <span className='text-[clamp(1.8rem,5vw,2.8rem)] font-black leading-none tracking-tighter text-white uppercase select-none'>
                  NOVALYTIX
                </span>
                <span className='text-[9px] font-black tracking-[0.4em] text-[#00b4d8] uppercase mt-1.5 opacity-90'>
                  Technology Services
                </span>
              </div>
            </div>

              <p className='text-[15px] md:text-[17px] leading-relaxed font-medium text-slate-400 max-w-md'>
                Architecting the next generation of digital infrastructure through a high-performance offshore-onsite collaborative delivery model.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className='flex flex-col gap-3 md:items-end md:max-w-xs'
            >
              <p className='text-sm font-black uppercase tracking-[0.2em] text-[#00b4d8] mb-1'>
                Newsletter
              </p>
              <div className='flex items-center bg-white/5 rounded-2xl overflow-hidden border border-white/10 p-1.5 w-full focus-within:border-[#00b4d8]/50 transition-all group'>
                <input
                  type='email'
                  placeholder='Email address*'
                  className='flex-1 px-4 py-2 text-sm text-white bg-transparent outline-none placeholder:text-slate-500 font-medium'
                />
                <button
                  type='submit'
                  className='flex items-center justify-center w-10 h-10 rounded-xl bg-[#00b4d8] text-white hover:bg-white hover:text-[#0a1128] transition-all duration-500 shadow-lg'
                >
                  <ArrowRight className='w-5 h-5' />
                </button>
              </div>
              <p className='text-[10px] text-slate-500 md:text-right font-medium opacity-80'>
                By subscribing you agree to our <Link href="#" className='underline hover:text-white transition-colors'>privacy policy</Link> and data terms.
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className='mb-10 border-t border-white/10'
          />

          {/* Middle Section: Links & Contact */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10'>
            {navColumns.map((col, colIdx) => (
              <motion.div key={colIdx} variants={itemVariants} className='flex flex-col gap-8'>
                <h4 className='text-[11px] font-black uppercase tracking-[0.3em] text-[#00b4d8] border-l-2 border-[#00b4d8] pl-4'>
                  {col.title}
                </h4>
                <ul className='flex flex-col gap-4'>
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.url}
                        className='text-[15px] font-bold text-slate-300 hover:text-white transition-all hover:translate-x-1.5 inline-block opacity-80 hover:opacity-100'
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className='flex flex-col gap-8'>
              <h4 className='text-[11px] font-black uppercase tracking-[0.3em] text-[#00b4d8] border-l-2 border-[#00b4d8] pl-4'>
                Legal
              </h4>
              <ul className='flex flex-col gap-4'>
                {['Privacy Policy', 'Compliance', 'Security Certs', 'Cookie Policy'].map((text) => (
                  <li key={text}>
                    <Link
                      href="#"
                      className='text-[15px] font-bold text-slate-300 hover:text-white transition-all hover:translate-x-1.5 inline-block opacity-80 hover:opacity-100'
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className='flex flex-col gap-8'>
              <h4 className='text-[11px] font-black uppercase tracking-[0.3em] text-[#00b4d8] border-l-2 border-[#00b4d8] pl-4'>
                Office
              </h4>
              <div className='flex flex-col gap-7'>
                <div className='flex items-start gap-4 group'>
                  <div className='w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-[#00b4d8] shrink-0 border border-white/10 group-hover:bg-[#00b4d8] group-hover:text-white transition-colors duration-500'>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className='text-[14px] text-slate-300 font-bold leading-relaxed opacity-90'>
                    133/306, Transport Nagar,<br/>Kanpur – 208023, India
                  </p>
                </div>
                <div className='flex items-start gap-4 group'>
                  <div className='w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-[#00b4d8] shrink-0 border border-white/10 group-hover:bg-[#00b4d8] group-hover:text-white transition-colors duration-500'>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <a href="mailto:office@novalytix.tech" className="text-[14px] text-white font-black hover:text-[#00b4d8] transition-colors">
                      office@novalytix.tech
                    </a>
                    <span className="text-[9px] uppercase tracking-widest text-[#00b4d8] font-black mt-1.5 opacity-70">Global Operations</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className='mb-6 border-t border-white/10'
          />

          {/* Bottom Bar: Ethics & Signals */}
          <motion.div
            variants={itemVariants}
            className='flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0'
          >
            <div className='w-full md:w-1/3 order-3 md:order-1 text-center md:text-left'>
              <p className='text-[10px] font-black uppercase tracking-[0.15em] text-slate-500'>
                © {currentYear} NOVALYTIX TECH SERVICES PVT LTD.
              </p>
            </div>

            <div className='flex items-center justify-center gap-3 w-full md:w-1/3 order-1 md:order-2'>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className='flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:border-[#00b4d8] hover:text-[#00b4d8] hover:bg-[#00b4d8]/5 transition-all duration-500 hover:-translate-y-1'
                >
                  <social.icon className='w-4.5 h-4.5' />
                </a>
              ))}
            </div>

            <div className='w-full md:w-1/3 flex justify-center md:justify-end order-2 md:order-3'>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Live Status: Operational</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
    </footer>
  );
}
