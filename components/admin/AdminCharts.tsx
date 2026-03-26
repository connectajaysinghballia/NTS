"use client";
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';

interface AdminChartsProps {
  opportunities: any[];
  slips: any[];
  counts: any;
}

export default function AdminCharts({ opportunities, slips, counts }: AdminChartsProps) {
  
  // ── 1. Process Monthly Trend (Revenue vs Expense) ──
  const processMonthlyTrend = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const data: any[] = [];

    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        name: months[d.getMonth()],
        monthIdx: d.getMonth(),
        year: d.getFullYear(),
        revenue: 0,
        expense: 0
      });
    }

    // Add Revenue (Opportunities)
    opportunities.forEach(opp => {
      const date = new Date(opp.createdAt);
      const mIdx = date.getMonth();
      const y = date.getFullYear();
      const match = data.find(d => d.monthIdx === mIdx && d.year === y);
      if (match) {
        match.revenue += Number(opp.projectValuation) || 0;
      }
    });

    // Add Expense (Salary Slips)
    // Note: Slips have month as string and year as number
    const monthMap: any = { "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5, "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11 };
    slips.forEach(slip => {
      const mIdx = monthMap[slip.month];
      const y = Number(slip.year);
      const match = data.find(d => d.monthIdx === mIdx && d.year === y);
      if (match) {
        match.expense += Number(slip.netSalary) || 0;
      }
    });

    return data;
  };

  const trendData = processMonthlyTrend();

  // ── 2. Process Activity Distribution ──
  const activityData = [
    { name: 'Inquiries', value: counts.inquiries, color: '#00b4d8' },
    { name: 'Careers', value: counts.careers, color: '#10b981' },
    { name: 'Blogs', value: counts.blogs, color: '#f59e0b' },
    { name: 'Staff', value: counts.employees, color: '#6366f1' },
  ];

  const COLORS = ['#00b4d8', '#10b981', '#f59e0b', '#6366f1'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
      
      {/* ── Trend Analysis (Revenue vs Payroll) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h4 className="text-lg font-black text-[#0a1128] tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              Financial Velocity
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Revenue vs Payroll (Last 6 Months)</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Payroll</span>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00b4d8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#00b4d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}}
                tickFormatter={(value) => `₹${value > 999 ? (value/1000).toFixed(0) + 'k' : value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#00b4d8" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="expense" stroke="#e2e8f0" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Activity Distribution ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col"
      >
        <div className="mb-8">
          <h4 className="text-lg font-black text-[#0a1128] tracking-tight flex items-center gap-2">
            <PieChart as="PieIcon" className="w-5 h-5 text-indigo-500" />
            Module Weights
          </h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Data Asset Composition</p>
        </div>

        <div className="h-[240px] w-full relative flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-black text-[#0a1128]">{Object.values(counts).reduce((a:any, b:any) => a + b, 0)}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Items</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {activityData.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-[10px] font-bold text-slate-600 truncate">{item.name} ({item.value})</span>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
