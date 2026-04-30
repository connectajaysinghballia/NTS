"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ArrowRight, Loader2, LayoutDashboard, Clock, LogOut, Shield, Cpu, Command, MessageSquare, Briefcase, FileText, Target, Users, Receipt, Award, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import InquiriesTable from '@/components/admin/InquiriesTable';
import CareersTable from '@/components/admin/CareersTable';
import BlogForm from '@/components/admin/BlogForm';
import BlogsTable from '@/components/admin/BlogsTable';
import OpportunitiesTable from '@/components/admin/OpportunitiesTable';
import EmployeesTable from '@/components/admin/EmployeesTable';
import SalarySlipGenerator from '@/components/admin/SalarySlipGenerator';
import ExperienceLetter from '@/components/admin/ExperienceLetter';
import InternshipOfferLetter from '@/components/admin/InternshipOfferLetter';
import AdminCharts from '@/components/admin/AdminCharts';

export default function UnifiedAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

        const totalSalaryPaid = slips.reduce((sum: number, s: any) => sum + (s.netSalary || 0), 0);
        const totalProjectValuation = opportunities.reduce((sum: number, o: any) => {
          const raw = String(o.projectValuation || '0').replace(/[^0-9.]/g, '');
          return sum + (parseFloat(raw) || 0);
        }, 0);
        const totalProjectsDone = opportunities.filter((o: any) => o.status === 'Closed-Won').length;
        setFinancials({ totalSalaryPaid, totalProjectValuation, totalProjectsDone });

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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'careers', label: 'Applications', icon: Briefcase },
    { id: 'blogs', label: 'Blogs', icon: FileText },
    { id: 'opportunities', label: 'Opportunities', icon: Target },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'slips', label: 'Salary Slips', icon: Receipt },
    { id: 'experience', label: 'Experience Letter', icon: Award },
    { id: 'internship', label: 'Offer Letter', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-[#fafcff] font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-screen bg-[#020617] flex items-center justify-center p-6"
          >
            <div className="w-full max-w-sm relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#00b4d8]/5 rounded-full blur-[100px] opacity-50" />

              <div className="text-center mb-10 relative z-10">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
                  Admin <span className="text-[#00b4d8]">Hub</span>
                </h1>
                <p className="text-[9px] font-black tracking-[0.3em] text-slate-500 uppercase mt-2">NOVALYTIX SECURITY GATEWAY</p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative z-10"
              >
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00b4d8] ml-1">Access Identity</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-500 group-focus-within:text-[#00b4d8] transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="NTS Admin ID"
                        className="block w-full pl-12 pr-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-[#00b4d8]/10 focus:border-[#00b4d8]/50 transition-all font-bold text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00b4d8] ml-1">Security Key</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-[#00b4d8] transition-colors" />
                      </div>
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••••••"
                        className="block w-full pl-12 pr-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-[#00b4d8]/10 focus:border-[#00b4d8]/50 transition-all font-bold text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-bold text-rose-500 text-center uppercase tracking-wider"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-800' : 'bg-[#00b4d8] hover:bg-[#0096c7] shadow-[#00b4d8]/20'}`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Initiate Access
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
              
              <p className="mt-8 text-center text-[9px] font-bold text-slate-600 uppercase tracking-widest relative z-10">
                Protected by Novalytix SecLayer v4.0
              </p>
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
            {/* Sidebar with Toggle Effect */}
            <motion.aside 
              initial={false}
              animate={{ 
                width: isSidebarOpen ? 256 : 80,
                x: 0
              }}
              className="bg-[#020617] border-r border-white/5 flex flex-col h-screen sticky top-0 z-20 shadow-[10px_0_40px_-10px_rgba(0,0,0,0.3)] shrink-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
              
              <div className={`p-6 flex items-center relative z-10 shrink-0 mb-4 ${isSidebarOpen ? 'gap-3' : 'justify-center ml-[-4px]'}`}>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.1)] shrink-0 overflow-hidden">
                  <Image 
                    src="/logi-Photoroom.png" 
                    alt="NTS Logo" 
                    width={40} 
                    height={40} 
                    className="object-contain"
                  />
                </div>
                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <h1 className="text-lg font-black text-white tracking-tight uppercase italic">Admin<span className="text-[#00b4d8]">Hub</span></h1>
                    <p className="text-[8px] font-black tracking-[0.25em] uppercase text-slate-500 mt-1 pb-0">Gateway 01</p>
                  </motion.div>
                )}
              </div>
              
              <nav className="flex-1 px-3 flex flex-col gap-2 relative z-10 overflow-y-auto custom-scrollbar no-scrollbar">
                {navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group relative flex items-center rounded-xl text-sm font-bold transition-all duration-300 ${isSidebarOpen ? 'px-4 py-3 gap-3' : 'p-4 justify-center'} ${activeTab === item.id ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(0,180,216,0.1)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
                    title={!isSidebarOpen ? item.label : ''}
                  >
                    {activeTab === item.id && (
                      <motion.div layoutId="nav-indicator" className="absolute left-0 w-1 h-5 bg-[#00b4d8] rounded-full shadow-[0_0_10px_rgba(0,180,216,0.5)]" />
                    )}
                    <item.icon className={`w-4 h-4 transform group-hover:scale-110 transition-transform shrink-0 ${activeTab === item.id ? 'text-[#00b4d8]' : ''}`} />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
              </nav>

              <div className="p-4 relative z-10 border-t border-white/5">
                <div className={`bg-white/5 rounded-xl p-3 mb-3 border border-white/10 overflow-hidden ${!isSidebarOpen && 'flex justify-center'}`}>
                  <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    {isSidebarOpen && (
                      <div className="overflow-hidden whitespace-nowrap">
                        <p className="text-[8px] font-black uppercase tracking-widest text-[#00b4d8]">Verified</p>
                        <p className="text-xs font-bold text-white truncate w-full">{formData.username || 'Admin'}</p>
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className={`flex items-center justify-center bg-transparent hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-rose-500/20 w-full ${isSidebarOpen ? 'px-3 py-3 gap-2' : 'p-3'}`}
                >
                  <LogOut className="w-4 h-4" />
                  {isSidebarOpen && 'Terminate Session'}
                </button>
              </div>
            </motion.aside>

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
              <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-50 rounded-full blur-[120px]"></div>
              </div>

              <header className="bg-white/60 backdrop-blur-xl border-b border-white px-8 py-6 flex items-center justify-between relative z-10 shrink-0 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#00b4d8] hover:border-[#00b4d8] transition-all"
                  >
                    {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>
                  <div>
                    <h2 className="text-2xl font-black text-[#0a1128] tracking-tight">
                      {activeTab === 'dashboard' && 'Command Center'}
                      {activeTab === 'inquiries' && 'Contact Inquiries'}
                      {activeTab === 'careers' && 'Job Applications'}
                      {activeTab === 'blogs' && 'Blog Management'}
                      {activeTab === 'opportunities' && 'Opportunities Pipeline'}
                      {activeTab === 'employees' && 'Employees Registry'}
                      {activeTab === 'slips' && 'Payroll Hub'}
                      {activeTab === 'experience' && 'Credentials Engine'}
                      {activeTab === 'internship' && 'Offer Generation'}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] inline-block"></span>
                       System Operational 
                    </p>
                  </div>
                </div>
                <div className="flex bg-white shadow-sm border border-slate-100 p-1.5 rounded-xl items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                     <Clock className="w-4 h-4" />
                   </div>
                   <div className="pr-3 text-[10px] font-bold text-slate-600 whitespace-nowrap">
                     {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                   </div>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto px-8 pb-12 pt-8 relative z-10 custom-scrollbar">
                {activeTab === 'dashboard' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-5xl mx-auto flex flex-col pt-8 pb-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="col-span-1 md:col-span-2 relative bg-[#0a1128] rounded-[2rem] overflow-hidden p-8 shadow-2xl shadow-slate-900/20">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6bTAtNnY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
                        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-[60px]"></div>
                        <div className="relative z-10">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-6">Business Intelligence Overview</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Salary Paid</p>
                              <p className="text-2xl font-black text-white">
                                ₹{financials.totalSalaryPaid.toLocaleString('en-IN')}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">{counts.slips} slip{counts.slips !== 1 ? 's' : ''} generated</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Project Valuation</p>
                              <p className="text-2xl font-black text-cyan-400">
                                ₹{financials.totalProjectValuation.toLocaleString('en-IN')}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">{counts.opportunities} deal{counts.opportunities !== 1 ? 's' : ''} in pipeline</p>
                            </div>
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
                        className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-[#0a1128]/20 overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10"
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

                      <button 
                        onClick={() => setActiveTab('careers')}
                        className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-[#0a1128]/20 overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10"
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
                    </div>

                    <AdminCharts 
                      opportunities={opportunities} 
                      slips={slips} 
                      counts={counts} 
                    />

                    <div className="mt-16 space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-black text-[#0a1128] tracking-tight uppercase italic flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#00b4d8]" />
                          System Timeline
                        </h4>
                      </div>
                      
                      <div className="bg-white rounded-[2.5rem] border border-[#0a1128]/20 shadow-xl shadow-slate-200/40 divide-y divide-slate-50">
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
                {activeTab === 'internship' && <InternshipOfferLetter />}
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
