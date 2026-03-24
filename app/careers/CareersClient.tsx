"use client";

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, type Variants } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { CTA } from '@/components/ui/cta';
import { MapPin, Briefcase, ArrowRight, Rocket, Heart, TrendingUp, Medal } from 'lucide-react';
import { ApplicationModal } from '@/components/ui/application-modal';

/* ─── Data ──────────────────────────────────────────────────────── */

const values = [
  { icon: <Rocket className="w-6 h-6 text-white" />, title: "Career Growth",      desc: "Fast-track your career with world-class learning opportunities and mentorship." },
  { icon: <Heart  className="w-6 h-6 text-white" />, title: "Work-Life Balance",  desc: "Flexible hours and remote work options designed for a healthier, happier you." },
  { icon: <TrendingUp className="w-6 h-6 text-white"/>,title:"Competitive Pay",   desc: "Industry-leading compensation with health benefits and performance bonuses." },
  { icon: <Medal  className="w-6 h-6 text-white" />, title: "Recognition",        desc: "Regular rewards and spotlight programs to celebrate your impact." },
];

const jobs = [
  {
    type: "Full-time", title: "Senior Data Analyst",
    desc: "Join our Data & Analytics team to help clients unlock insights from their data.",
    dept: "Data & Analytics", location: "Kanpur / Remote", exp: "3-5 years",
    reqs: ["Python/R proficiency","SQL expertise","Data visualization tools","Statistical analysis"],
    accent: "from-sky-500 to-blue-600",
  },
  {
    type: "Full-time", title: "AI/ML Engineer",
    desc: "Build cutting-edge AI solutions that transform how businesses operate.",
    dept: "AI Solutions", location: "Hybrid", exp: "2-4 years",
    reqs: ["Machine Learning frameworks","Python","Deep Learning","NLP/Computer Vision"],
    accent: "from-violet-500 to-purple-700",
  },
  {
    type: "Full-time", title: "Cyber Security Specialist",
    desc: "Protect our clients' digital assets with advanced security solutions.",
    dept: "Cyber Security", location: "Kanpur", exp: "4-6 years",
    reqs: ["Security frameworks","Penetration testing","SIEM tools","Incident response"],
    accent: "from-rose-500 to-red-700",
  },
  {
    type: "Full-time", title: "Full Stack Developer",
    desc: "Create innovative web and mobile applications for diverse clients.",
    dept: "Digital Solutions", location: "Remote", exp: "2-5 years",
    reqs: ["React/Node.js","Cloud platforms","Database design","RESTful APIs"],
    accent: "from-emerald-500 to-teal-700",
  },
  {
    type: "Internship", title: "Graduate Internship Program",
    desc: "Launch your tech career with hands-on experience across various domains.",
    dept: "All Departments", location: "Kanpur", exp: "Fresher",
    reqs: ["Recent graduate","Strong fundamentals","Eagerness to learn","Team player"],
    accent: "from-amber-500 to-orange-600",
  },
];

/* ─── Animation Variants ─────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Sub-components ─────────────────────────────────────────────── */

function JobCard({ job, i, onApply }: { job: typeof jobs[0]; i: number; onApply: (title: string) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:border-[#00b4d8]/20 transition-all duration-400 overflow-hidden"
    >
      {/* Coloured left stripe */}
      <div className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${job.accent}`} />

      <div className="pl-7 pr-6 lg:pr-8 py-6 lg:py-7 flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
        {/* Left */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${
              job.type === 'Full-time' ? 'bg-sky-100 text-sky-600' : 'bg-violet-100 text-violet-600'
            }`}>{job.type}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">· {job.dept}</span>
          </div>
          <h3 className="text-xl font-black text-[#0a1128] mb-2 group-hover:text-[#00b4d8] transition-colors duration-300 leading-tight">
            {job.title}
          </h3>
          <p className="text-sm text-slate-500 mb-5 max-w-xl leading-relaxed">{job.desc}</p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#00b4d8]" />{job.location}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-600 font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-[#00b4d8]" />{job.exp}
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-56 shrink-0 flex flex-col gap-4">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Requirements</p>
            <ul className="space-y-2.5">
              {job.reqs.map((r, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${job.accent} shrink-0`} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => onApply(job.title)}
            className={`w-full py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-xl bg-gradient-to-r ${job.accent} hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-md`}
          >
            Apply Now
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */

export function CareersClient() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY    = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroY  = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-800 font-sans overflow-x-hidden">
      <Navbar />
      <ApplicationModal 
        isOpen={!!selectedJob} 
        onClose={() => setSelectedJob(null)} 
        jobTitle={selectedJob || ""} 
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative pt-32 pb-16 lg:pt-36 lg:pb-20 flex flex-col items-center justify-center overflow-hidden bg-[#020617] text-white">
        {/* Parallax dot grid */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 opacity-[0.18]">
          <div className="absolute inset-0 bg-[radial-gradient(#00b4d8_1px,transparent_1px)] [background-size:40px_40px]" />
        </motion.div>

        {/* Parallax glows */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#00b4d8]/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#0077b6]/15 rounded-full blur-[100px]" />
          <div className="absolute top-10 left-0 w-60 h-60 bg-[#00b4d8]/8 rounded-full blur-[80px]" />
        </motion.div>

        {/* Hero text with fade-on-scroll */}
        <motion.div style={{ y: heroY, opacity }} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h4
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[#00b4d8] font-black uppercase tracking-[0.4em] text-xs lg:text-sm mb-6"
          >
            Join Our Team
          </motion.h4>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 tracking-tighter leading-[1.05]"
          >
            Build Your Career with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] via-[#90e0ef] to-white">
              NOVALYTIX
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-slate-400 font-light max-w-2xl mx-auto mb-10"
          >
            Join a team of passionate innovators working on cutting-edge technology solutions.
            Shape the future of business technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            <Link
              href="#open-positions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00b4d8] hover:bg-[#0096b8] text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#00b4d8]/30 group"
            >
              View Open Roles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── VALUE PILLARS ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#fafcff] border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: false, margin: "-80px" }}
            className="text-center mb-16"
          >
            <span className="inline-block text-[#00b4d8] text-xs font-black uppercase tracking-[0.3em] mb-3">Our Culture</span>
            <h2 className="text-3xl font-black text-[#0a1128] mb-3 tracking-tight">Why Join NOVALYTIX?</h2>
            <div className="w-12 h-1 bg-[#00b4d8] mx-auto rounded-full" />
          </motion.div>

          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="show"
            viewport={{ once: false, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {values.map((v, i) => (
              <motion.div
                key={i} variants={cardVariant}
                whileHover={{ y: -4 }}
                className="group relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:border-[#00b4d8]/30 transition-all duration-300 overflow-hidden cursor-default"
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#00b4d8] to-[#0077b6] rounded-l-2xl" />
                <div className="pl-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#0077b6] flex items-center justify-center mb-4 shadow-md shadow-sky-400/20 group-hover:scale-105 transition-transform duration-300">
                    {v.icon}
                  </div>
                  <h3 className="font-black text-[#0a1128] text-base mb-1.5">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── OPEN POSITIONS ───────────────────────────────────── */}
      <section id="open-positions" className="py-24 px-6 bg-[#fafcff]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show"
            viewport={{ once: false, margin: "-80px" }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-[#0a1128] tracking-tight mb-3">Open Positions</h2>
            <p className="text-slate-500 text-sm">Explore opportunities to grow your career with us</p>
          </motion.div>

          <div className="space-y-5">
            {jobs.map((job, i) => (
              <JobCard key={i} job={job} i={i} onApply={setSelectedJob} />
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}
