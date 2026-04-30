"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, FileText, Download, Award, Settings2, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';

export default function InternshipOfferLetter() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // ─── Editable Form State ───
  const [selectedEmpId, setSelectedEmpId] = useState('');
  
  // Header Meta
  const [refNo, setRefNo] = useState(`NTS/INT/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }));
  const [city, setCity] = useState('Kanpur');
  const [subject, setSubject] = useState('Sub: Internship Offer Letter');
  
  // Body Sections (SkillCraft Template Style)
  const [salutation, setSalutation] = useState('Dear [Candidate Name],');
  const [body1, setBody1] = useState('We are pleased to offer you the position of [Designation] at Novalytix Technology Services. This is an educational internship. As a valued member of our team, you will have the opportunity to gain hands-on experience in this field.');
  const [body2, setBody2] = useState('The internship is scheduled to commence on the [Joining Date] and will conclude on the [End Date], resulting in a [Duration] duration for the program.');
  const [body3, setBody3] = useState('By accepting this offer, you acknowledge that you understand participation in this program is not an offer of employment, and successful completion of the program does not entitle you to an employment offer from Novalytix Technology Services.');
  const [body4, setBody4] = useState('You also agree that you will follow all of the company\'s policies that apply to non-employee interns. This letter constitutes the complete understanding between you and the company regarding your internship and supersedes all prior discussions or agreements. This letter may only be modified by a written agreement signed by both of us.');
  const [body5, setBody5] = useState('We eagerly anticipate your commencement of the internship program at Novalytix Technology Services and extend our best wishes for a prosperous experience.');
  
  const [closing, setClosing] = useState('Sincerely,');
  const [signatoryCompany, setSignatoryCompany] = useState('Novalytix Technology Services');
   // Footer Details
  const [regdOffice, setRegdOffice] = useState('133/306, Transport Nagar, Kanpur – 208023');
  const [contactInfo, setContactInfo] = useState('Tel. : +91 90053 33587 * E-mail : service.desk@novalytixtechservices.com * Website: https://novalytixtech.com/');
  const [branchOffices, setBranchOffices] = useState('Branch Offices : Kanpur');
  const [cin, setCin] = useState('CIN: U62090UP2025PTC223546');

  // Extra input states
  const [duration, setDuration] = useState('one-month');
  const [endDate, setEndDate] = useState('30/06/2025');

  useEffect(() => {
    fetch('/api/admin/employees')
      .then(r => r.json())
      .then(d => { if (d.success) setEmployees(d.data); })
      .finally(() => setLoading(false));
  }, []);

  const selectedEmp = employees.find(e => e._id === selectedEmpId);

  // Sync state when employee is selected
  useEffect(() => {
    if (selectedEmp) {
      setSalutation(`Dear ${selectedEmp.employeeName},`);
      setBody1(`We are pleased to offer you the position of ${selectedEmp.employeePost} at Novalytix Technology Services. This is an educational internship. As a valued member of our team, you will have the opportunity to gain hands-on experience in this field.`);
      const jDate = new Date(selectedEmp.dateOfJoining).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      setBody2(`The internship is scheduled to commence on the ${jDate} and will conclude on the ${endDate}, resulting in a ${duration} duration for the program.`);
    }
  }, [selectedEmpId, duration, endDate]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) {
      alert('Please select a candidate.');
      return;
    }

    setIsGenerating(true);
    try {
      const emp = selectedEmp!;
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

      // ── 2. Subtle Image Watermark ──
      try {
        // We use the logo as watermark with low opacity
        const logoUrl = '/logi-Photoroom.png';
        const img = new Image();
        img.src = logoUrl;
        
        // Use GState for transparency
        doc.saveGraphicsState();
        doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
        // Center the logo
        const logoSize = 120;
        doc.addImage(img, 'PNG', (W - logoSize) / 2, (H - logoSize) / 2, logoSize, logoSize);
        doc.restoreGraphicsState();
      } catch (err) {
        console.warn("Logo watermark failed to load:", err);
      }

      // ── 3. Top Accent Bar ──
      doc.setFillColor(10, 17, 40);
      doc.rect(7, 7, W - 14, 10, 'F');

      // ── 4. Company Header (Custom for NTS) ──
      try {
        const logoUrl = '/logi-Photoroom.png';
        const img = new Image();
        img.src = logoUrl;
        const logoW = 22;
        const logoH = 22;
        doc.addImage(img, 'PNG', (W - logoW) / 2, 18, logoW, logoH);
      } catch (err) {
        console.warn("Header logo failed to load:", err);
      }

      doc.setFont('times', 'bold');
      doc.setFontSize(19);
      doc.setTextColor(10, 17, 40);
      doc.text('NOVALYTIX SERVICES PRIVATE LIMITED', W / 2, 48, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text('Corporate Head Office: 133/306, Transport Nagar, Kanpur – 208023', W / 2, 54, { align: 'center' });
      doc.text('Phone: +91 90053 33587 | Email: service.desk@novalytixtechservices.com | Web: https://novalytixtech.com/', W / 2, 59, { align: 'center' });

      // divider
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.4);
      doc.line(margin, 65, W - margin, 65);

      // ── 5. Reference & Date (SkillCraft Style) ──
      doc.setFontSize(11);
      doc.setFont('times', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`Date: ${date}`, margin + 2, 75);
      doc.text(`ID: ${refNo}`, W - margin - 2, 75, { align: 'right' });

      // ── 6. Salutation ──
      doc.setFont('times', 'normal');
      doc.text(salutation, margin + 2, 88);

      // ── 7. Body Content (Flowing) ──
      doc.setFontSize(11);
      let currentY = 98;
      
      const paragraphs = [body1, body2, body3, body4, body5];
      paragraphs.forEach((p) => {
        const lines = doc.splitTextToSize(p, W - (margin + 2) * 2);
        doc.text(lines, margin + 2, currentY, { lineHeightFactor: 1.5 });
        currentY += (lines.length * 6) + 6;
      });

      currentY += 5;
      doc.text(closing, margin + 2, currentY);
      currentY += 10;
      doc.setFont('times', 'bold');
      doc.text(signatoryCompany, margin + 2, currentY);

      // ── 9. Footer Section ──
      doc.setFillColor(10, 17, 40);
      doc.rect(7, H - 17, W - 14, 10, 'F');
      
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(`Regd Office: ${regdOffice}`, W / 2, H - 12.5, { align: 'center' });
      doc.text(`${contactInfo} | ${branchOffices}`, W / 2, H - 9, { align: 'center' });
      doc.setFont('times', 'bold');
      doc.text(cin, margin + 5, H - 20, { align: 'left' });

      // ── Save ──
      const fileName = `Offer_Letter_${emp.employeeName.replace(/\s+/g, '_')}.pdf`;
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
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="bg-[#f8fbff] rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-[#0a1128]/20 overflow-hidden min-h-[80vh] flex flex-col">
      {/* Dynamic Header */}
      <div className="px-10 py-8 bg-white border-b border-[#0a1128]/10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center overflow-hidden p-2 shadow-inner">
             <img src="/logi-Photoroom.png" alt="NTS Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#0a1128] tracking-tight">Offer Template Engine</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-2">
              <Settings2 className="w-3 h-3" /> SkillCraft Style Template
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => window.location.reload()}
             className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
           >
             <RotateCcw className="w-3.5 h-3.5" /> Reset
           </button>
           <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>
           <select
             required
             value={selectedEmpId}
             onChange={e => setSelectedEmpId(e.target.value)}
             className="px-6 py-2.5 bg-[#0a1128] text-white rounded-xl text-sm font-bold focus:outline-none ring-offset-2 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
           >
             <option value="">-- SELECT CANDIDATE --</option>
             {employees.map(emp => (
               <option key={emp._id} value={emp._id}>
                 {emp.employeeName} ({emp.employeePost})
               </option>
             ))}
           </select>
        </div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* Customizer */}
          <div className="lg:col-span-12 space-y-8">
            
            {/* Meta Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Reference No.</label>
                <input type="text" value={refNo} onChange={e => setRefNo(e.target.value)} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Issue Date</label>
                <input type="text" value={date} onChange={e => setDate(e.target.value)} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Program Duration</label>
                <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="one-month" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Program End Date</label>
                <input type="text" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="30/06/2025" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all" />
              </div>
            </div>

            {/* Body Editor */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Salutation</label>
                <input type="text" value={salutation} onChange={e => setSalutation(e.target.value)} className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold" />
              </div>

              {[body1, body2, body3, body4, body5].map((text, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Paragraph {i+1}</label>
                  <textarea 
                    rows={2} 
                    value={text} 
                    onChange={e => {
                      const setters = [setBody1, setBody2, setBody3, setBody4, setBody5];
                      setters[i](e.target.value);
                    }} 
                    className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm leading-relaxed focus:ring-4 focus:ring-blue-500/10 transition-all resize-none font-medium text-slate-700" 
                  />
                </div>
              ))}
            </div>

            {/* Closing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Closing</label>
                <input type="text" value={closing} onChange={e => setClosing(e.target.value)} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Signatory Company</label>
                <input type="text" value={signatoryCompany} onChange={e => setSignatoryCompany(e.target.value)} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !selectedEmpId}
                className="group relative px-12 py-5 bg-[#0a1128] hover:bg-slate-800 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-40"
              >
                {isGenerating ? "Finalizing PDF..." : "Generate Letter PDF"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
