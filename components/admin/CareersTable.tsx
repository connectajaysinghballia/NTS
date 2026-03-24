"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Download } from 'lucide-react';

export default function CareersTable() {
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/careers')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCareers(data.data);
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
          <h3 className="text-lg font-black text-[#0a1128] tracking-tight">Applications</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Review candidates from the careers page.</p>
        </div>
        <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-wider">
          Total: {careers.length}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-6 py-4">Candidate</th>
              <th className="px-6 py-4">Role & Details</th>
              <th className="px-6 py-4">Resume</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {careers.map((career: any, idx: number) => (
              <React.Fragment key={career._id}>
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${expandedRow === career._id ? 'bg-emerald-50/30' : ''}`}
                  onClick={() => setExpandedRow(expandedRow === career._id ? null : career._id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-md uppercase">
                        {career.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                          {career.fullName}
                          {(new Date().getTime() - new Date(career.createdAt).getTime()) < 86400000 && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded-full text-[7px] font-black uppercase tracking-widest animate-pulse">New</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{career.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-full text-[9px] font-black uppercase tracking-widest mb-1.5 shadow-sm border border-cyan-100">
                      {career.jobTitle}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <span>{career.experience}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {career.resumePath ? (
                      <a href={career.resumePath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 group/btn" onClick={(e) => e.stopPropagation()}>
                        <Download className="w-3 h-3 text-[#00b4d8] group-hover/btn:animate-bounce" /> 
                        Resume
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[10px] italic">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium text-[11px]">{new Date(career.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">
                      {expandedRow === career._id ? 'Less' : 'More'}
                    </button>
                  </td>
                </motion.tr>
                {expandedRow === career._id && (
                  <tr>
                    <td colSpan={5} className="px-8 py-8 bg-slate-50/30 border-t border-emerald-100/30">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="space-y-4">
                          <div className="bg-white p-6 rounded-2xl border border-emerald-100/50 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-3">Cover Letter</h4>
                            <p className="text-slate-700 leading-relaxed italic whitespace-pre-wrap">
                              "{career.coverLetter || 'No cover letter provided.'}"
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-white p-6 rounded-2xl border border-emerald-100/50 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">Additional Info</h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone Number</p>
                                <p className="text-sm font-bold text-slate-900">{career.phone || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Location</p>
                                <p className="text-sm font-bold text-slate-900">{career.location || 'N/A'}</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">LinkedIn Profile</p>
                                {career.linkedin ? (
                                  <a href={career.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                                    View Profile
                                  </a>
                                ) : (
                                  <p className="text-sm font-bold text-slate-400 italic">Not provided</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {careers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-slate-400 font-medium">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
