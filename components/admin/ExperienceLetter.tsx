"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileText, Download, Scroll } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ExperienceLetter() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form state
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [refNo, setRefNo] = useState(`NTS/EXP/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
  const [appreciation, setAppreciation] = useState(
    'During their tenure, they demonstrated professionalism, dedication, and commitment in all assigned responsibilities. They were a valuable member of our team.'
  );

  useEffect(() => {
    fetch('/api/admin/employees')
      .then(r => r.json())
      .then(d => { if (d.success) setEmployees(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const selectedEmp = employees.find(e => e._id === selectedEmpId);

  // Format date nicely e.g. "25 March 2024"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId || !endDate) {
      alert('Please select an employee and enter the last working day.');
      return;
    }

    setIsGenerating(true);
    try {
      const emp = selectedEmp!;
      const issueDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const startDateFormatted = formatDate(emp.dateOfJoining);
      const endDateFormatted = formatDate(endDate);

      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const W = 210;
      const H = 297;
      const margin = 20;

      // ── 1. Elegant Double Border ──
      doc.setDrawColor(10, 17, 40);
      doc.setLineWidth(0.5);
      doc.rect(5, 5, W - 10, H - 10, 'S'); // Outer
      doc.setLineWidth(0.2);
      doc.rect(7, 7, W - 14, H - 14, 'S'); // Inner

      // ── 2. Subtle Watermark ──
      doc.saveGraphicsState();
      doc.setGState(new (doc as any).GState({ opacity: 0.03 }));
      doc.setFontSize(60);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('NOVALYTIX SECURITY', W / 2, H / 2, { align: 'center', angle: 45 });
      doc.restoreGraphicsState();

      // ── 3. Top Accent Bar ──
      doc.setFillColor(10, 17, 40);
      doc.rect(7, 7, W - 14, 10, 'F');

      // ── 4. Company Header ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(10, 17, 40);
      doc.text('NOVALYTIX SECURITY', W / 2, 35, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Corporate Head Office: 123 Security Square, New Delhi - 110001', W / 2, 42, { align: 'center' });
      doc.text('Phone: +91 98765 43210 | Email: info@novalytix.in | Web: www.novalytix.in', W / 2, 47, { align: 'center' });

      // divider
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(20, 55, W - 20, 55);

      // ── 5. Reference & Date Line ──
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text(`REF NO: ${refNo}`, margin, 68);
      doc.setFont('helvetica', 'normal');
      doc.text(`DATE: ${issueDate}`, W - margin, 68, { align: 'right' });

      // ── 6. Title Block ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(0, 180, 216);
      doc.text('TO WHOMSOEVER IT MAY CONCERN', W / 2, 85, { align: 'center' });
      
      // Decorative underline
      doc.setDrawColor(0, 180, 216);
      doc.setLineWidth(0.8);
      doc.line(W / 2 - 45, 87, W / 2 + 45, 87);

      // ── 7. Body Text ──
      const bodyText = 
        `This is to formally certify and confirm that ${emp.employeeName} (Employee ID: ${emp.employeeId}) ` +
        `was an integral part of Novalytix Security Pvt. Ltd. as a ${emp.employeePost} for the period ` +
        `commencing from ${startDateFormatted} until ${endDateFormatted}.\n\n` +
        `${appreciation}\n\n` +
        `We characterize ${emp.employeeName} as a hardworking, reliable, and professionally competent individual. ` +
        `Their contributions towards the organization have been commendable throughout their tenure.\n\n` +
        `We would like to take this opportunity to thank them for their service and wish them the very best ` +
        `of luck and success in all their future professional and personal endeavors.`;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(40, 40, 40);
      const bodyLines = doc.splitTextToSize(bodyText, W - margin * 2);
      doc.text(bodyLines, margin, 105, { align: 'left', lineHeightFactor: 1.5 });

      // ── 8. Signature Block ──
      // Calculate height dynamically
      const signatureY = 105 + (bodyLines.length * 7) + 20;
      
      doc.setFontSize(10);
      doc.text('Yours Sincerely,', margin, signatureY);
      
      doc.setFont('helvetica', 'bold');
      doc.text('For Novalytix Security Pvt. Ltd.', margin, signatureY + 7);
      
      // Signature Placeholder
      doc.setFont('courier', 'bolditalic');
      doc.setFontSize(12);
      doc.setTextColor(0, 100, 200);
      doc.text('System Verified', margin + 2, signatureY + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text('Authorised Signatory', margin, signatureY + 26);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Human Resources Department', margin, signatureY + 31);

      // ── 9. Official Seal Placeholder ──
      const sealX = W - margin - 30;
      const sealY = signatureY + 15;
      doc.setDrawColor(0, 180, 216);
      doc.setLineWidth(0.3);
      doc.circle(sealX, sealY, 15, 'S');
      doc.setFontSize(6);
      doc.setTextColor(0, 180, 216);
      doc.text('OFFICIAL SEAL', sealX, sealY - 1, { align: 'center' });
      doc.text('NOVALYTIX', sealX, sealY + 3, { align: 'center' });


      // ── 10. Footer ──
      doc.setFillColor(10, 17, 40);
      doc.rect(7, H - 17, W - 14, 10, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('Regd Office: Plot No. 45, Cyber Hub, Sector 21, Gurugram, HR - 122016', W / 2, H - 11, { align: 'center' });

      // ── Save ──
      const fileName = `Experience_Letter_${emp.employeeName.replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error(err);
      alert('An error occurred generating the PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
    </div>
  );

  return (
    <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden min-h-[60vh]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100/80 bg-slate-50/50 flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center">
          <Scroll className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h3 className="text-xl font-black text-[#0a1128] tracking-tight">Experience Letter Generator</h3>
          <p className="text-xs text-slate-500 mt-0.5">Generate a formal, professional experience letter PDF for any employee.</p>
        </div>
      </div>

      <div className="p-8">
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleGenerate}
          className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* ─── Left: Inputs ─── */}
          <div className="lg:col-span-7 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Reference Number *</label>
                <input
                  type="text"
                  required
                  value={refNo}
                  onChange={e => setRefNo(e.target.value)}
                  placeholder="NTS/EXP/2026/001"
                  className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Last Working Day *</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Select Employee *</label>
              <select
                required
                value={selectedEmpId}
                onChange={e => setSelectedEmpId(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-medium text-slate-700"
              >
                <option value="">-- Choose Employee --</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeName} ({emp.employeeId} – {emp.employeePost})
                  </option>
                ))}
              </select>
            </div>

            {selectedEmp && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-violet-50/50 border border-violet-100 rounded-2xl p-5 grid grid-cols-2 gap-3 text-sm"
              >
                <div><span className="text-[10px] font-bold uppercase text-slate-400">Name</span><p className="font-bold text-slate-800 mt-0.5">{selectedEmp.employeeName}</p></div>
                <div><span className="text-[10px] font-bold uppercase text-slate-400">Employee ID</span><p className="font-bold text-slate-800 mt-0.5">{selectedEmp.employeeId}</p></div>
                <div><span className="text-[10px] font-bold uppercase text-slate-400">Designation</span><p className="font-bold text-slate-800 mt-0.5">{selectedEmp.employeePost}</p></div>
                <div><span className="text-[10px] font-bold uppercase text-slate-400">Date of Joining</span><p className="font-bold text-slate-800 mt-0.5">{formatDate(selectedEmp.dateOfJoining)}</p></div>
              </motion.div>
            )}



            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Appreciation Line (Optional)</label>
              <textarea
                value={appreciation}
                onChange={e => setAppreciation(e.target.value)}
                rows={3}
                className="w-full mt-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all resize-none"
              />
              <p className="text-[10px] text-slate-400 mt-1 ml-1">This line appears in the letter body. You can edit or blank it out.</p>
            </div>
          </div>

          {/* ─── Right: Preview + Button ─── */}
          <div className="lg:col-span-5">
            <div className="bg-[#0a1128] rounded-[2rem] p-8 text-white sticky top-24 shadow-2xl shadow-slate-900/20">
              <h4 className="font-black text-lg mb-6 tracking-tight opacity-90 flex items-center gap-3">
                <FileText className="w-5 h-5 text-violet-400" /> Letter Preview
              </h4>

              <div className="space-y-3 text-xs font-medium opacity-70 mb-8">
                <div className="flex justify-between bg-white/5 p-3 rounded-xl">
                  <span>Employee</span>
                  <span className="font-bold text-right max-w-[140px] truncate">{selectedEmp?.employeeName || '—'}</span>
                </div>
                <div className="flex justify-between bg-white/5 p-3 rounded-xl">
                  <span>Designation</span>
                  <span className="font-bold">{selectedEmp?.employeePost || '—'}</span>
                </div>
                <div className="flex justify-between bg-white/5 p-3 rounded-xl">
                  <span>Start Date</span>
                  <span className="font-bold">{selectedEmp ? formatDate(selectedEmp.dateOfJoining) : '—'}</span>
                </div>
                <div className="flex justify-between bg-white/5 p-3 rounded-xl">
                  <span>End Date</span>
                  <span className="font-bold">{endDate ? formatDate(endDate) : '—'}</span>
                </div>
                <div className="flex justify-between bg-white/5 p-3 rounded-xl">
                  <span>Issue Date</span>
                  <span className="font-bold text-violet-400">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !selectedEmpId || !endDate}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl shadow-violet-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isGenerating
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
                  : <><Download className="w-5 h-5" /> Generate & Download PDF</>}
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
