import React, { useState, useEffect } from 'react';
import api from "../../api/axiosConfig";
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Trash2, Check, Loader2, Calendar, Clock, Phone, Mail, Smartphone, FileText, Inbox, Sparkles, MapPin, Tag, Save } from 'lucide-react';
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

  // Price Settings State
  const [faultTracingPrice, setFaultTracingPrice] = useState(899);
  const [preDiagnosedPrice, setPreDiagnosedPrice] = useState(599);
  const [tracingPriceInput, setTracingPriceInput] = useState(899);
  const [preDiagPriceInput, setPreDiagPriceInput] = useState(599);
  const [savingPrice, setSavingPrice] = useState(false);
  const [priceNotice, setPriceNotice] = useState('');

  // Decline Reason Modal State
  const [declineModal, setDeclineModal] = useState(null); // { id, name, deviceModel }
  const [declineReasonInput, setDeclineReasonInput] = useState('');
  const [suggestedDateInput, setSuggestedDateInput] = useState('');
  const [suggestedTimeInput, setSuggestedTimeInput] = useState('');
  const [declining, setDeclining] = useState(false);

  // Sidebar collapse states
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchSettings();
  }, []);

  const handleConfirmDecline = async () => {
    if (!declineModal) return;
    setDeclining(true);
    try {
      const finalReason = declineReasonInput.trim() || 'Schedule or slot unavailability';
      await api.put(`/appointments/${declineModal.id}/status`, {
        status: 'Denied',
        reason: finalReason,
        suggestedDate: suggestedDateInput,
        suggestedTime: suggestedTimeInput
      });

      setAppointments(prev => prev.map(a => a._id === declineModal.id ? {
        ...a,
        status: 'Denied',
        declineReason: finalReason,
        suggestedDate: suggestedDateInput,
        suggestedTime: suggestedTimeInput
      } : a));

      setDeclineModal(null);
      setDeclineReasonInput('');
      setSuggestedDateInput('');
      setSuggestedTimeInput('');
    } catch (err) {
      alert("Failed to decline appointment");
    } finally {
      setDeclining(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(Array.isArray(data) ? data : (data.appointments || []));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/appointments/settings');
      if (data?.faultTracingPrice) {
        setFaultTracingPrice(data.faultTracingPrice);
        setTracingPriceInput(data.faultTracingPrice);
      }
      if (data?.preDiagnosedPrice) {
        setPreDiagnosedPrice(data.preDiagnosedPrice);
        setPreDiagPriceInput(data.preDiagnosedPrice);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    setSavingPrice(true);
    setPriceNotice('');
    try {
      const { data } = await api.put('/appointments/settings', {
        faultTracingPrice: Number(tracingPriceInput),
        preDiagnosedPrice: Number(preDiagPriceInput)
      });
      setFaultTracingPrice(data.faultTracingPrice);
      setPreDiagnosedPrice(data.preDiagnosedPrice);
      setPriceNotice('Both service prices updated successfully!');
      setTimeout(() => setPriceNotice(''), 3500);
    } catch (err) {
      alert("Failed to update prices: " + (err.response?.data?.message || err.message));
    } finally {
      setSavingPrice(false);
    }
  };

  const handleAction = async () => {
    const { id, type, status } = confirmModal;
    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      if (type === 'delete') {
        await api.delete(`/appointments/${id}`);
      } else {
        await api.put(`/appointments/${id}/status`, { status });
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
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <Topbar title="Manage Appointments" onMenuClick={() => setMobileOpen(true)} />
        <div style={{ padding: '24px', maxWidth: '100%', boxSizing: 'border-box' }} className="p-4 sm:p-6">

          {/* ADMIN SERVICE PRICING CONTROL BAR (BOTH OPTION 1 & OPTION 2) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-900">Appointment Service Pricing Controls</div>
                <div className="text-xs text-slate-500">Configure prices for Pre-Diagnosed Lab Upgradations & Doorstep Fault Tracing</div>
              </div>
            </div>

            <form onSubmit={handleUpdatePrice} className="flex flex-wrap items-center gap-3">
              {/* Option 1: Pre-Diagnosed Price */}
              <div className="flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-200 px-3 py-1.5 rounded-xl">
                <span className="text-[11px] font-bold text-indigo-900">Pre-Diagnosed:</span>
                <span className="text-xs font-extrabold text-indigo-600">Rs</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={preDiagPriceInput}
                  onChange={(e) => setPreDiagPriceInput(e.target.value)}
                  className="w-16 px-1.5 py-0.5 bg-white border border-indigo-300 rounded text-xs font-extrabold text-indigo-950 focus:outline-none focus:border-indigo-600 text-center"
                />
              </div>

              {/* Option 2: Fault Tracing Price */}
              <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-300 px-3 py-1.5 rounded-xl">
                <span className="text-[11px] font-bold text-amber-900">Fault Tracing:</span>
                <span className="text-xs font-extrabold text-amber-600">Rs</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={tracingPriceInput}
                  onChange={(e) => setTracingPriceInput(e.target.value)}
                  className="w-16 px-1.5 py-0.5 bg-white border border-amber-300 rounded text-xs font-extrabold text-amber-950 focus:outline-none focus:border-amber-600 text-center"
                />
              </div>

              <button
                type="submit"
                disabled={savingPrice}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {savingPrice ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save Prices</span>
              </button>

              {priceNotice && (
                <span className="text-xs font-extrabold text-emerald-600 animate-pulse">{priceNotice}</span>
              )}
            </form>
          </div>

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
                  const isFaultTracing = a.serviceType === 'Fault Tracing';

                  return (
                    <motion.div
                      key={a._id}
                      layout
                      variants={cardVariants}
                      exit="exit"
                      whileHover={{ y: -3, boxShadow: '0 8px 20px -8px rgba(0,0,0,0.12)' }}
                      onClick={() => setSelectedAppt(a)}
                      style={{
                        background: isFaultTracing ? '#fffbeb' : '#ffffff',
                        padding: '16px 24px',
                        borderRadius: 16,
                        border: isFaultTracing ? '2px solid #f59e0b' : '1.5px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      className="shadow-sm transition-all"
                    >
                      <div>
                        <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <span className="text-slate-900 text-base">{a.name}</span>

                          {/* SERVICE TYPE BADGE (FAULT TRACING VS PRE-DIAGNOSED) */}
                          {isFaultTracing ? (
                            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1.5 shadow-sm">
                              <Sparkles size={12} className="text-amber-700" />
                              ⚡ Doorstep Fault Tracing (Rs {a.price || faultTracingPrice})
                            </span>
                          ) : (
                            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 inline-flex items-center gap-1.5 shadow-sm">
                              🔬 Pre-Diagnosed & Upgradation (Rs {a.price || preDiagnosedPrice})
                            </span>
                          )}

                          {/* PROMINENT STATUS BADGE */}
                          <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider ${
                            a.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            a.status === 'Denied' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                            'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                          }`}>
                            {a.status}
                          </span>
                        </div>

                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {a.appointmentDate}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {a.appointmentTime}</span>
                          {a.address && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#d97706', fontWeight: 600 }}>
                              <MapPin size={12} /> {a.address}
                            </span>
                          )}
                        </div>

                        {a.status === 'Denied' && a.declineReason && (
                          <div style={{ marginTop: 8, fontSize: 11, background: '#fef2f2', color: '#991b1b', borderLeft: '3px solid #ef4444', padding: '4px 8px', borderRadius: 4 }}>
                            <strong>Decline Reason:</strong> {a.declineReason}
                          </div>
                        )}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeclineReasonInput('');
                                setDeclineModal({ id: a._id, name: a.name, deviceModel: a.deviceModel });
                              }}
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
              style={{ background: '#fff', padding: 32, borderRadius: 20, width: '420px', maxHeight: '85vh', overflowY: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0 }}>Appointment Details</h3>
                {selectedAppt.serviceType === 'Fault Tracing' && (
                  <span style={{ fontSize: 11, fontWeight: 800, background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: 6 }}>
                    ⚡ Fault Tracing
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { l: 'Service Type', v: selectedAppt.serviceType === 'Fault Tracing' ? 'Doorstep Fault Tracing' : 'Standard Lab Appointment', icon: <Sparkles size={12} /> },
                  ...(selectedAppt.serviceType === 'Fault Tracing' ? [{ l: 'Fixed Fee', v: `Rs ${selectedAppt.price || faultTracingPrice}`, icon: <Tag size={12} /> }] : []),
                  ...(selectedAppt.address ? [{ l: 'Doorstep Address', v: selectedAppt.address, icon: <MapPin size={12} /> }] : []),
                  { l: 'Name', v: selectedAppt.name, icon: <Smartphone size={12} /> },
                  { l: 'Phone', v: selectedAppt.phone, icon: <Phone size={12} /> },
                  { l: 'Email', v: selectedAppt.customerEmail, icon: <Mail size={12} /> },
                  { l: 'Device', v: selectedAppt.deviceModel, icon: <Smartphone size={12} /> },
                  { l: 'Issue / Notes', v: selectedAppt.issueDescription, icon: <FileText size={12} /> },
                  { l: 'Date', v: selectedAppt.appointmentDate, icon: <Calendar size={12} /> },
                  { l: 'Time', v: selectedAppt.appointmentTime, icon: <Clock size={12} /> },
                  ...(selectedAppt.declineReason ? [{ l: 'Decline Reason', v: selectedAppt.declineReason, icon: <XCircle size={12} /> }] : [])
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
                    <div style={{ fontSize: 14, fontWeight: 600, color: item.l === 'Decline Reason' ? '#ef4444' : '#0f172a' }}>{item.v}</div>
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

      {/* Decline Reason Prompt Modal */}
      <AnimatePresence>
        {declineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: '#fff', padding: 24, borderRadius: 20, width: 440, maxWidth: '92vw', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <XCircle size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Decline / Reschedule Appointment</h3>
                  <div style={{ fontSize: 12, color: '#64748b' }}>For {declineModal.name} ({declineModal.deviceModel})</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 8 }}>
                  Reason for Decline / Update:
                </label>

                {/* Preset quick selection pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {[
                    "Slot unavailable at requested time",
                    "Technician / Spare parts out of stock",
                    "Outside doorstep service area",
                    "Incomplete address or phone details"
                  ].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDeclineReasonInput(preset)}
                      style={{
                        fontSize: 11,
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1px solid #cbd5e1',
                        background: declineReasonInput === preset ? '#eff6ff' : '#f8fafc',
                        color: declineReasonInput === preset ? '#1d4ed8' : '#475569',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <textarea
                  rows="2"
                  required
                  placeholder="Enter reason..."
                  value={declineReasonInput}
                  onChange={(e) => setDeclineReasonInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    marginBottom: 14
                  }}
                />

                {/* OPTIONAL SUGGESTED DATE & TIME PICKER */}
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={14} color="#4f46e5" />
                    <span>Offer Suggested Alternative Date & Time (Optional)</span>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Select New Date:</label>
                    <input
                      type="date"
                      value={suggestedDateInput}
                      onChange={(e) => setSuggestedDateInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        fontSize: 12,
                        fontWeight: 600,
                        outline: 'none',
                        background: '#fff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 }}>Select New Time Slot:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                      {['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'].map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSuggestedTimeInput(slot)}
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: '6px 4px',
                            borderRadius: 6,
                            border: '1px solid #cbd5e1',
                            background: suggestedTimeInput === slot ? '#4f46e5' : '#fff',
                            color: suggestedTimeInput === slot ? '#fff' : '#334155',
                            cursor: 'pointer'
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleConfirmDecline}
                  disabled={declining}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#ef4444',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  {declining ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>{declining ? "Sending..." : "Confirm & Send WhatsApp/Email"}</span>
                </motion.button>

                <button
                  type="button"
                  onClick={() => setDeclineModal(null)}
                  disabled={declining}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
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