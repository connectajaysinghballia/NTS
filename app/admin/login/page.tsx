"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, User, ArrowRight, Loader2, LayoutDashboard, Clock, LogOut, Cpu, Command, MessageSquare, Briefcase, FileText, Target, Users, Receipt, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import InquiriesTable from '@/components/admin/InquiriesTable';
import CareersTable from '@/components/admin/CareersTable';
import BlogForm from '@/components/admin/BlogForm';
import BlogsTable from '@/components/admin/BlogsTable';
import OpportunitiesTable from '@/components/admin/OpportunitiesTable';
import EmployeesTable from '@/components/admin/EmployeesTable';
import SalarySlipGenerator from '@/components/admin/SalarySlipGenerator';
import ExperienceLetter from '@/components/admin/ExperienceLetter';
import AdminCharts from '@/components/admin/AdminCharts';

export default function UnifiedAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [counts, setCounts] = useState({ inquiries: 0, careers: 0, blogs: 0, opportunities: 0, employees: 0, slips: 0 });
  const [financials, setFinancials] = useState({ totalSalaryPaid: 0, totalProjectValuation: 0, totalProjectsDone: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [slips, setSlips] = useState<any[]>([]);
  const [refreshBlogs, setRefreshBlogs] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Strictly enforcing manual login: Clearing session on page load
    localStorage.removeItem('isAdminAuthenticated');
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        fetch('/api/admin/inquiries').then(res => res.json()),
        fetch('/api/admin/careers').then(res => res.json()),
        fetch('/api/admin/blogs').then(res => res.json()),
        fetch('/api/admin/opportunities').then(res => res.json()),
        fetch('/api/admin/employees').then(res => res.json()),
        fetch('/api/admin/salary').then(res => res.json())
      ]).then(([inqData, carData, blogData, oppData, empData, slipData]) => {
        const inquiries = inqData.success ? inqData.data : [];
        const careers = carData.success ? carData.data : [];
        const blogs = blogData.success ? blogData.data : [];
        const opportunities = oppData.success ? oppData.data : [];
        const employees = empData.success ? empData.data : [];
        const slips = slipData.success ? slipData.data : [];

        setOpportunities(opportunities);
        setSlips(slips);

        setCounts({
          inquiries: inquiries.length,
          careers: careers.length,
          blogs: blogs.length,
          opportunities: opportunities.length,
          employees: employees.length,
          slips: slips.length
        });

        // Compute financial summary
        const totalSalaryPaid = slips.reduce((sum: number, s: any) => sum + (s.netSalary || 0), 0);
        const totalProjectValuation = opportunities.reduce((sum: number, o: any) => {
          const raw = String(o.projectValuation || '0').replace(/[^0-9.]/g, '');
          return sum + (parseFloat(raw) || 0);
        }, 0);
        const totalProjectsDone = opportunities.filter((o: any) => o.status === 'Closed-Won').length;
        setFinancials({ totalSalaryPaid, totalProjectValuation, totalProjectsDone });

        // Combine and sort recent activity
        const combined = [
          ...inquiries.slice(0, 3).map((v: any) => ({ ...v, type: 'inquiry', label: 'New Inquiry' })),
          ...careers.slice(0, 3).map((v: any) => ({ ...v, type: 'career', label: 'New Application' })),
          ...blogs.slice(0, 3).map((v: any) => ({ ...v, type: 'blog', label: 'New Article' })),
          ...opportunities.slice(0, 3).map((v: any) => ({ ...v, type: 'opportunity', label: 'New Deal' })),
          ...employees.slice(0, 3).map((v: any) => ({ ...v, type: 'employee', label: 'New Staff Registration' })),
          ...slips.slice(0, 3).map((v: any) => ({ ...v, type: 'slip', label: 'New Salary Slip Generated' }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setRecentActivity(combined.slice(0, 5));
      });
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('isAdminAuthenticated', 'true');
        setIsAuthenticated(true);
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    setFormData({ username: '', password: '' });
  };

  return (
    <div className="min-h-screen bg-[#fafcff] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative"
          >
            {/* 🌌 Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: '2s' }} />
              
              {/* Floating Decorative Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4 + i, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.5 
                  }}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full"
                  style={{ 
                    top: `${15 + i * 15}%`, 
                    left: `${10 + (i * 17) % 80}%` 
                  }}
                />
              ))}
              
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
              <div className="text-center mb-12">
                <motion.div 
                   animate={{ 
                     boxShadow: ["0 0 20px rgba(59, 130, 246, 0.2)", "0 0 40px rgba(59, 130, 246, 0.4)", "0 0 20px rgba(59, 130, 246, 0.2)"] 
                   }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#00b4d8] to-[#0077b6] shadow-2xl mb-8 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Shield className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-500 relative z-10" />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl font-black text-white tracking-tight mb-3 uppercase italic"
                >
                  Admin <span className="text-[#00b4d8]">Hub</span>
                </motion.h1>
                <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">NOVALYTIX SECURITY GATEWAY</p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/[0.03] backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group"
              >
                {/* Subtle Glass Noise Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00b4d8] ml-2">Access Identity</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-[#00b4d8]" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="NTS Admin ID"
                        className="block w-full pl-16 pr-8 py-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem] text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-[#00b4d8]/10 focus:border-[#00b4d8]/50 focus:bg-white/[0.08] transition-all duration-300 font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00b4d8] ml-2">Security Key</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-[#00b4d8]" />
                      </div>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="block w-full pl-16 pr-8 py-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem] text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-[#00b4d8]/10 focus:border-[#00b4d8]/50 focus:bg-white/[0.08] transition-all duration-300 font-bold"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-center gap-3 text-red-500"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-tight">{error}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-6 text-white font-black uppercase tracking-[0.25em] rounded-[1.5rem] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.97] relative overflow-hidden group ${isLoading ? 'bg-slate-800 cursor-not-allowed' : 'bg-[#00b4d8] hover:bg-[#0096c7]'}`}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    {isLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin relative z-10" />
                    ) : (
                      <>
                        <span className="relative z-10">Initiate Access</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
              
              <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
                <Cpu className="w-5 h-5 text-slate-500 hover:text-blue-400 transition-colors animate-float" />
                <Command className="w-5 h-5 text-slate-500 hover:text-blue-400 transition-colors animate-float" style={{ animationDelay: '1s' }} />
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen bg-slate-50 text-slate-800 flex"
          >
            {/* Dark Premium Sidebar - Compacted & Fixed */}
            <aside className="w-64 bg-[#020617] border-r border-white/5 flex flex-col h-screen sticky top-0 z-20 shadow-[10px_0_40px_-10px_rgba(0,0,0,0.3)] shrink-0">
              {/* Subtle mesh background for sidebar */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
              
              <div className="p-6 flex items-center gap-3 relative z-10 shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00b4d8] to-[#0077b6] rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,180,216,0.25)]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-white tracking-tight uppercase italic">Admin<span className="text-[#00b4d8]">Hub</span></h1>
                  <p className="text-[8px] font-black tracking-[0.25em] uppercase text-slate-500 mt-1 pb-0">Gateway 01</p>
                </div>
              </div>
              
              {/* Main Navigation - Adjusted Spacing */}
              <nav className="flex-1 px-3 pt-6 pb-6 flex flex-col gap-2 relative z-10 overflow-y-auto custom-scrollbar">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,180,216,0.1)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  {activeTab === 'dashboard' && (
                    <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-[#00b4d8] rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                  )}
                  <LayoutDashboard className={`w-4 h-4 transform group-hover:scale-110 transition-transform ${activeTab === 'dashboard' ? 'text-[#00b4d8]' : ''}`} />
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('inquiries')}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'inquiries' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,180,216,0.1)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  {activeTab === 'inquiries' && (
                    <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-[#00b4d8] rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                  )}
                  <MessageSquare className={`w-4 h-4 transform group-hover:scale-110 transition-transform ${activeTab === 'inquiries' ? 'text-[#00b4d8]' : ''}`} />
                  Inquiries
                </button>
                <button 
                  onClick={() => setActiveTab('careers')}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'careers' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,180,216,0.1)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  {activeTab === 'careers' && (
                    <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-[#00b4d8] rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                  )}
                  <Briefcase className={`w-4 h-4 transform group-hover:scale-110 transition-transform ${activeTab === 'careers' ? 'text-[#00b4d8]' : ''}`} />
                  Applications
                </button>
                <button 
                  onClick={() => setActiveTab('blogs')}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'blogs' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,180,216,0.1)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  {activeTab === 'blogs' && (
                    <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-[#00b4d8] rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                  )}
                  <FileText className={`w-4 h-4 transform group-hover:scale-110 transition-transform ${activeTab === 'blogs' ? 'text-[#00b4d8]' : ''}`} />
                  Blogs
                </button>
                <button 
                  onClick={() => setActiveTab('opportunities')}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'opportunities' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,180,216,0.1)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  {activeTab === 'opportunities' && (
                    <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-[#00b4d8] rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                  )}
                  <Target className={`w-4 h-4 transform group-hover:scale-110 transition-transform ${activeTab === 'opportunities' ? 'text-[#00b4d8]' : ''}`} />
                  Opportunities
                </button>
                <button 
                  onClick={() => setActiveTab('employees')}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'employees' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,180,216,0.1)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  {activeTab === 'employees' && (
                    <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-[#00b4d8] rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                  )}
                  <Users className={`w-4 h-4 transform group-hover:scale-110 transition-transform ${activeTab === 'employees' ? 'text-[#00b4d8]' : ''}`} />
                  Employees
                </button>
                <button 
                  onClick={() => setActiveTab('slips')}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'slips' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,180,216,0.1)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  {activeTab === 'slips' && (
                    <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-[#00b4d8] rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                  )}
                  <Receipt className={`w-4 h-4 transform group-hover:scale-110 transition-transform ${activeTab === 'slips' ? 'text-[#00b4d8]' : ''}`} />
                  Salary Slips
                </button>
                <button 
                  onClick={() => setActiveTab('experience')}
                  className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'experience' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,180,216,0.1)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                >
                  {activeTab === 'experience' && (
                    <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-[#00b4d8] rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                  )}
                  <Award className={`w-4 h-4 transform group-hover:scale-110 transition-transform ${activeTab === 'experience' ? 'text-[#00b4d8]' : ''}`} />
                  Experience Letter
                </button>
              </nav>

              <div className="p-4 relative z-10">
                <div className="bg-white/5 rounded-xl p-4 mb-3 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#00b4d8]">Verified</p>
                      <p className="text-xs font-bold text-white">{formData.username || 'Admin'}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 px-3 py-3 bg-transparent hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Terminate Session
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
              {/* Subtle background gradient pattern */}
              <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-50 rounded-full blur-[120px]"></div>
              </div>

              <header className="bg-white/60 backdrop-blur-xl border-b border-white px-8 py-6 flex items-center justify-between relative z-10 shrink-0 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                <div>
                  <h2 className="text-2xl font-black text-[#0a1128] tracking-tight">
                    {activeTab === 'dashboard' && 'Command Center'}
                    {activeTab === 'inquiries' && 'Contact Inquiries'}
                    {activeTab === 'careers' && 'Job Applications'}
                    {activeTab === 'blogs' && 'Blog Management'}
                    {activeTab === 'opportunities' && 'Opportunities Pipeline'}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] inline-block"></span>
                    System Operational 
                  </p>
                </div>
                <div className="flex bg-white shadow-sm border border-slate-100 p-1.5 rounded-xl items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                     <Clock className="w-4 h-4" />
                   </div>
                   <div className="pr-3 text-[10px] font-bold text-slate-600">
                     {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                   </div>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto px-8 pb-12 pt-8 relative z-10">
                {activeTab === 'dashboard' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-5xl mx-auto flex flex-col pt-8 pb-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                      {/* ── Financial Summary Banner ── */}
                      <div className="col-span-1 md:col-span-2 relative bg-[#0a1128] rounded-[2rem] overflow-hidden p-8 shadow-2xl shadow-slate-900/20">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6bTAtNnY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
                        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-[60px]"></div>
                        <div className="relative z-10">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-6">Business Intelligence Overview</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Total Salary Paid */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Salary Paid</p>
                              <p className="text-2xl font-black text-white">
                                ₹{financials.totalSalaryPaid.toLocaleString('en-IN')}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">{counts.slips} slip{counts.slips !== 1 ? 's' : ''} generated</p>
                            </div>
                            {/* Total Project Valuation */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Project Valuation</p>
                              <p className="text-2xl font-black text-cyan-400">
                                ₹{financials.totalProjectValuation.toLocaleString('en-IN')}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">{counts.opportunities} deal{counts.opportunities !== 1 ? 's' : ''} in pipeline</p>
                            </div>
                            {/* Projects Done */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Projects Completed</p>
                              <p className="text-2xl font-black text-emerald-400">
                                {financials.totalProjectsDone}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">Closed-Won opportunities</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('inquiries')}
                        className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-[40px] group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <h3 className="text-xl font-black text-[#0a1128] mb-2 relative z-10">Contact Inquiries</h3>
                        <p className="text-xs text-slate-500 font-medium relative z-10 mb-4 leading-relaxed max-w-[200px]">Manage contact form submissions.</p>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                          <div className="px-3 py-1.5 bg-blue-50 text-[#00b4d8] rounded-full text-[10px] font-black italic">
                            {counts.inquiries} Total
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 text-[#00b4d8] font-black uppercase tracking-widest text-[10px] relative z-10 group-hover:gap-3 transition-all">
                          Open <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {/* Careers Card */}
                      <button 
                        onClick={() => setActiveTab('careers')}
                        className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-slate-100 overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full blur-[40px] group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <h3 className="text-xl font-black text-[#0a1128] mb-2 relative z-10">Job Applications</h3>
                        <p className="text-xs text-slate-500 font-medium relative z-10 mb-4 leading-relaxed max-w-[200px]">Review candidate applications.</p>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black italic">
                            {counts.careers} Applicants
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-[10px] relative z-10 group-hover:gap-3 transition-all">
                          Open <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {/* Opportunities Card */}
                      <button 
                        onClick={() => setActiveTab('opportunities')}
                        className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-amber-900/5 border border-slate-100 overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/10 col-span-1 md:col-span-2"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full blur-[40px] group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <h3 className="text-xl font-black text-[#0a1128] mb-2 relative z-10">Sales Pipeline</h3>
                        <p className="text-xs text-slate-500 font-medium relative z-10 mb-4 leading-relaxed max-w-[400px]">Track and manage prospective clients, values, and deal statuses seamlessly aligned with incoming leads.</p>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                          <div className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black italic">
                            {counts.opportunities} Deals
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 text-amber-600 font-black uppercase tracking-widest text-[10px] relative z-10 group-hover:gap-3 transition-all">
                          Manage Deals <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {/* Blogs Card */}
                      <button 
                        onClick={() => setActiveTab('blogs')}
                        className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-cyan-900/5 border border-slate-100 overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-900/10"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-full blur-[40px] group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <h3 className="text-xl font-black text-[#0a1128] mb-2 relative z-10">Blog Management</h3>
                        <p className="text-xs text-slate-500 font-medium relative z-10 mb-4 leading-relaxed max-w-[200px]">Publish news and insights.</p>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                          <div className="px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black italic">
                            {counts.blogs} Articles
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 text-cyan-600 font-black uppercase tracking-widest text-[10px] relative z-10 group-hover:gap-3 transition-all">
                          Open <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {/* Employees Card */}
                      <button 
                        onClick={() => setActiveTab('employees')}
                        className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-slate-100 overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/10"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-[40px] group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <h3 className="text-xl font-black text-[#0a1128] mb-2 relative z-10">Personnel Directory</h3>
                        <p className="text-xs text-slate-500 font-medium relative z-10 mb-4 leading-relaxed max-w-[200px]">Manage corporate staff records.</p>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                          <div className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black italic">
                            {counts.employees} Registered
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-[10px] relative z-10 group-hover:gap-3 transition-all">
                          Open <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {/* Salary Slips Card */}
                      <button 
                        onClick={() => setActiveTab('slips')}
                        className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-teal-900/5 border border-slate-100 overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-900/10 col-span-1 md:col-span-2"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full blur-[40px] group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <h3 className="text-xl font-black text-[#0a1128] mb-2 relative z-10">Payroll & Slips</h3>
                        <p className="text-xs text-slate-500 font-medium relative z-10 mb-4 leading-relaxed max-w-[400px]">Generate legally verifiable monthly salary PDFs and automatically track the firm's payroll history in the database.</p>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                          <div className="px-3 py-1.5 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black italic">
                            {counts.slips} Slips Generated
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 text-teal-600 font-black uppercase tracking-widest text-[10px] relative z-10 group-hover:gap-3 transition-all">
                          Manage Payroll <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {/* Experience Letter Card */}
                      <button 
                        onClick={() => setActiveTab('experience')}
                        className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-violet-900/5 border border-slate-100 overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/10"
                      >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-violet-50 to-purple-50 rounded-full blur-[40px] group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <h3 className="text-xl font-black text-[#0a1128] mb-2 relative z-10">Credentials & Letters</h3>
                        <p className="text-xs text-slate-500 font-medium relative z-10 mb-4 leading-relaxed max-w-[200px]">Issue formal experience certificates.</p>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                          <div className="px-3 py-1.5 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black italic">
                            Official Document
                          </div>
                        </div>
                        
                        <div className="inline-flex items-center gap-2 text-violet-600 font-black uppercase tracking-widest text-[10px] relative z-10 group-hover:gap-3 transition-all">
                          Generate <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    </div>

                    {/* Analytics Section */}
                    <AdminCharts 
                      opportunities={opportunities} 
                      slips={slips} 
                      counts={counts} 
                    />


                    {/* Recent Activity Section */}
                    <div className="mt-16 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-black text-[#0a1128] tracking-tight uppercase italic flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#00b4d8]" />
                          System Timeline
                        </h4>
                      </div>
                      
                      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 divide-y divide-slate-50">
                        {recentActivity.map((activity, idx) => (
                          <div key={idx} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                            <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                                activity.type === 'inquiry' ? 'bg-blue-50 border-blue-100 text-[#00b4d8]' :
                                activity.type === 'career' ? 'bg-emerald-50 border-emerald-100 text-emerald-500' :
                                activity.type === 'opportunity' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                activity.type === 'employee' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                                activity.type === 'slip' ? 'bg-teal-50 border-teal-100 text-teal-600' :
                                'bg-cyan-50 border-cyan-100 text-cyan-600'
                              }`}>
                                {activity.type === 'inquiry' ? <MessageSquare className="w-5 h-5" /> :
                                 activity.type === 'career' ? <Briefcase className="w-5 h-5" /> :
                                 activity.type === 'opportunity' ? <Target className="w-5 h-5" /> :
                                 activity.type === 'employee' ? <Users className="w-5 h-5" /> :
                                 activity.type === 'slip' ? <Receipt className="w-5 h-5" /> :
                                 <FileText className="w-5 h-5" />}
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">
                                  {activity.label}
                                </p>
                                <p className="font-bold text-slate-900 truncate max-w-sm">
                                  {activity.name || activity.title || activity.projectName || activity.employeeName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-8">
                               <span className="text-xs font-bold text-slate-400">
                                 {new Date(activity.createdAt).toLocaleDateString()}
                               </span>
                               <button 
                                 onClick={() => setActiveTab(activity.type === 'career' ? 'careers' : activity.type + 's')}
                                 className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-xl shadow-sm transition-all"
                               >
                                 <ArrowRight className="w-5 h-5 text-slate-400 hover:text-[#00b4d8]" />
                               </button>
                            </div>
                          </div>
                        ))}
                        {recentActivity.length === 0 && (
                          <div className="p-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Secure line established. Awaiting data packets...
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === 'inquiries' && <InquiriesTable />}
                {activeTab === 'careers' && <CareersTable />}
                {activeTab === 'opportunities' && <OpportunitiesTable />}
                {activeTab === 'employees' && <EmployeesTable />}
                {activeTab === 'slips' && <SalarySlipGenerator />}
                {activeTab === 'experience' && <ExperienceLetter />}
                {activeTab === 'blogs' && (
                  <div className="space-y-12 pb-20 pt-8">
                    <BlogForm onSuccess={() => setRefreshBlogs(prev => prev + 1)} />
                    <BlogsTable refreshTrigger={refreshBlogs} />
                  </div>
                )}
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
