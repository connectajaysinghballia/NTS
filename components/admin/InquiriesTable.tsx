"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, Mail, Phone, Building2, Clock, Calendar, MessageSquare, ChevronDown, User } from 'lucide-react';

export default function InquiriesTable() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-[#0a1128]/20 overflow-hidden"
    >
      <div className="px-8 py-6 border-b border-[#0a1128]/10 bg-white flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-[#0a1128] tracking-tight flex items-center gap-2">
            Contact Inquiries
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Client Message Stream</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-[#00b4d8] rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border border-blue-100 shadow-sm">
          Total: {inquiries.length} Messages
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-[0.15em] text-[10px]">
            <tr>
              <th className="px-8 py-5">Origin / Client</th>
              <th className="px-8 py-5">Communication</th>
              <th className="px-8 py-5">Subject / Preview</th>
              <th className="px-8 py-5">Timestamp</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inquiries.map((inquiry: any, idx: number) => (
              <React.Fragment key={inquiry._id}>
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`hover:bg-slate-50/80 transition-all group cursor-pointer ${expandedRow === inquiry._id ? 'bg-blue-50/40' : ''}`}
                  onClick={() => setExpandedRow(expandedRow === inquiry._id ? null : inquiry._id)}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#0a1128] text-white flex items-center justify-center font-black text-xs shadow-lg uppercase group-hover:scale-105 transition-transform">
                        {inquiry.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                          {inquiry.name}
                          {(new Date().getTime() - new Date(inquiry.createdAt).getTime()) < 86400000 && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[8px] font-black uppercase tracking-[0.1em] animate-pulse">Live</span>
                          )}
                        </div>
                        {inquiry.company && (
                          <div className="text-[10px] text-slate-400 mt-1 font-bold flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {inquiry.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-600 font-bold">
                        <Mail className="w-3.5 h-3.5 text-[#00b4d8]" />
                        {inquiry.email}
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
                          <Phone className="w-3.5 h-3.5 text-slate-300" />
                          {inquiry.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="max-w-[180px]">
                      <div className="text-slate-900 font-bold truncate">
                        {inquiry.message.slice(0, 40)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-900 font-black text-[10px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(inquiry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold tracking-widest uppercase ml-5">
                        {new Date(inquiry.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={(e) => handleDelete(e, inquiry._id)}
                        disabled={deleteLoading === inquiry._id}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        {deleteLoading === inquiry._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <button className={`p-2 rounded-xl transition-all ${expandedRow === inquiry._id ? 'bg-[#00b4d8] text-white' : 'text-slate-400 hover:text-[#00b4d8] hover:bg-blue-50'}`}>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expandedRow === inquiry._id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
                <AnimatePresence>
                  {expandedRow === inquiry._id && (
                    <tr>
                      <td colSpan={5} className="p-0 border-none bg-blue-50/20">
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-12 py-10">
                            <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-8 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-5">
                                <MessageSquare className="w-24 h-24" />
                              </div>
                              <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="w-2 h-6 bg-[#00b4d8] rounded-full"></div>
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00b4d8]">Client Transmission</h4>
                                </div>
                                <div className="bg-slate-50/50 rounded-3xl p-8 border border-white">
                                  <p className="text-slate-700 text-sm leading-[1.8] font-medium whitespace-pre-wrap">
                                    {inquiry.message}
                                  </p>
                                </div>
                                <div className="mt-8 flex items-center gap-6">
                                  <a 
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${inquiry.email}&su=${encodeURIComponent("Regarding your inquiry - NTS")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-[#0a1128] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/30 hover:-translate-y-1 transition-all flex items-center gap-2"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    Draft Response
                                  </a>
                                  <div className="h-4 w-px bg-slate-200"></div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                      Registered Port 80
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-slate-200" />
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No inquiries found in stream</p>
                      <p className="text-[10px] text-slate-300 mt-1 lowercase font-medium">Wait for incoming client data</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
