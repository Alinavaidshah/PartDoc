import React, { useState, useEffect } from 'react';
import api from "../../api/axiosConfig"; // <-- Configured api import kiya
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trash2, Check, Loader2, Calendar, Clock, Phone, Mail, Smartphone, FileText, Inbox } from 'lucide-react';
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

const statusStyles = {
  Pending: { bg: '#fef9c3', text: '#a16207', border: '#fde68a' },
  Approved: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  Denied: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' }
};

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  // Sidebar collapse states
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/appointments'); // <-- api instance use kiya
        setAppointments(Array.isArray(data) ? data : (data.appointments || []));
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleAction = async () => {
    const { id, type, status } = confirmModal;
    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      if (type === 'delete') {
        await api.delete(`/appointments/${id}`); // <-- api instance use kiya
      } else {
        await api.put(`/appointments/${id}/status`, { status }); // <-- api instance use kiya
      }

      setConfirmModal(prev => ({ ...prev, loading: false, success: true }));

      setTimeout(() => {
        if (type === 'delete') {
          setAppointments(prev => prev.filter(a => a._id !== id));
        } else {
          setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
        }
        setConfirmModal(null);
      }, 1200);
    } catch (err) {
      alert("Operation failed. Please try again.");
      setConfirmModal(null);
    }
  };

  const filtered = appointments.filter(a => filter === 'All' ? true : a.status === filter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } }
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar title="Manage Appointments" onMenuClick={() => setMobileOpen(true)} />
        <div style={{ padding: '24px' }}>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              {['All', 'Pending', 'Approved', 'Denied'].map(f => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(f)}
                  style={{
                    position: 'relative',
                    padding: '8px 24px',
                    borderRadius: 8,
                    background: filter === f ? '#1e293b' : '#e2e8f0',
                    color: filter === f ? '#fff' : '#334155',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'background 0.2s'
                  }}
                >
                  {f}
                </motion.button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
              {filtered.length} appointment{filtered.length !== 1 ? 's' : ''}
            </div>
          </motion.div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '80px 0', color: '#94a3b8' }}>
              <Loader2 className="animate-spin" size={28} color="#1e293b" />
              <span style={{ fontSize: 14 }}>Loading appointments...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '80px 0', color: '#94a3b8' }}>
              <Inbox size={32} />
              <span style={{ fontSize: 14 }}>No appointments found.</span>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map(a => {
                  const s = statusStyles[a.status] || statusStyles.Pending;
                  return (
                    <motion.div
                      key={a._id}
                      layout
                      variants={cardVariants}
                      exit="exit"
                      whileHover={{ y: -3, boxShadow: '0 8px 20px -8px rgba(0,0,0,0.12)' }}
                      onClick={() => setSelectedAppt(a)}
                      style={{
                        background: '#fff',
                        padding: '16px 24px',
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
                          {a.name}
                          <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '2px 10px',
                            borderRadius: 999,
                            background: s.bg,
                            color: s.text,
                            border: `1px solid ${s.border}`
                          }}>
                            {a.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={12} /> {a.appointmentDate}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        {a.status !== 'Approved' && (
                          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                            <CheckCircle2
                              size={22}
                              color="#22c55e"
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => { e.stopPropagation(); setConfirmModal({ id: a._id, type: 'status', status: 'Approved', color: '#22c55e', label: 'Approve' }); }}
                            />
                          </motion.div>
                        )}
                        {a.status !== 'Denied' && (
                          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                            <XCircle
                              size={22}
                              color="#ef4444"
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => { e.stopPropagation(); setConfirmModal({ id: a._id, type: 'status', status: 'Denied', color: '#ef4444', label: 'Deny' }); }}
                            />
                          </motion.div>
                        )}
                        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                          <Trash2
                            size={22}
                            color="#94a3b8"
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => { e.stopPropagation(); setConfirmModal({ id: a._id, type: 'delete', color: '#ef4444', label: 'Delete' }); }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedAppt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
            onClick={() => setSelectedAppt(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ background: '#fff', padding: 32, borderRadius: 20, width: '400px', maxHeight: '85vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ margin: '0 0 20px' }}>Appointment Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { l: 'Name', v: selectedAppt.name, icon: <Smartphone size={12} /> },
                  { l: 'Phone', v: selectedAppt.phone, icon: <Phone size={12} /> },
                  { l: 'Email', v: selectedAppt.customerEmail, icon: <Mail size={12} /> },
                  { l: 'Device', v: selectedAppt.deviceModel, icon: <Smartphone size={12} /> },
                  { l: 'Issue', v: selectedAppt.issueDescription, icon: <FileText size={12} /> },
                  { l: 'Date', v: selectedAppt.appointmentDate, icon: <Calendar size={12} /> },
                  { l: 'Time', v: selectedAppt.appointmentTime, icon: <Clock size={12} /> }
                ].map((item, idx) => (
                  <motion.div
                    key={item.l}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      {item.icon} {item.l}
                    </div>
                    <div style={{ padding: '8px 10px', background: '#f1f5f9', borderRadius: 8, fontSize: 14, color: '#1e293b' }}>
                      {item.v || '—'}
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                style={{ marginTop: 24, width: '100%', padding: 12, borderRadius: 8, border: 'none', background: '#1e293b', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Action Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ background: '#fff', padding: 30, borderRadius: 24, textAlign: 'center', width: 280 }}
            >
              <AnimatePresence mode="wait">
                {confirmModal.success ? (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ color: '#22c55e', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
                  >
                    <Check size={60} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Done!</span>
                  </motion.div>
                ) : confirmModal.loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '10px 0' }}
                  >
                    <Loader2 size={40} className="animate-spin" color="#1e293b" />
                    <span style={{ fontSize: 13, color: '#64748b' }}>Processing...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 style={{ margin: '0 0 15px' }}>Confirm {confirmModal.label}?</h3>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAction}
                        style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: confirmModal.color, color: '#fff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Yes
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setConfirmModal(null)}
                        style={{ flex: 1, padding: 12, borderRadius: 12, border: 'none', background: '#f1f5f9', cursor: 'pointer', fontWeight: 600 }}
                      >
                        No
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAppointment;