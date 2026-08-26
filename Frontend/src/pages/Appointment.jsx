import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import {
  bookAppointment,
  checkAppointmentStatus,
  resetBookingState
} from '../features/appointment/appointmentSlice';
import {
  Calendar, Clock, User, Phone, Mail, Laptop, ClipboardList,
  CheckCircle, Search, Key, ShieldCheck, Clock3, XCircle, ChevronLeft, ChevronRight, Wrench, Sparkles, CheckCircle2,
  MapPin, Tag, Lock
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
  const [faultTracingPrice, setFaultTracingPrice] = useState(899);
  const [formData, setFormData] = useState({
    name: '', phone: '', customerEmail: '', deviceModel: '',
    issueDescription: '', appointmentDate: '', appointmentTime: '',
    serviceType: 'Normal', address: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState({ appointmentId: '', name: '' });

  // Fetch dynamic fault tracing price from backend settings
  useEffect(() => {
    api.get('/appointments/settings')
      .then(res => {
        if (res.data?.faultTracingPrice) {
          setFaultTracingPrice(res.data.faultTracingPrice);
        }
      })
      .catch(err => console.error("Error loading settings:", err));
  }, []);

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
    const payload = {
      ...formData,
      price: formData.serviceType === 'Fault Tracing' ? faultTracingPrice : 0,
      issueDescription: formData.serviceType === 'Fault Tracing' && !formData.issueDescription
        ? 'Fault Tracing Of Your Device At Your Door Step'
        : formData.issueDescription
    };

    dispatch(bookAppointment(payload)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setFormData({
          name: '', phone: '', customerEmail: '', deviceModel: '',
          issueDescription: '', appointmentDate: '', appointmentTime: '',
          serviceType: 'Normal', address: ''
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
        return { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, msg: 'Your appointment has been approved! Our technical team will contact you shortly.' };
      case 'denied':
        return { color: 'text-rose-700 bg-rose-50 border-rose-200', icon: <XCircle className="w-5 h-5 text-rose-600" />, msg: 'Appointment slot unavailable. Our team will contact you shortly to reschedule.' };
      default:
        return { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: <Clock3 className="w-5 h-5 text-amber-600" />, msg: 'Your request is processing. A service manager will review your ticket shortly.' };
    }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-800 pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans overflow-hidden">
      
      {/* BACKGROUND REPAIR WORKSHOP IMAGE WITH LIGHT OVERLAY */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1600&q=80')` }}
      />

      {/* HEADER SECTION */}
      <div className="relative z-10 text-center w-full max-w-xl mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-4 shadow-sm">
          <Wrench className="w-4 h-4 text-indigo-600" />
          <span>Priority Tech Diagnostics & Hardware Repair</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-grotesk text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
        >
          Book Repair Appointment
        </motion.h1>

        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed">
          Schedule a priority diagnostic slot with our certified lab technicians for computer, laptop, or mobile repairs.
        </p>

        {/* TABS CONTROLLER */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 w-full sm:w-fit mx-auto mt-6 shadow-sm">
          <button
            disabled={bookingLoading}
            onClick={() => { setActiveTab('book'); setShowDatePicker(false); setShowTimePicker(false); }}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'book'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            } disabled:opacity-50`}
          >
            Book Appointment
          </button>

          <button
            disabled={bookingLoading}
            onClick={() => { setActiveTab('status'); setShowDatePicker(false); setShowTimePicker(false); }}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'status'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            } disabled:opacity-50`}
          >
            Check Status
          </button>
        </div>
      </div>

      {/* CORE CLEAN LIGHT FORM CONTAINER */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="max-w-2xl w-full bg-white/95 backdrop-blur-xl border border-slate-200 p-6 sm:p-10 rounded-3xl shadow-xl relative z-10 text-slate-900"
      >
        <AnimatePresence mode="wait">
          
          {/* TAB 1: BOOK MODULE */}
          {activeTab === 'book' && (
            <motion.div key="bookTab" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              
              {bookingLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Submitting Appointment Request...</h3>
                  <p className="text-xs text-slate-500">Syncing ticket details with repair lab server.</p>
                </div>
              ) : bookingSuccess ? (
                
                <div className="text-center py-6 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-md"
                  >
                    <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 font-grotesk">Appointment Booked Successfully!</h3>
                    <p className="text-slate-500 text-xs mt-1">Save this tracking reference ID to monitor repair progress anytime.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto flex flex-col items-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tracking Reference ID</span>
                    <code className="text-indigo-600 text-lg font-extrabold select-all bg-white px-4 py-1.5 rounded-xl border border-slate-200 shadow-sm">{bookingData?._id || 'SYS-TICKET-X92'}</code>
                  </div>

                  <div className={`p-4 border rounded-2xl max-w-md mx-auto flex items-center gap-3 ${getStatusDetails('Pending').color}`}>
                    <Clock3 className="w-5 h-5 flex-shrink-0 text-amber-600" />
                    <p className="text-xs font-medium text-left leading-relaxed">{getStatusDetails('Pending').msg}</p>
                  </div>

                  <button
                    onClick={() => dispatch(resetBookingState())}
                    className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                  >
                    Book Another Appointment
                  </button>
                </div>
              ) : (
                
                /* MAIN FORM */
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* SERVICE TYPE SELECTION */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">Select Service Option</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, serviceType: 'Normal' })}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          formData.serviceType === 'Normal'
                            ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-slate-900">Standard Lab Appointment</span>
                          {formData.serviceType === 'Normal' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <span className="text-[11px] text-slate-500">Bring device to our lab for priority diagnostic</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, serviceType: 'Fault Tracing' })}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          formData.serviceType === 'Fault Tracing'
                            ? 'bg-indigo-50/80 border-indigo-600 ring-2 ring-indigo-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Fault Tracing At Your Door Step
                          </span>
                          {formData.serviceType === 'Fault Tracing' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <span className="text-[11px] text-slate-500">Technician visits your doorstep for complete fault tracing</span>
                      </button>
                    </div>
                  </div>

                  {/* FAULT TRACING PRICE DISPLAY (NON-EDITABLE FOR USER) */}
                  {formData.serviceType === 'Fault Tracing' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                          <Tag className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">Doorstep Fault Tracing Fixed Fee</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            Official rate (Fixed by Admin Panel)
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-indigo-600 font-grotesk">Rs {faultTracingPrice}</span>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>

                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input type="tel" name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input type="email" name="customerEmail" required placeholder="Email Address (For Notifications)" value={formData.customerEmail} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all" />
                  </div>

                  <div className="relative">
                    <Laptop className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input type="text" name="deviceModel" required placeholder="Device Model (e.g. MacBook Pro M1, iPhone 14 Pro, Custom Gaming PC)" value={formData.deviceModel} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all" />
                  </div>

                  {/* COMPLETE ADDRESS FIELD FOR DOORSTEP FAULT TRACING */}
                  {formData.serviceType === 'Fault Tracing' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                      <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-amber-500" />
                      <textarea name="address" required rows="2" placeholder="Complete Doorstep Address (Street, House No, Area, City)..." value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border border-amber-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
                    </motion.div>
                  )}

                  <div className="relative">
                    <ClipboardList className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea name="issueDescription" required={formData.serviceType !== 'Fault Tracing'} rows="3" placeholder={formData.serviceType === 'Fault Tracing' ? "Optional: Describe device symptoms or issues observed..." : "Describe the hardware issue or component service required..."} value={formData.issueDescription} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
                  </div>

                  {/* DATE & TIME PICKERS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* DATE PICKER */}
                    <div className="relative flex flex-col space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Appointment Date</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 text-left focus:outline-none focus:border-indigo-600 transition-all flex items-center"
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
                              className="w-full mt-2 sm:absolute sm:bottom-14 sm:left-0 sm:w-72 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl z-50 origin-bottom-left"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-slate-900">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                                <div className="flex gap-1">
                                  <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                                  <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
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
                                      className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${formData.appointmentDate === formattedDate ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
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
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Time Slot</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 text-left focus:outline-none focus:border-indigo-600 transition-all flex items-center"
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
                              className="w-full mt-2 sm:absolute sm:bottom-14 sm:right-0 sm:w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl z-50 origin-bottom-right"
                            >
                              <div className="grid grid-cols-2 gap-2">
                                {timeSlots.map((slot) => (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => { setFormData({ ...formData, appointmentTime: slot }); setShowTimePicker(false); }}
                                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${formData.appointmentTime === slot ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'}`}
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
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center font-medium">
                      {bookingError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
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
                  <input type="text" name="appointmentId" placeholder="Appointment Reference ID" value={searchQuery.appointmentId} onChange={handleSearchChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition-all" />
                </div>

                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input type="text" name="name" placeholder="Or Customer Name" value={searchQuery.name} onChange={handleSearchChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition-all" />
                </div>

                <button type="submit" disabled={statusLoading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2">
                  {statusLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Check Appointment Status</span>
                </button>
              </form>

              {statusError && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center font-medium">{statusError}</div>}

              {statusData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs text-slate-700 font-bold uppercase">Customer: {statusData.name}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusDetails(statusData.status).color}`}>
                      {statusData.status || 'Pending'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700">Device: <b>{statusData.deviceModel}</b></div>
                  <div className="text-xs text-slate-500">Date: {statusData.appointmentDate} at {statusData.appointmentTime}</div>
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${getStatusDetails(statusData.status).color}`}>
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
