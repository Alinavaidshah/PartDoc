import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  bookAppointment,
  checkAppointmentStatus,
  resetBookingState
} from '../features/appointment/appointmentSlice';
import {
  Calendar, Clock, User, Phone, Mail, Laptop, ClipboardList,
  CheckCircle, Search, Key, ShieldCheck, Clock3, XCircle, ChevronLeft, ChevronRight, Wrench, Sparkles, CheckCircle2
} from 'lucide-react';

const Appointment = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    bookingLoading,
    bookingSuccess,
    bookingData,
    bookingError,
    statusLoading,
    statusData,
    statusError,
  } = useSelector((state) => state.appointment);

  const [activeTab, setActiveTab] = useState('book');
  const [formData, setFormData] = useState({
    name: '', phone: '', customerEmail: '', deviceModel: '',
    issueDescription: '', appointmentDate: '', appointmentTime: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState({ appointmentId: '', name: '' });

  // Auto-fill from URL query params (e.g. from Home page estimator widget)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const device = params.get('device');
    const part = params.get('part');
    if (device || part) {
      setFormData(prev => ({
        ...prev,
        deviceModel: device ? `${device} Device` : prev.deviceModel,
        issueDescription: part ? `Need replacement / repair for: ${part}` : prev.issueDescription
      }));
    }
  }, [location.search]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSearchChange = (e) => setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(bookAppointment(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setFormData({
          name: '', phone: '', customerEmail: '', deviceModel: '',
          issueDescription: '', appointmentDate: '', appointmentTime: ''
        });
      }
    });
  };

  const handleCheckStatus = (e) => {
    e.preventDefault();
    dispatch(checkAppointmentStatus(searchQuery));
  };

  const getStatusDetails = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'approved':
        return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, msg: 'Your appointment has been approved! Our technical team will contact you shortly.' };
      case 'denied':
        return { color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', icon: <XCircle className="w-5 h-5 text-rose-400" />, msg: 'Appointment slot unavailable. Our team will contact you shortly to reschedule.' };
      default:
        return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: <Clock3 className="w-5 h-5 text-amber-400" />, msg: 'Your request is processing. A service manager will review your ticket shortly.' };
    }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];

  return (
    <div className="relative min-h-screen w-full text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans overflow-hidden">
      
      {/* BACKGROUND REPAIR WORKSHOP IMAGE WITH BLUR OVERLAY */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1600&q=80')` }}
      />
      <div className="fixed inset-0 z-0 bg-slate-950/75 backdrop-blur-md" />

      {/* HEADER SECTION */}
      <div className="relative z-10 text-center w-full max-w-xl mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-md shadow-lg">
          <Wrench className="w-4 h-4 text-[#D8973C]" />
          <span>Priority Tech Diagnostics & Hardware Repair</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-grotesk text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
        >
          Book Repair Appointment
        </motion.h1>

        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed">
          Schedule a priority diagnostic slot with our certified lab technicians for computer, laptop, or mobile repairs.
        </p>

        {/* TABS CONTROLLER */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 w-full sm:w-fit mx-auto mt-6 shadow-2xl backdrop-blur-xl">
          <button
            disabled={bookingLoading}
            onClick={() => { setActiveTab('book'); setShowDatePicker(false); setShowTimePicker(false); }}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
              activeTab === 'book'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            } disabled:opacity-50`}
          >
            Book Appointment
          </button>

          <button
            disabled={bookingLoading}
            onClick={() => { setActiveTab('status'); setShowDatePicker(false); setShowTimePicker(false); }}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
              activeTab === 'status'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            } disabled:opacity-50`}
          >
            Check Status
          </button>
        </div>
      </div>

      {/* CORE GLASSMORPHIC FORM CONTAINER */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="max-w-2xl w-full bg-slate-900/85 backdrop-blur-2xl border border-white/15 p-6 sm:p-10 rounded-3xl shadow-2xl relative z-10 text-white"
      >
        <AnimatePresence mode="wait">
          
          {/* TAB 1: BOOK MODULE */}
          {activeTab === 'book' && (
            <motion.div key="bookTab" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              
              {bookingLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-400/30 border-t-indigo-500 rounded-full animate-spin" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Submitting Appointment Ticket...</h3>
                  <p className="text-xs text-slate-400">Syncing details with repair lab server.</p>
                </div>
              ) : bookingSuccess ? (
                
                <div className="text-center py-6 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-xl"
                  >
                    <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-white font-grotesk">Appointment Booked Successfully!</h3>
                    <p className="text-slate-400 text-xs mt-1">Save this tracking reference ID to monitor repair progress anytime.</p>
                  </div>

                  <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 max-w-sm mx-auto flex flex-col items-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tracking Reference ID</span>
                    <code className="text-indigo-400 text-lg font-extrabold select-all bg-white/5 px-4 py-1.5 rounded-xl border border-white/10 shadow-sm">{bookingData?._id || 'SYS-TICKET-X92'}</code>
                  </div>

                  <div className={`p-4 border rounded-2xl max-w-md mx-auto flex items-center gap-3 ${getStatusDetails('Pending').color}`}>
                    <Clock3 className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-medium text-left leading-relaxed">{getStatusDetails('Pending').msg}</p>
                  </div>

                  <button
                    onClick={() => dispatch(resetBookingState())}
                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg"
                  >
                    Book Another Appointment
                  </button>
                </div>
              ) : (
                
                /* MAIN FORM */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="tel" name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all" />
                    </div>
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input type="email" name="customerEmail" required placeholder="Email Address (For Notifications)" value={formData.customerEmail} onChange={handleChange} className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>

                  <div className="relative">
                    <Laptop className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input type="text" name="deviceModel" required placeholder="Device Model (e.g. MacBook Pro M1, iPhone 14 Pro, Custom Gaming PC)" value={formData.deviceModel} onChange={handleChange} className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all" />
                  </div>

                  <div className="relative">
                    <ClipboardList className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea name="issueDescription" required rows="3" placeholder="Describe the hardware issue or component service required..." value={formData.issueDescription} onChange={handleChange} className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
                  </div>

                  {/* DATE & TIME PICKERS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* DATE PICKER */}
                    <div className="relative flex flex-col space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Appointment Date</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
                          className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white text-left focus:outline-none focus:border-indigo-500 transition-all flex items-center"
                        >
                          <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                          {formData.appointmentDate || "Select Preferred Date"}
                        </button>

                        <AnimatePresence>
                          {showDatePicker && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="w-full mt-2 sm:absolute sm:bottom-14 sm:left-0 sm:w-72 bg-slate-900 border border-white/15 rounded-2xl p-4 shadow-2xl z-50 origin-bottom-left"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-white">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                                <div className="flex gap-1">
                                  <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1 hover:bg-white/10 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                                  <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1 hover:bg-white/10 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                                </div>
                              </div>

                              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-1">
                                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                              </div>

                              <div className="grid grid-cols-7 gap-1 text-center">
                                {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                  const day = i + 1;
                                  const formattedDate = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                  return (
                                    <button
                                      key={day}
                                      type="button"
                                      onClick={() => { setFormData({ ...formData, appointmentDate: formattedDate }); setShowDatePicker(false); }}
                                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${formData.appointmentDate === formattedDate ? 'bg-indigo-600 text-white' : 'hover:bg-white/10 text-slate-300'}`}
                                    >
                                      {day}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* TIME PICKER */}
                    <div className="relative flex flex-col space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time Slot</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
                          className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white text-left focus:outline-none focus:border-indigo-500 transition-all flex items-center"
                        >
                          <Clock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                          {formData.appointmentTime || "Select Preferred Time"}
                        </button>

                        <AnimatePresence>
                          {showTimePicker && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="w-full mt-2 sm:absolute sm:bottom-14 sm:right-0 sm:w-64 bg-slate-900 border border-white/15 rounded-2xl p-4 shadow-2xl z-50 origin-bottom-right"
                            >
                              <div className="grid grid-cols-2 gap-2">
                                {timeSlots.map((slot) => (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => { setFormData({ ...formData, appointmentTime: slot }); setShowTimePicker(false); }}
                                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${formData.appointmentTime === slot ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'}`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                  </div>

                  {bookingError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center font-medium">
                      {bookingError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-xl"
                  >
                    Confirm Repair Appointment
                  </button>
                </form>
              )}

            </motion.div>
          )}

          {/* TAB 2: STATUS MODULE */}
          {activeTab === 'status' && (
            <motion.div key="statusTab" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <form onSubmit={handleCheckStatus} className="space-y-4 mb-6">
                <div className="relative">
                  <Key className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input type="text" name="appointmentId" placeholder="Appointment Reference ID" value={searchQuery.appointmentId} onChange={handleSearchChange} className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input type="text" name="name" placeholder="Or Customer Name" value={searchQuery.name} onChange={handleSearchChange} className="w-full bg-slate-950/70 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all" />
                </div>

                <button type="submit" disabled={statusLoading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2">
                  {statusLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Check Appointment Status</span>
                </button>
              </form>

              {statusError && <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center font-medium">{statusError}</div>}

              {statusData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-slate-950/80 border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs text-slate-400 font-bold uppercase">Customer: {statusData.name}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${getStatusDetails(statusData.status).color}`}>
                      {statusData.status || 'Pending'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">Device: <b>{statusData.deviceModel}</b></div>
                  <div className="text-xs text-slate-400">Date: {statusData.appointmentDate} at {statusData.appointmentTime}</div>
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${getStatusDetails(statusData.status).color}`}>
                    {getStatusDetails(statusData.status).icon}
                    <span>{getStatusDetails(statusData.status).msg}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Appointment;
