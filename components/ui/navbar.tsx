"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Why Choose Us", href: "/why-choose-us" },
    { name: "Industries", href: "/industries" },
    { name: "Careers", href: "/careers" },
    { name: "Contact Us", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header
      className={`w-full fixed top-0 z-[100] transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-lg"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Top Banner */}
      <div
        className={`bg-gradient-to-r from-[#00b4d8] to-[#0077b6] w-full text-center text-[11px] lg:text-[13px] font-medium tracking-wide text-white px-4 flex flex-col sm:flex-row justify-center items-center transition-all duration-500 overflow-hidden py-2 lg:py-0 ${
          scrolled ? "h-0 opacity-0 pointer-events-none" : "h-auto lg:h-10 opacity-100"
        }`}
      >
        <span className="opacity-90 leading-snug">
          Australia & India Partnership | Our offshore/onsite model ensures
          seamless service delivery.
        </span>
        <Link
          href="/why-choose-us"
          className="underline font-bold hover:text-[#0a1128] transition-colors duration-300 sm:ml-3 mt-1 sm:mt-0 whitespace-nowrap"
        >
          See how &rarr;
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative w-16 h-16 flex items-center justify-center transition-all duration-500">
            <img
              src="/logi-Photoroom.png"
              alt="NTS"
              className="w-14 h-14 object-contain z-10"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-xl lg:text-2xl font-black tracking-tighter leading-none transition-colors duration-300 ${
                scrolled ? "text-[#0a1128]" : "text-white"
              }`}
            >
              NOVALYTIX
            </span>
            <span className="text-[8px] lg:text-[9px] font-bold tracking-[0.25em] text-[#00b4d8] uppercase mt-1">
              Technology Services
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav
          className={`hidden lg:flex items-center gap-8 font-semibold text-[13px] uppercase tracking-widest transition-colors duration-300 ${
            scrolled ? "text-slate-600" : "text-white/90"
          }`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.name}
                className="relative group overflow-hidden py-2"
              >
                <span
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-[#00b4d8]"
                      : scrolled
                      ? "group-hover:text-[#0a1128]"
                      : "group-hover:text-[#00b4d8]"
                  }`}
                >
                  {item.name}
                </span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#00b4d8] transform origin-left transition-transform duration-300 ease-out ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
            );
          })}
        </nav>

        {/* CTA Buttons (Desktop) */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/contact" className="px-7 py-3 bg-[#00b4d8] text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-white hover:text-[#0a1128] hover:shadow-xl hover:shadow-[#00b4d8]/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 block text-center">
            Get Started
          </Link>
        </div>

        {/* Menu Toggle (Mobile) */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 transition-colors ${
              scrolled ? "text-[#0a1128]" : "text-white"
            }`}
          >
            {mobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <motion.div
        initial={false}
        animate={
          mobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        className="lg:hidden bg-white border-b border-gray-100 overflow-hidden shadow-2xl"
      >
        <nav className="flex flex-col p-6 gap-4">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.name}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-bold uppercase tracking-widest py-2 transition-colors border-b border-gray-50 last:border-0 ${
                pathname === item.href
                  ? "text-[#00b4d8]"
                  : "text-slate-600 hover:text-[#00b4d8]"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 text-sm font-bold text-white bg-[#00b4d8] rounded-xl shadow-lg shadow-[#00b4d8]/20 uppercase tracking-widest text-[11px] text-center">
              Get Started
            </Link>
          </div>
        </nav>
      </motion.div>
    </header>
  );
}
