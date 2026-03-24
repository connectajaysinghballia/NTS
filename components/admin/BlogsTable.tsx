"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, ExternalLink, Calendar, User } from 'lucide-react';

export default function BlogsTable({ refreshTrigger }: { refreshTrigger: number }) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = () => {
    setLoading(true);
    fetch('/api/admin/blogs')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBlogs(data.data);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
      }
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-slate-100/80 bg-white flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-[#0a1128] tracking-tight">Articles</h3>
          <p className="text-[10px] text-slate-500 mt-1">Manage published blog posts.</p>
        </div>
        <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-wider">
          Total: {blogs.length}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-6 py-4">Article</th>
              <th className="px-6 py-4">Metadata</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence>
              {blogs.map((blog, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  key={blog._id} 
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      {blog.image && (
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-100 shadow-sm shrink-0">
                          <img src={blog.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 max-w-[300px] truncate">{blog.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1 uppercase tracking-wider">
                          <ExternalLink className="w-3 h-3" /> /{blog.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {blog.author}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-emerald-100">
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {blogs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-slate-400 font-medium">
                  No blogs found. Start by creating one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
