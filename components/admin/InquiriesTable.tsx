"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function InquiriesTable() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/inquiries')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setInquiries(data.data);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-slate-100/80 bg-white flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-[#0a1128] tracking-tight">Inquiries</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Manage contact form messages.</p>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-wider">
          Total: {inquiries.length}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-8 py-5">Sender Details</th>
              <th className="px-8 py-5">Contact Info</th>
              <th className="px-8 py-5">Company</th>
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inquiries.map((inq: any, idx: number) => (
              <React.Fragment key={inq._id}>
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${expandedRow === inq._id ? 'bg-blue-50/30' : ''}`}
                  onClick={() => setExpandedRow(expandedRow === inq._id ? null : inq._id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 flex items-center justify-center font-black text-xs shadow-inner uppercase">
                        {inq.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                          {inq.name}
                          {(new Date().getTime() - new Date(inq.createdAt).getTime()) < 86400000 && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-[#00b4d8] rounded-full text-[7px] font-black uppercase tracking-widest animate-pulse">New</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium text-xs">{inq.email}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{inq.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {inq.company ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-bold">
                        {inq.company}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium text-[11px]">{new Date(inq.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[9px] font-black uppercase tracking-widest text-[#00b4d8] hover:text-[#0077b6] transition-colors">
                      {expandedRow === inq._id ? 'Close' : 'View'}
                    </button>
                  </td>
                </motion.tr>
                {expandedRow === inq._id && (
                  <tr>
                    <td colSpan={5} className="px-8 py-8 bg-slate-50/30 border-t border-blue-100/30">
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white p-6 rounded-2xl border border-blue-100/50 shadow-sm"
                      >
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00b4d8] mb-3">Message Details</h4>
                        <p className="text-slate-700 leading-relaxed italic whitespace-pre-wrap">
                          "{inq.message}"
                        </p>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-slate-400 font-medium">
                  No inquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
