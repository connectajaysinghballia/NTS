"use client";

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { CTA } from '@/components/ui/cta';
import { MapPin, Phone, Mail, Clock, Send, Shield, Globe } from 'lucide-react';

const contactInfo = [
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Visit Us",
    details: ["133/306, Transport Nagar, T. P. Nagar,", "Kanpur – 208023, Uttar Pradesh, India"],
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    details: ["+91 90053 33587", "+91 94154 80154", "0512 2982481"],
    color: "bg-cyan-500/10 text-cyan-500"
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Us",
    details: ["service.desk@novalytixtechservices.com"],
    color: "bg-sky-500/10 text-sky-500"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Working Hours",
    details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM"],
    color: "bg-indigo-500/10 text-indigo-500"
  }
];

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Parallax background
    gsap.to('.parallax-bg', {
      y: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Hero staggering
    gsap.from('.hero-element', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Contact Info cards staggering
    gsap.from('.contact-card', {
      x: -40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
      }
    });

    // Company Info card
    gsap.from('.company-card', {
      y: 40,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '.company-card',
        start: 'top 85%',
      }
    });

    // Form animation
    gsap.from('.form-container', {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '.form-container',
        start: 'top 80%',
      }
    });

    // Map container
    gsap.from('.map-container', {
      scale: 0.95,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.map-section',
        start: 'top 80%',
      }
    });
  }, { scope: containerRef });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
        // Reset form inputs if needed, but the state update should reflect in controlled components
        (e.target as HTMLFormElement).reset();
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Failed to send message. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fafcff] text-slate-800 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-16 lg:pt-40 lg:pb-24 xl:pt-44 xl:pb-32 overflow-hidden bg-[#020617] text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#00b4d8_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h4 className="text-[#00b4d8] font-black uppercase tracking-[0.4em] text-xs lg:text-sm mb-6 hero-element">
            Get in Touch
          </h4>
          <h1 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-black mb-6 tracking-tighter hero-element">
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] via-[#90e0ef] to-white">Conversation</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-400 font-light max-w-2xl mx-auto hero-element">
            Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-[#0a1128] mb-4 tracking-tight">Contact Information</h2>
              <p className="text-slate-500 mb-10">Reach out to us through any of these channels.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 contact-section">
                {contactInfo.map((info, i) => (
                  <div 
                    key={i}
                    className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow contact-card"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${info.color}`}>
                      {info.icon}
                    </div>
                    <h3 className="font-bold text-[#0a1128] mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, j) => (
                        <p key={j} className="text-sm text-slate-500 leading-relaxed">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-[#0a1128] to-[#020617] rounded-3xl text-white relative overflow-hidden group company-card">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">NOVALYTIX Technology Services</h3>
                  <p className="text-[#00b4d8] text-sm font-bold tracking-wider mb-2">CIN: U62090UP2025PTC223546</p>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Globe className="w-4 h-4" />
                    <span>Australia & India Operations</span>
                  </div>
                </div>
                <Shield className="w-16 h-16 text-[#00b4d8]/20 absolute top-4 right-4 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-slate-50 form-container">
            <h2 className="text-3xl font-black text-[#0a1128] mb-8 tracking-tight">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="John Doe"
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="john@company.com"
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Company Name</label>
                  <input 
                    type="text" 
                    name="company"
                    placeholder="Your Company"
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Your Message *</label>
                <textarea 
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us about your project or inquiry..."
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8] transition-all placeholder:text-slate-300 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-[0.98] ${isSubmitting ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-[#00b4d8] hover:bg-[#0077b6] shadow-blue-500/20'}`}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                {!isSubmitting && <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-6 map-section">
        <div className="max-w-7xl mx-auto">
          <div className="h-[500px] w-full bg-slate-100 rounded-[3rem] overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700 shadow-xl border border-white map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.6276840748115!2d80.29291197410884!3d26.471694278917397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c38676d900669%3A0x6a19f6a1d8a1d8a1!2sTransport%20Nagar%2C%20Kanpur%2C%20Uttar%20Pradesh%2C%20India!5e0!3m2!1sen!2sau!4v1710940000000!5m2!1sen!2sau" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-96 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#00b4d8] text-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a1128] mb-1">Kanpur, Uttar Pradesh, India</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">133/306, Transport Nagar, T. P. Nagar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
