"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Plus, X, Search, Edit2, Trash2, Users } from 'lucide-react';

export default function EmployeesTable() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeAddress: '',
    employeeId: '',
    employeeEmail: '',
    employeePhoneNumber: '',
    employeePost: '',
    employeeBloodGroup: '',
    dateOfJoining: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchEmployees = () => {
    fetch('/api/admin/employees')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEmployees(data.data);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const res = await fetch(`/api/admin/employees/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setEmployees(employees.filter(emp => emp._id !== id));
      } else {
        alert('Failed to delete employee');
      }
    } catch (err) {
      alert('Error deleting employee');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({
      employeeName: '',
      employeeAddress: '',
      employeeId: '',
      employeeEmail: '',
      employeePhoneNumber: '',
      employeePost: '',
      employeeBloodGroup: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (emp: any) => {
    setModalMode('edit');
    setEditingId(emp._id);
    setFormData({
      employeeName: emp.employeeName || '',
      employeeAddress: emp.employeeAddress || '',
      employeeId: emp.employeeId || '',
      employeeEmail: emp.employeeEmail || '',
      employeePhoneNumber: emp.employeePhoneNumber || '',
      employeePost: emp.employeePost || '',
      employeeBloodGroup: emp.employeeBloodGroup || '',
      dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic required check
    if (!formData.employeeName || !formData.employeeId || !formData.employeeEmail || !formData.dateOfJoining) {
      setError('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const url = modalMode === 'create' ? '/api/admin/employees' : `/api/admin/employees/${editingId}`;
      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchEmployees();
      } else {
        setError(data.error || 'Failed to save employee');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeePost?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative"
    >
      <div className="px-6 py-4 border-b border-slate-100/80 bg-white flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-black text-[#0a1128] tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Corporate Directory
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5 ml-7">Manage employee and staff profiles securely.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search staff..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> New Staff
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-8 py-5">Employee Info</th>
              <th className="px-8 py-5">Role & Id</th>
              <th className="px-8 py-5">Contact Details</th>
              <th className="px-8 py-5">Joining Date</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredEmployees.map((emp: any, idx: number) => (
              <motion.tr 
                key={emp._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-black text-sm shadow-inner uppercase">
                      {emp.employeeName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{emp.employeeName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">Blood: {emp.employeeBloodGroup || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="font-bold text-slate-700 text-xs">{emp.employeePost}</div>
                  <div className="text-[10px] font-black tracking-widest text-indigo-500 uppercase mt-0.5">ID: {emp.employeeId}</div>
                </td>
                <td className="px-8 py-4">
                   <div className="text-slate-700 text-xs font-medium">{emp.employeeEmail}</div>
                   <div className="text-[10px] text-slate-400 mt-0.5">{emp.employeePhoneNumber}</div>
                </td>
                <td className="px-8 py-4 text-slate-500 font-medium text-[11px]">
                  {new Date(emp.dateOfJoining).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(emp)}
                      className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors"
                      title="Edit Employee"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(emp._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-medium">
                  No personnel found.
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
              className="relative bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-black text-[#0a1128] tracking-tight mb-2">
                {modalMode === 'create' ? 'Register Employee' : 'Edit Employee File'}
              </h2>
              <p className="text-xs text-slate-500 mb-8">
                {modalMode === 'create' ? 'Input personnel information securely.' : 'Update the selected personnel details.'}
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Name */}
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.employeeName}
                      onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                    />
                  </div>

                  {/* ID */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Employee ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EMP001"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium uppercase"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.employeeEmail}
                      onChange={(e) => setFormData({ ...formData, employeeEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 234 567 890"
                      value={formData.employeePhoneNumber}
                      onChange={(e) => setFormData({ ...formData, employeePhoneNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                    />
                  </div>

                  {/* Post */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Position / Post *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Developer"
                      value={formData.employeePost}
                      onChange={(e) => setFormData({ ...formData, employeePost: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                    />
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Blood Group</label>
                    <input
                      type="text"
                      placeholder="e.g. O+"
                      value={formData.employeeBloodGroup}
                      onChange={(e) => setFormData({ ...formData, employeeBloodGroup: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                    />
                  </div>

                  {/* Date of Joining */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Date of Joining *</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfJoining}
                      onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-1">Residential Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter full address..."
                    value={formData.employeeAddress}
                    onChange={(e) => setFormData({ ...formData, employeeAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium resize-none"
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
                  className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-600/30"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (modalMode === 'create' ? 'Register Employee' : 'Update Records')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
