"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, X, Search, Edit2, Trash2 } from 'lucide-react';

export default function OpportunitiesTable() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    detailName: '',
    projectName: '',
    dealerName: '',
    dealerAddress: '',
    note: '',
    projectValuation: '',
    durationOfProject: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchOpportunities = () => {
    fetch('/api/admin/opportunities')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOpportunities(data.data);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const originalOpportunities = [...opportunities];
    setOpportunities(opportunities.map(opp => opp._id === id ? { ...opp, status: newStatus } : opp));

    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!data.success) {
        setOpportunities(originalOpportunities);
        alert('Failed to update status');
      }
    } catch (err) {
      setOpportunities(originalOpportunities);
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      const res = await fetch(`/api/admin/opportunities/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setOpportunities(opportunities.filter(opp => opp._id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      alert('Error deleting opportunity');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      detailName: '',
      projectName: '',
      dealerName: '',
      dealerAddress: '',
      note: '',
      projectValuation: '',
      durationOfProject: '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (opp: any) => {
    setModalMode('edit');
    setEditingId(opp._id);
    setFormData({
      detailName: opp.detailName || '',
      projectName: opp.projectName || '',
      dealerName: opp.dealerName || '',
      dealerAddress: opp.dealerAddress || '',
      note: opp.note || '',
      projectValuation: opp.projectValuation?.toString() || '',
      durationOfProject: opp.durationOfProject || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.detailName || !formData.projectName || !formData.dealerName || !formData.dealerAddress || !formData.projectValuation) {
      setError('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      detailName: formData.detailName,
      projectName: formData.projectName,
      dealerName: formData.dealerName,
      dealerAddress: formData.dealerAddress,
      note: formData.note,
      projectValuation: Number(formData.projectValuation),
      durationOfProject: formData.durationOfProject,
    };

    try {
      const url = modalMode === 'create' ? '/api/admin/opportunities' : `/api/admin/opportunities/${editingId}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchOpportunities();
      } else {
        setError(data.error || 'Failed to save opportunity');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => 
    opp.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.dealerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.opportunityId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#00b4d8]" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative"
    >
      <div className="px-6 py-4 border-b border-slate-100/80 bg-white flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-black text-[#0a1128] tracking-tight">Opportunities</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Manage pipeline and deals structure.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8]/50 transition-all font-medium"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#00b4d8] hover:bg-[#0096c7] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" /> New Opportunity
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-8 py-5">Opportunity ID</th>
              <th className="px-8 py-5">Project Details</th>
              <th className="px-8 py-5">Dealer Information</th>
              <th className="px-8 py-5">Valuation</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOpportunities.map((opp: any, idx: number) => (
              <motion.tr 
                key={opp._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-8 py-4">
                  <span className="font-bold text-[#00b4d8] text-xs">
                    {opp.opportunityId}
                  </span>
                  <div className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-widest">{opp.detailName}</div>
                </td>
                <td className="px-8 py-4">
                  <div className="font-bold text-slate-900 text-xs">{opp.projectName}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opp.durationOfProject ? opp.durationOfProject : 'No duration set'}</div>
                </td>
                <td className="px-8 py-4 text-xs">
                   <div className="font-bold text-slate-700">{opp.dealerName}</div>
                   <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">{opp.dealerAddress}</div>
                </td>
                <td className="px-8 py-4">
                   <div className="font-bold text-slate-700 text-xs">
                     ₹{opp.projectValuation?.toLocaleString()}
                   </div>
                </td>
                <td className="px-8 py-4">
                  <select 
                    value={opp.status}
                    onChange={(e) => handleStatusChange(opp._id, e.target.value)}
                    className={`text-[10px] font-black uppercase tracking-wider pl-3 pr-8 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-offset-1 transition-colors cursor-pointer ${
                        opp.status === 'Open' ? 'bg-amber-50 text-amber-600 focus:ring-amber-500/20' : 
                        opp.status === 'Closed-Won' ? 'bg-emerald-50 text-emerald-600 focus:ring-emerald-500/20' : 
                        'bg-rose-50 text-rose-600 focus:ring-rose-500/20'
                    }`}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed-Won">Closed - Won</option>
                    <option value="Closed-Lost">Closed - Lost</option>
                  </select>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(opp)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit Opportunity"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(opp._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Opportunity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {filteredOpportunities.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center text-slate-400 font-medium">
                  No opportunities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Creation / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-black text-[#0a1128] tracking-tight mb-2">
                {modalMode === 'create' ? 'New Opportunity' : 'Edit Opportunity'}
              </h2>
              <p className="text-xs text-slate-500 mb-8">
                {modalMode === 'create' ? 'Create a new deal with project and dealer specifics.' : 'Update the opportunity details below.'}
              </p>

              <form onSubmit={handleCreateSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Detail Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Admin Detail *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Added by Admin Smith"
                      value={formData.detailName}
                      onChange={(e) => setFormData({ ...formData, detailName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8]/50 transition-all font-medium"
                    />
                  </div>

                  {/* Project Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Project Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Tech Deployment"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8]/50 transition-all font-medium"
                    />
                  </div>

                  {/* Dealer Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Dealer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Global Supplies Inc."
                      value={formData.dealerName}
                      onChange={(e) => setFormData({ ...formData, dealerName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8]/50 transition-all font-medium"
                    />
                  </div>

                  {/* Project Valuation */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Project Valuation (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 50000"
                      value={formData.projectValuation}
                      onChange={(e) => setFormData({ ...formData, projectValuation: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8]/50 transition-all font-medium"
                    />
                  </div>

                  {/* Duration of Project */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Duration of Project (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 6 Months"
                      value={formData.durationOfProject}
                      onChange={(e) => setFormData({ ...formData, durationOfProject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8]/50 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Dealer Address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Dealer Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. 123 Industrial Ave, NY"
                    value={formData.dealerAddress}
                    onChange={(e) => setFormData({ ...formData, dealerAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8]/50 transition-all font-medium resize-none"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Note (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Enter any additional details or requirements here..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b4d8]/20 focus:border-[#00b4d8]/50 transition-all font-medium resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 mt-6 bg-[#0a1128] hover:bg-[#1a2342] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (modalMode === 'create' ? 'Create Opportunity' : 'Update Opportunity')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
