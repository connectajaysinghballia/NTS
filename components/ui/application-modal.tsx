"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle2 } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

export function ApplicationModal({ isOpen, onClose, jobTitle }: ApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("jobTitle", jobTitle);

      const response = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setTimeout(() => setIsSuccess(false), 300); // reset after close animation
      }, 2000);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020617]/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-100"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#00b4d8] mb-1">Apply For</p>
                <h3 className="text-xl font-black text-[#0a1128]">{jobTitle}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-500">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-black text-[#0a1128] mb-2">Application Submitted!</h4>
                  <p className="text-slate-500 text-sm max-w-sm">Thank you for applying. Our talent team will review your profile and get back to you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="fullName" className="text-xs font-bold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                      <input required type="text" id="fullName" name="fullName" defaultValue="John Doe" placeholder="John Doe" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/50 focus:border-[#00b4d8] transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-xs font-bold text-slate-700">Email <span className="text-red-500">*</span></label>
                      <input required type="email" id="email" name="email" defaultValue="john@example.com" placeholder="john@example.com" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/50 focus:border-[#00b4d8] transition-all" />
                    </div>
                  </div>

                  {/* Row 2: Phone & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className="text-xs font-bold text-slate-700">Phone <span className="text-red-500">*</span></label>
                      <input required type="tel" id="phone" name="phone" defaultValue="+91 XXXXX XXXXX" placeholder="+91 XXXXX XXXXX" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/50 focus:border-[#00b4d8] transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="location" className="text-xs font-bold text-slate-700">Location</label>
                      <input type="text" id="location" name="location" placeholder="City, Country" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/50 focus:border-[#00b4d8] transition-all" />
                    </div>
                  </div>

                  {/* Row 3: Experience & LinkedIn */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="experience" className="text-xs font-bold text-slate-700">Experience <span className="text-red-500">*</span></label>
                      <select required defaultValue="" id="experience" name="experience" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/50 focus:border-[#00b4d8] transition-all appearance-none">
                        <option value="" disabled>Select experience</option>
                        <option value="fresher">Fresher (0-1 years)</option>
                        <option value="junior">Junior (1-3 years)</option>
                        <option value="mid">Mid-Level (3-5 years)</option>
                        <option value="senior">Senior (5+ years)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="linkedin" className="text-xs font-bold text-slate-700">LinkedIn Profile</label>
                      <input type="url" id="linkedin" name="linkedin" defaultValue="https://linkedin.com/in/" placeholder="https://linkedin.com/in/" className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/50 focus:border-[#00b4d8] transition-all" />
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">Resume (PDF, max 5MB) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input 
                        required 
                        type="file" 
                        id="resume" 
                        name="resume"
                        accept=".pdf" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed transition-all ${fileName ? 'border-[#00b4d8] bg-[#00b4d8]/5' : 'border-slate-300 bg-slate-50 group-hover:bg-slate-100'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${fileName ? 'bg-[#00b4d8] text-white' : 'bg-slate-200 text-slate-500'}`}>
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-xs">{fileName || 'Click to upload or drag and drop'}</span>
                          {!fileName && <span className="text-[10px] text-slate-500">PDF up to 5MB</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="coverLetter" className="text-xs font-bold text-slate-700">Cover Letter / Why do you want to join us?</label>
                    <textarea id="coverLetter" name="coverLetter" rows={4} placeholder="Tell us why you're a great fit..." className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/50 focus:border-[#00b4d8] transition-all resize-none"></textarea>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center px-6 py-2.5 bg-[#00b4d8] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#0096b8] hover:shadow-lg hover:shadow-[#00b4d8]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
