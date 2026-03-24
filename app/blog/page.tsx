"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Calendar, User, ArrowRight, Shield, Cpu, Share2, Clock } from 'lucide-react';

// Static blog posts removed, fetching from DB instead

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBlogPosts(data.data);
        }
        setLoading(false);
      });
  }, []);

  // Helper to map categories to colors
  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security': 
      case 'cyber security':
      case 'security audit':
        return { accent: "text-[#00b4d8]", bgAccent: "bg-[#00b4d8]/10", icon: <Shield className="size-5" /> };
      case 'ai solution':
      case 'ai solutions':
      case 'technology':
        return { accent: "text-violet-500", bgAccent: "bg-violet-500/10", icon: <Cpu className="size-5" /> };
      case 'enterprise':
        return { accent: "text-blue-600", bgAccent: "bg-blue-600/10", icon: <ArrowRight className="size-5" /> };
      default:
        return { accent: "text-emerald-500", bgAccent: "bg-emerald-500/10", icon: <Share2 className="size-5" /> };
    }
  };
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#00b4d8]/10 selection:text-[#00b4d8]">
      <Navbar />

      {/* Cinematic Hero */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 overflow-hidden bg-[#020617]">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(#00b4d8_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00b4d8]/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="text-[#00b4d8] font-black uppercase tracking-[0.4em] text-xs lg:text-sm mb-6">
              Our Blog
            </h4>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter leading-[1.1] text-white">
              Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b4d8] via-[#90e0ef] to-white">Updates</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              Stay updated with the latest trends in technology, industry insights, and company news.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Listing Section */}
      <section className="py-24 px-6 bg-white relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-[500px] bg-slate-50 animate-pulse rounded-[3.5rem]" />
              ))
            ) : blogPosts.map((post, i) => {
              const styles = getCategoryStyles(post.category);
              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, scale: 0.95, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ amount: 0.2, once: false }}
                  transition={{ 
                    duration: 0.8, 
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 70,
                    damping: 15
                  }}
                  whileHover={{ y: -16, scale: 1.02 }}
                  className="group relative flex flex-col h-full bg-white rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_60px_100px_-25px_rgba(0,180,216,0.18)] border border-slate-100 transition-all duration-700"
                >
                  {/* Decorative Pattern Background */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(#00b4d8_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
                  </div>

                  {/* Image Section */}
                  {post.image && (
                    <div className="relative h-72 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    </div>
                  )}

                  <div className="p-10 lg:p-12 flex flex-col flex-1 relative z-10">
                    {/* Category & Icon */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className={`size-12 rounded-2xl ${styles.bgAccent} ${styles.accent} flex items-center justify-center shadow-sm`}>
                          {styles.icon}
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-[0.25em] ${styles.accent}`}>
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mb-6 leading-[1.1] group-hover:text-[#00b4d8] transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 text-sm lg:text-base font-medium leading-relaxed mb-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex flex-col gap-8">
                      <div className="flex items-center gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-10">
                        <div className="flex items-center gap-2.5">
                          <Calendar className="size-3.5 text-[#00b4d8]" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2.5">
                          <User className="size-3.5 text-slate-400" />
                          {post.author}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 hover:text-[#00b4d8] transition-colors duration-300 group/btn">
                          Read More
                          <ArrowRight className="size-3.5 transform group-hover/btn:translate-x-1.5 transition-transform" />
                        </button>
                        <Share2 className="size-4 text-slate-200 hover:text-[#00b4d8] cursor-pointer transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {!loading && blogPosts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No articles published yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
