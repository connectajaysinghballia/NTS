"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const swapFeatures = [
  {
    id: 1,
    title: "Data-Driven Excellence",
    description: "At NOVALYTIX, we excel in harnessing the power of data to provide valuable insights for your business. Our team of experts ensures that you have access to the most accurate and relevant data-driven solutions, empowering you to make informed decisions with confidence.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Advanced AI Solutions",
    description: "Experience the future with our advanced AI solutions tailored to meet your specific business needs. From predictive analysis to machine learning, we leverage the latest AI technologies to drive innovation and efficiency within your organization.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Robust Cyber Security",
    description: "Protect your digital assets with our robust cyber security measures. We understand the importance of safeguarding your data and systems from potential threats, and our comprehensive security solutions are designed to keep your business safe and secure in the digital landscape.",
    image: "https://images.unsplash.com/photo-1510511459019-5d0197411bc6?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Digital Transformation",
    description: "Embrace digital transformation with our innovative solutions that elevate your digital presence and streamline your processes. Whether it's developing custom applications or optimizing digital platforms, we are committed to driving your digital success through our cutting-edge solutions.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Flexible Offshore/Onsite Model",
    description: "We offer a flexible offshore/onsite model that caters to the specific needs of our media and retail clients in Australia. This model allows us to seamlessly integrate our services with your operations, ensuring a personalized and efficient approach to delivering our technology solutions.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Scalable Cloud Solutions",
    description: "At NOVALYTIX, we provide scalable cloud solutions that grow with your business. Whether you're migrating to the cloud or optimizing existing infrastructure, our cloud expertise ensures high performance, flexibility, and cost efficiency for your operations.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Dedicated Support & Maintenance",
    description: "Our commitment doesn't end with delivery. We offer dedicated support and ongoing maintenance to ensure your systems run smoothly at all times. With proactive monitoring and quick issue resolution, we keep your business operations uninterrupted and efficient.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
  }
];

const FeatureItem = ({ feature, isActive, setAsActive }: { feature: typeof swapFeatures[0]; isActive: boolean; setAsActive: (id: number) => void }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (isInView) {
      setAsActive(feature.id);
    }
  }, [isInView, feature.id, setAsActive]);

  const formattedNumber = String(feature.id).padStart(2, '0');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      ref={ref} 
      className="py-16 lg:py-48 first:pt-24 last:pb-48 transition-all duration-500"
    >
      {/* Mobile Image (Visible only on small screens) */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="block lg:hidden w-full max-w-[450px] mx-auto aspect-video rounded-3xl overflow-hidden mb-8 shadow-2xl"
      >
        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
      </motion.div>
      
      <div className={`text-4xl lg:text-6xl font-black mb-4 transition-all duration-700 ease-out ${isActive ? 'text-[#00b4d8] translate-x-0 opacity-100 scale-100' : 'text-slate-200 -translate-x-8 opacity-50 scale-95'}`}>
        {formattedNumber}
      </div>

      <h3 className={`text-3xl lg:text-5xl font-black mb-6 transition-all duration-700 ease-out delay-75 ${isActive ? 'text-[#0a1128] translate-x-0 opacity-100' : 'text-slate-300 -translate-x-8 opacity-30'}`}>
        {feature.title}
      </h3>
      <p className={`text-lg lg:text-xl leading-relaxed transition-all duration-700 ease-out delay-150 ${isActive ? 'text-slate-600 translate-x-0 opacity-100' : 'text-slate-300 -translate-x-8 opacity-30'}`}>
        {feature.description}
      </p>
    </motion.div>
  );
};

import { MapPin, Info } from 'lucide-react';
import { Navbar } from '@/components/ui/navbar';
import { WorldMap } from '@/components/ui/map';
import { Footer } from '@/components/ui/footer';
import { CTA } from '@/components/ui/cta';
import { Reviews } from '@/components/ui/reviews';

export function WhyChooseUsClient() {
  const [activeFeature, setActiveFeature] = useState(swapFeatures[0].id);

  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-800 font-sans selection:bg-[#00b4d8] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00b4d8_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#00b4d8]/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#0077b6]/10 rounded-full blur-[150px]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h4 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
              className="text-[#00b4d8] font-black uppercase tracking-[0.4em] text-xs lg:text-sm mb-6 inline-block"
            >
              Why Partner With Us
            </motion.h4>
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
              className="text-4xl lg:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tighter"
            >
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] via-[#90e0ef] to-white">Choose NOVALYTIX?</span>
            </motion.h1>
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
              className="text-lg lg:text-2xl text-slate-400 font-light leading-relaxed max-w-3xl mx-auto"
            >
              Discover the unique advantages that set us apart and make us the trusted technology partner for businesses worldwide.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Swap Column Features Section */}
      <section className="relative px-6 bg-[#fafcff] w-full">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative">
          
          {/* Left column: Scrolling Text */}
          <div className="lg:w-1/2 w-full lg:pr-12 relative z-10">
            {swapFeatures.map((feature) => (
              <FeatureItem 
                key={feature.id} 
                feature={feature} 
                isActive={activeFeature === feature.id} 
                setAsActive={setActiveFeature} 
              />
            ))}
          </div>

          {/* Right column: Sticky Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden lg:flex lg:w-1/2 h-screen sticky top-0 items-center justify-center pointer-events-none"
          >
            <div className="relative w-full max-w-[450px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl p-2 bg-white/50 backdrop-blur-sm border border-white">
              {swapFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ 
                    opacity: activeFeature === feature.id ? 1 : 0, 
                    scale: activeFeature === feature.id ? 1 : 0.95,
                    y: activeFeature === feature.id ? 0 : 30,
                    zIndex: activeFeature === feature.id ? 10 : 0
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 p-2"
                >
                   <img src={feature.image} alt={feature.title} className="w-full h-full object-cover rounded-2xl shadow-inner border border-white/20" />
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>


      {/* Global Network Section */}
      <section className="py-24 bg-[#030712] w-full overflow-hidden border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2, margin: "-100px" }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] // Custom quintic ease-out
          }}
        >
          <div className="max-w-7xl mx-auto px-6 text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black text-white mb-6"
            >
              Global Network
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-xl text-slate-400 max-w-3xl mx-auto"
            >
              Connect with teams and clients worldwide. Our platform enables seamless 
              collaboration across continents, bringing the world to your workspace.
            </motion.p>
          </div>
          
          <div className="max-w-7xl mx-auto px-4">
            <WorldMap
              dots={[
                {
                  start: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
                  end: { lat: 26.4499, lng: 80.3319, label: "Kanpur" },
                },
                {
                  start: { lat: 26.4499, lng: 80.3319, label: "Kanpur" },
                  end: { lat: 36.7783, lng: -119.4179, label: "California" },
                },
                {
                  start: { lat: 36.7783, lng: -119.4179, label: "California" },
                  end: { lat: -33.8688, lng: 151.2093, label: "Sydney" },
                },
              ]}
            />
          </div>
        </motion.div>
      </section>

      <CTA />
      <Reviews />
      <Footer />
    </div>
  );
}
