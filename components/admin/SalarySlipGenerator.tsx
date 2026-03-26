"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, FileText, Download, Mail, Users, History, Calculator, BadgeDollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SalarySlipGenerator() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [employees, setEmployees] = useState<any[]>([]);
  const [historySlips, setHistorySlips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [year, setYear] = useState(new Date().getFullYear());
  const [basicSalary, setBasicSalary] = useState<number | ''>('');
  const [hra, setHra] = useState<number | ''>('');
  const [allowances, setAllowances] = useState<number | ''>('');
  const [bonus, setBonus] = useState<number | ''>(0);
  const [deductions, setDeductions] = useState<number | ''>('');

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  useEffect(() => {
    fetchEmployees();
    fetchHistory();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch('/api/admin/employees');
    const data = await res.json();
    if (data.success) setEmployees(data.data);
    setLoading(false);
  };

  const fetchHistory = async () => {
    const res = await fetch('/api/admin/salary');
    const data = await res.json();
    if (data.success) setHistorySlips(data.data);
  };

  // Calculations
  const calcGross = () => (Number(basicSalary) || 0) + (Number(hra) || 0) + (Number(allowances) || 0) + (Number(bonus) || 0);
  const calcNet = () => calcGross() - (Number(deductions) || 0);

  const handleGeneratePDF = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedEmpId || basicSalary === '' || hra === '' || allowances === '' || deductions === '') {
      alert("Please fill in all mandatory fields before generating.");
      return;
    }

    setIsGenerating(true);
    const emp = employees.find(e => e._id === selectedEmpId);
    if (!emp) return setIsGenerating(false);

    const gross = calcGross();
    const net = calcNet();

    try {
      // 1. Generate PDF
      const doc = new jsPDF();
      
      // Header: Company Details
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(10, 17, 40); // Hex #0a1128 basically
      doc.text("NOVALYTIX SECURITY", 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Official Salary Statement", 105, 27, { align: "center" });
      doc.text("Generated: " + new Date().toLocaleDateString(), 105, 32, { align: "center" });
      
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 38, 196, 38);

      // Employee Details block
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Salary Slip for " + month + " " + year, 14, 48);
      
      autoTable(doc, {
        startY: 52,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        body: [
          [{ content: 'Employee Name:', styles: { fontStyle: 'bold' } }, emp.employeeName, { content: 'Employee ID:', styles: { fontStyle: 'bold' } }, emp.employeeId],
          [{ content: 'Designation:', styles: { fontStyle: 'bold' } }, emp.employeePost, { content: 'Joined Date:', styles: { fontStyle: 'bold' } }, new Date(emp.dateOfJoining).toLocaleDateString()],
          [{ content: 'Email:', styles: { fontStyle: 'bold' } }, emp.employeeEmail, { content: 'Phone:', styles: { fontStyle: 'bold' } }, emp.employeePhoneNumber],
        ]
      });

      // Salary Breakdown Table
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "bold");
      doc.text("Earnings & Deductions", 14, finalY);

      autoTable(doc, {
        startY: finalY + 5,
        theme: 'grid',
        headStyles: { fillColor: [0, 180, 216], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10, halign: 'right' },
        columnStyles: { 0: { halign: 'left' }, 2: { halign: 'left' } },
        head: [['Earnings', 'Amount (Rs)', 'Deductions', 'Amount (Rs)']],
        body: [
          ['Basic Salary', (Number(basicSalary) || 0).toLocaleString(), 'Provident Fund / Tax', (Number(deductions) || 0).toLocaleString()],
          ['House Rent Allowance (HRA)', (Number(hra) || 0).toLocaleString(), '', ''],
          ['Special Allowances', (Number(allowances) || 0).toLocaleString(), '', ''],
          ['Bonus / Incentives', (Number(bonus) || 0).toLocaleString(), '', ''],
          [{ content: 'Gross Earnings', styles: { fontStyle: 'bold' } }, { content: gross.toLocaleString(), styles: { fontStyle: 'bold' } }, { content: 'Total Deductions', styles: { fontStyle: 'bold' } }, { content: (Number(deductions) || 0).toLocaleString(), styles: { fontStyle: 'bold' } }]
        ]
      });

      // Net Salary Block
      const tableBottomY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFillColor(245, 247, 250);
      doc.rect(14, tableBottomY, 182, 20, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Net Salary Payable:", 20, tableBottomY + 13);
      doc.setTextColor(0, 180, 216); // Nice cyan color
      doc.text("Rs. " + net.toLocaleString(), 140, tableBottomY + 13);
      doc.setTextColor(0, 0, 0);

      // Footer
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text("This is an electronically generated document. No signature is required.", 105, 280, { align: "center" });

      // Save PDF to user machine
      const fileName = `Salary_Slip_${emp.employeeName.replace(/\s+/g, '_')}_${month}_${year}.pdf`;
      doc.save(fileName);

      // 2. Save Record to Database (History)
      const payload = {
        employeeId: emp._id,
        employeeName: emp.employeeName,
        employeePost: emp.employeePost,
        month,
        year,
        basicSalary: Number(basicSalary),
        hra: Number(hra),
        allowances: Number(allowances),
        bonus: Number(bonus),
        deductions: Number(deductions),
        grossSalary: gross,
        netSalary: net
      };

      await fetch('/api/admin/salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Refresh history list
      fetchHistory();
      alert("PDF Generated and Saved to History successfully!");

      // Clear Form Option (Optional, or just leave it for sequential generation)
      setSelectedEmpId('');
      setBasicSalary(''); setHra(''); setAllowances(''); setBonus(0); setDeductions('');

    } catch (err) {
      console.error(err);
      alert("An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;

  return (
    <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative min-h-[70vh]">
      {/* Header & Tabs */}
      <div className="px-8 py-6 border-b border-slate-100/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-[#0a1128] tracking-tight flex items-center gap-3">
            <Calculator className="w-6 h-6 text-cyan-500" />
            Payroll & Slips
          </h3>
          <p className="text-xs text-slate-500 mt-1 ml-9">Generate mathematically verifable PDFs manually.</p>
        </div>
        <div className="flex bg-white/50 p-1.5 rounded-2xl shadow-sm border border-slate-200 backdrop-blur-sm self-start">
          <button 
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'generate' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-500 hover:text-cyan-600 hover:bg-slate-50'}`}
          >
            Create New Slip
          </button>
          <button 
             onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-500 hover:text-cyan-600 hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-2">
              <History className="w-3.5 h-3.5" /> History
            </div>
          </button>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'generate' && (
          <motion.form 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleGeneratePDF}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Inputs */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Select Employee *</label>
                  <select 
                    required
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all font-medium text-slate-700"
                  >
                    <option value="">-- Choose Employee --</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.employeeName} ({emp.employeeId} - {emp.employeePost})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Month *</label>
                    <select 
                      value={month} onChange={(e) => setMonth(e.target.value)}
                      className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition-all font-medium"
                    >
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Year *</label>
                    <select 
                      value={year} onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none transition-all font-medium"
                    >
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#0a1128] mb-4 flex items-center gap-2">
                    <BadgeDollarSign className="w-4 h-4 text-cyan-500" /> Earnings (Rs)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 ml-1">Basic Salary *</label>
                      <input type="number" required min="0" value={basicSalary} onChange={(e) => setBasicSalary(e.target.value === '' ? '' : Number(e.target.value))} className="w-full mt-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-all shadow-sm" placeholder="20000" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 ml-1">HRA *</label>
                      <input type="number" required min="0" value={hra} onChange={(e) => setHra(e.target.value === '' ? '' : Number(e.target.value))} className="w-full mt-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-all shadow-sm" placeholder="8000" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 ml-1">Allowances *</label>
                      <input type="number" required min="0" value={allowances} onChange={(e) => setAllowances(e.target.value === '' ? '' : Number(e.target.value))} className="w-full mt-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-all shadow-sm" placeholder="5000" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 ml-1">Bonus</label>
                      <input type="number" min="0" value={bonus} onChange={(e) => setBonus(e.target.value === '' ? '' : Number(e.target.value))} className="w-full mt-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm transition-all shadow-sm" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-rose-900 mb-4 flex items-center gap-2">
                    Deductions (Rs)
                  </h4>
                  <div>
                    <label className="text-[10px] font-bold text-rose-800 ml-1">PF / Tax Deductions *</label>
                    <input type="number" required min="0" value={deductions} onChange={(e) => setDeductions(e.target.value === '' ? '' : Number(e.target.value))} className="w-full mt-1.5 px-4 py-2.5 bg-white border border-rose-200 rounded-lg text-sm transition-all shadow-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-400" placeholder="1500" />
                  </div>
                </div>
              </div>

              {/* Right Column: Calculations & Action */}
              <div className="lg:col-span-5">
                <div className="bg-[#0a1128] rounded-[2rem] p-8 text-white sticky top-24 shadow-2xl shadow-slate-900/20">
                  <h4 className="font-black tracking-tight text-xl mb-8 opacity-90">Calculation Summary</h4>
                  
                  <div className="space-y-4 text-sm font-medium opacity-80 border-b border-white/10 pb-6 mb-6">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                      <span>Gross Earnings</span>
                      <span className="font-bold whitespace-nowrap">Rs. {calcGross().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl text-rose-300">
                      <span>Total Deductions</span>
                      <span className="font-bold whitespace-nowrap">- Rs. {(Number(deductions) || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mb-10">
                    <span className="text-xs font-black uppercase tracking-widest opacity-60">Net Salary</span>
                    <span className="text-3xl font-black text-cyan-400">Rs. {calcNet().toLocaleString()}</span>
                  </div>

                  <button 
                    type="submit"
                    disabled={isGenerating || calcNet() < 0}
                    className="w-full group relative bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><FileText className="w-5 h-5" /> Generate PDF / Save</>}
                  </button>
                  {calcNet() < 0 && <p className="text-[10px] text-rose-400 text-center mt-3 font-bold">Net salary cannot be negative.</p>}
                </div>
              </div>
            </div>
          </motion.form>
        )}

        {/* Viewing Past History */}
        {activeTab === 'history' && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-x-auto"
          >
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Earnings</th>
                  <th className="px-6 py-4">Deductions</th>
                  <th className="px-6 py-4">Net Payout</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {historySlips.map((slip, idx) => (
                  <tr key={slip._id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 text-xs">{slip.employeeName}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{slip.employeePost}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-cyan-600 text-xs bg-cyan-50 inline-flex px-3 py-1 rounded-full">{slip.month} {slip.year}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600 text-xs">Rs. {slip.grossSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-rose-500 text-xs">Rs. {slip.deductions.toLocaleString()}</td>
                    <td className="px-6 py-4 font-black text-slate-900 text-sm">Rs. {slip.netSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Basic mailto schema for easy desktop client email */}
                        <a 
                          href={`mailto:?subject=Salary Slip - ${slip.month} ${slip.year}&body=Please find the attached salary slip details for the period.`}
                          className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="Compose Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
                {historySlips.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16 text-slate-400 font-medium">No past salary records found.</td></tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
