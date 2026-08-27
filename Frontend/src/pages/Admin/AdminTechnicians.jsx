import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { Wrench, Search, Phone, Briefcase, Calendar, Trash2, CheckCircle2, Clock, XCircle, UserCheck } from 'lucide-react';
import api from '../../api/axiosConfig';

const AdminTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const res = await api.get('/technicians');
      setTechnicians(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error loading technicians:", err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/technicians/${id}`, { status: newStatus });
      setTechnicians(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      alert("Error updating status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this technician application?")) return;
    try {
      await api.delete(`/technicians/${id}`);
      setTechnicians(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert("Error deleting application: " + (err.response?.data?.message || err.message));
    }
  };

  const filtered = technicians.filter(t => {
    const matchesSearch = (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (t.phone || '').toLowerCase().includes(search.toLowerCase()) ||
                          (t.specialization || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalCount = technicians.length;
  const pendingCount = technicians.filter(t => t.status === 'Pending').length;
  const hiredCount = technicians.filter(t => t.status === 'Hired').length;
  const contactedCount = technicians.filter(t => t.status === 'Contacted').length;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif', width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <Topbar title="Technician Recruitment Portal" adminName="Ali Navaid Shah" onMenuClick={() => setMobileOpen(true)} />
        
        <main style={{ padding: '20px', maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box' }} className="p-4 sm:p-6 flex-1">
          
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: 0, fontSize: 26, color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Wrench size={26} className="text-indigo-600" />
              Technician Applicants (Karachi)
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Review technician recruitment submissions for computer, laptop, and mobile repair labs.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                {totalCount}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Total Applicants</div>
                <div className="text-lg font-extrabold text-slate-900">{totalCount} Applications</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Clock size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Pending Review</div>
                <div className="text-lg font-extrabold text-amber-600">{pendingCount} Pending</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Contacted</div>
                <div className="text-lg font-extrabold text-blue-600">{contactedCount} Contacted</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <UserCheck size={18} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500">Hired Experts</div>
                <div className="text-lg font-extrabold text-emerald-600">{hiredCount} Hired</div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate name or phone..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-bold">Status Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-bold"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-bold">Loading applications...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Wrench size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="font-bold text-sm text-slate-600">No technician applications found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Phone / WhatsApp</th>
                      <th className="p-4">Expertise</th>
                      <th className="p-4">Experience</th>
                      <th className="p-4">Applied Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {filtered.map((tech) => {
                      const cleanPhone = (tech.phone || '').replace(/[^0-9]/g, '');
                      const whatsappUrl = `https://wa.me/92${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;

                      return (
                        <tr key={tech._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-900 text-sm">{tech.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: #{tech._id.slice(-6).toUpperCase()}</div>
                          </td>

                          <td className="p-4 font-mono font-bold">
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                            >
                              <Phone size={12} />
                              <span>{tech.phone}</span>
                            </a>
                          </td>

                          <td className="p-4">
                            <span className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg border border-indigo-200">
                              {tech.specialization}
                            </span>
                          </td>

                          <td className="p-4 font-bold text-slate-700">
                            {tech.experience}
                          </td>

                          <td className="p-4 text-slate-500 font-mono text-[11px]">
                            {tech.createdAt ? new Date(tech.createdAt).toLocaleDateString() : 'Recent'}
                          </td>

                          <td className="p-4">
                            <select
                              value={tech.status || 'Pending'}
                              onChange={(e) => handleStatusChange(tech._id, e.target.value)}
                              className={`px-3 py-1.5 rounded-lg border font-bold text-xs focus:outline-none transition-all ${
                                tech.status === 'Hired'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : tech.status === 'Contacted'
                                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                                  : tech.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Pending">⏳ Pending</option>
                              <option value="Contacted">📞 Contacted</option>
                              <option value="Hired">✅ Hired</option>
                              <option value="Rejected">❌ Rejected</option>
                            </select>
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDelete(tech._id)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                              title="Delete Application"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminTechnicians;
