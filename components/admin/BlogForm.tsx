"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send, Image as ImageIcon, Link as LinkIcon, Type, FileText } from 'lucide-react';

export default function BlogForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    image: '',
    status: 'Published'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Blog created successfully!');
        setFormData({
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          category: 'Technology',
          image: '',
          status: 'Published'
        });
        onSuccess();
      } else {
        setMessage(data.error || 'Failed to create blog');
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-6 md:p-8 mb-8"
    >
      <div className="mb-6">
        <h3 className="text-xl font-black text-[#0a1128] tracking-tight">Create Blog</h3>
        <p className="text-[10px] text-slate-500 mt-1">Publish a new article to the blog.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00b4d8] ml-2">Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Type className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="The Future of Cyber Defense"
                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00b4d8] ml-2">URL Slug (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LinkIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="future-of-cyber-defense"
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00b4d8] ml-2">Image URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00b4d8] ml-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="block w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-slate-900"
            >
              <option>Security</option>
              <option>AI Solution</option>
              <option>Technology</option>
              <option>Enterprise</option>
              <option>Security Audit</option>
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00b4d8] ml-2">Excerpt</label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <textarea
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief summary..."
              className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-sm text-slate-900 resize-none"
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00b4d8] ml-2">Content</label>
          <textarea
            required
            rows={8}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write content..."
            className="block w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all font-bold text-xs text-slate-700 leading-relaxed"
          />
        </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-3 rounded-lg text-xs font-bold text-center ${message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}
          >
            {message}
            {message.includes('success') && (
              <a href="/blog" target="_blank" className="block mt-1 text-[9px] underline underline-offset-2">View on Public Site</a>
            )}
          </motion.div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-3.5 bg-[#0a1128] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-slate-900/20 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ml-auto"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Publish Article
              <Send className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
