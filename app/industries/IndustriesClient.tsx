"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { CTA } from '@/components/ui/cta';
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

const industries = [
  {
    id: 1,
    title: "Media & Retail",
    description: "Innovative technology solutions tailored to the unique needs of media and retail businesses, driving growth in the Australian market.",
    features: ["Custom Solutions", "Omnichannel Integration", "Real-time Analytics"],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-2"
  },
  {
    id: 2,
    title: "Data & Analytics",
    description: "Advanced insights and strategic solutions empowering clients through seamless offshore/onsite delivery models.",
    features: ["Business Intelligence", "Predictive Analytics", "Data Visualization"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-1"
  },
  {
    id: 3,
    title: "AI & Cyber Security",
    description: "Robust protection and intelligent systems safeguarding digital assets with cutting-edge defensive technologies.",
    features: ["Machine Learning", "Threat Detection", "Compliance Management"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-1"
  },
  {
    id: 4,
    title: "Digital Solutions",
    description: "Comprehensive digital transformation from strategy to integrated platforms for modern enterprises.",
    features: ["E-commerce Platforms", "Mobile Applications", "Cloud Solutions"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    className: "md:col-span-2"
  },
  {
    id: 5,
    title: "Training & Placements",
    description: "Excellence in corporate training, internships, and reliable placements through an extensive industry network.",
    features: ["Corporate Training", "Internship Programs", "Placement Assistance"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-3"
  }
];

export function IndustriesClient() {
  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-800 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 lg:pt-28 xl:pt-32 lg:pb-20 overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00b4d8_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-20 w-96 h-96 bg-[#00b4d8]/20 rounded-full blur-[120px] pointer-events-none"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#0077b6]/15 rounded-full blur-[150px] pointer-events-none"
        ></motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl xl:max-w-6xl mx-auto"
          >
            <motion.h4 
              className="text-[#00b4d8] font-black uppercase tracking-[0.4em] text-xs lg:text-sm mb-6 inline-block"
            >
              Industries We Serve
            </motion.h4>
            <motion.h1 
              className="text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter"
            >
              Innovative Technology <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] via-[#90e0ef] to-white">Solutions for Your Business</span>
            </motion.h1>
            <motion.p 
              className="text-base md:text-lg lg:text-xl xl:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto"
            >
              Tailored solutions designed to meet the unique challenges and opportunities in your industry.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Industries Bento Grid Section */}
      <section className="py-24 px-6 bg-[#fafcff] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <BentoGrid className="!grid-cols-1 md:!grid-cols-3">
            {industries.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98] 
                }}
                className={item.className}
              >
                <BentoGridItem
                  title={item.title}
                  description={
                    <div className="flex flex-col gap-6">
                      <p className="text-base">{item.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.features.map((feature, j) => (
                          <span key={j} className="px-4 py-1.5 bg-slate-50 border border-slate-100 text-[#00b4d8] text-[11px] font-black uppercase tracking-widest rounded-full shadow-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  }
                  header={
                    <div className='relative flex min-h-64 w-full overflow-hidden'>
                      <img
                        src={item.image}
                        alt={item.title}
                        className='absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/bento:scale-110'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-[#0a1128]/60 via-[#0a1128]/20 to-transparent' />
                    </div>
                  }
                />
              </motion.div>
            ))}
          </BentoGrid>
        </div>
      </section>

      <CTA />
      <Footer />
    </div>
  );
}

