 import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { useDispatch, useSelector } from 'react-redux';

import {

  bookAppointment,

  checkAppointmentStatus,

  resetBookingState

} from '../features/appointment/appointmentSlice';

import Antigravity from './Antigravity';

import {

  Calendar, Clock, User, Phone, Mail, Laptop, ClipboardList,

  CheckCircle, Search, Key, ShieldCheck, Clock3, XCircle, ChevronLeft, ChevronRight

} from 'lucide-react';



const Appointment = () => {

  const dispatch = useDispatch();



  // Redux Global State

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

        return { color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: <ShieldCheck className="w-5 h-5 text-green-400" />, msg: 'Your booking has been approved! Our technical engineering crew will contact you in a few moments.' };

      case 'denied':

        return { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: <XCircle className="w-5 h-5 text-red-400" />, msg: 'Appointment slot unavailable. Our team will contact you in a few moments to reschedule.' };

      default:

        return { color: 'text-[#ff9100] bg-[#ff9100]/10 border-[#ff9100]/20', icon: <Clock3 className="w-5 h-5 text-[#ff9100]" />, msg: 'Your slot request is processing. A service manager will review your ticket shortly.' };

    }

  };



  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];



  return (

    <div className="min-h-screen w-full bg-[#06060b] text-white pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center font-sans relative overflow-x-hidden selection:bg-[#ff9100]/30">

     

      {/* ANTIGRAVITY BACKGROUND */}

      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto opacity-30">

        <Antigravity count={380} magnetRadius={13} ringRadius={10.5} color="#ff9100" particleSize={1.5} />

      </div>



      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#06060b]/40 to-[#06060b] pointer-events-none z-0" />



      {/* HEADER SECTION */}

      <div className="text-center w-full max-w-xl mb-8 sm:mb-10 z-10 relative px-2">

        <motion.h2

          initial={{ opacity: 0, y: -20 }}

          animate={{ opacity: 1, y: 0 }}

          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#ff9100] via-white to-[#ffb74d] uppercase drop-shadow-[0_0_30px_rgba(255,145,0,0.15)]"

        >

          Hey User!

        </motion.h2>

        <p className="text-gray-400 text-xs sm:text-sm md:text-base mt-2 font-medium tracking-wide max-w-sm sm:max-w-md mx-auto px-4 leading-relaxed">

          Describe your issue & schedule a premium diagnostic slot.

        </p>



        {/* CONTROLLER RESPONSIVE TABS */}

        <div className="flex bg-white/[0.03] p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-white/10 w-full sm:w-fit mx-auto mt-6 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">

          <button

            disabled={bookingLoading}

            onClick={() => { setActiveTab('book'); setShowDatePicker(false); setShowTimePicker(false); }}

            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'book' ? 'bg-gradient-to-r from-[#ff9100] to-[#ff6d00] text-[#0a0a0f] shadow-[0_0_15px_rgba(255,145,0,0.35)] font-black scale-100 sm:scale-105' : 'text-gray-400 hover:text-white'} disabled:opacity-50`}

          >

            Book Appointment

          </button>

          <button

            disabled={bookingLoading}

            onClick={() => { setActiveTab('status'); setShowDatePicker(false); setShowTimePicker(false); }}

            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'status' ? 'bg-gradient-to-r from-[#ff9100] to-[#ff6d00] text-[#0a0a0f] shadow-[0_0_15px_rgba(255,145,0,0.35)] font-black scale-100 sm:scale-105' : 'text-gray-400 hover:text-white'} disabled:opacity-50`}

          >

            Check Status

          </button>

        </div>

      </div>



      {/* CORE GLASSMORPHIC CONTAINER */}

      <motion.div

        layout

        transition={{ type: "spring", stiffness: 200, damping: 25 }}

        className="max-w-2xl w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative z-10 before:absolute before:inset-0 before:rounded-2xl sm:before:rounded-[32px] before:p-[1px] before:bg-gradient-to-b before:from-white/10 before:to-transparent before:-z-10"

      >

        <AnimatePresence mode="wait">

         

          {/* TAB 1: BOOK MODULE */}

          {activeTab === 'book' && (

            <motion.div key="bookTab" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>

             

              {/* INTERMEDIATE LOADING SCREEN NODE */}

              {bookingLoading ? (

                <motion.div

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}

                  exit={{ opacity: 0 }}

                  className="flex flex-col items-center justify-center py-16 space-y-6"

                >

                  <div className="relative w-16 h-16 flex items-center justify-center">

                    <motion.div

                      animate={{ rotate: 360 }}

                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}

                      className="w-full h-full border-2 border-[#ff9100]/20 border-t-[#ff9100] rounded-full absolute"

                    />

                    <Clock3 className="w-6 h-6 text-[#ff9100] animate-pulse" />

                  </div>

                  <div className="text-center space-y-1">

                    <h3 className="text-sm font-bold tracking-widest uppercase text-white">Locking In Status Node...</h3>

                    <p className="text-[10px] text-gray-500 tracking-wide">Syncing details with centralized ledger infrastructure.</p>

                  </div>

                </motion.div>

              ) : bookingSuccess ? (

                /* SUCCESS LOG WINDOW */

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 sm:py-8 space-y-5 sm:space-y-6">

                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#ff9100]/10 border border-[#ff9100]/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,145,0,0.25)]">

                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#ff9100]" />

                  </div>

                  <div>

                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">Appointment Log Locked In!</h3>

                    <p className="text-gray-400 text-[10px] sm:text-xs mt-1.5">Save this tracking ID to check verification status later.</p>

                  </div>

                 

                  <div className="bg-black/40 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 max-w-sm mx-auto flex flex-col items-center justify-center space-y-2 relative overflow-hidden group">

                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500">Tracking Reference ID</span>

                    <code className="text-[#ff9100] text-base sm:text-lg font-black tracking-widest select-all bg-white/[0.02] px-3 sm:px-4 py-1.5 rounded-lg sm:rounded-xl border border-white/10">{bookingData?._id || 'SYS-TICKET-X92'}</code>

                  </div>



                  <div className={`p-3.5 sm:p-4 border rounded-xl sm:rounded-2xl max-w-md mx-auto flex items-start sm:items-center gap-3 ${getStatusDetails('Pending').color}`}>

                    <Clock3 className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />

                    <p className="text-[11px] sm:text-xs font-medium text-left leading-relaxed">{getStatusDetails('Pending').msg}</p>

                  </div>



                  <button

                    onClick={() => dispatch(resetBookingState())}

                    className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-white/10 transition-all active:scale-95"

                  >

                    Create New Form

                  </button>

                </motion.div>

              ) : (

                /* MAIN FORM WINDOW */

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                    <div className="relative group">

                      <User className="absolute left-4 top-4 w-4 h-4 text-gray-500 group-focus-within:text-[#ff9100] transition-colors" />

                      <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm focus:outline-none focus:border-[#ff9100]/40 focus:bg-black/40 transition-all text-white placeholder-gray-600" />

                    </div>

                    <div className="relative group">

                      <Phone className="absolute left-4 top-4 w-4 h-4 text-gray-500 group-focus-within:text-[#ff9100] transition-colors" />

                      <input type="tel" name="phone" required placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm focus:outline-none focus:border-[#ff9100]/40 focus:bg-black/40 transition-all text-white placeholder-gray-600" />

                    </div>

                  </div>



                  <div className="relative group">

                    <Mail className="absolute left-4 top-4 w-4 h-4 text-gray-500 group-focus-within:text-[#ff9100] transition-colors" />

                    <input type="email" name="customerEmail" required placeholder="Email Address (For Notifications)" value={formData.customerEmail} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm focus:outline-none focus:border-[#ff9100]/40 focus:bg-black/40 transition-all text-white placeholder-gray-600" />

                  </div>



                  <div className="relative group">

                    <Laptop className="absolute left-4 top-4 w-4 h-4 text-gray-500 group-focus-within:text-[#ff9100] transition-colors" />

                    <input type="text" name="deviceModel" required placeholder="Device Model (e.g., iPhone 13 Pro, Custom Ryzen PC)" value={formData.deviceModel} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm focus:outline-none focus:border-[#ff9100]/40 focus:bg-black/40 transition-all text-white placeholder-gray-600" />

                  </div>



                  <div className="relative group">

                    <ClipboardList className="absolute left-4 top-4 w-4 h-4 text-gray-500 group-focus-within:text-[#ff9100] transition-colors" />

                    <textarea name="issueDescription" required rows="3" placeholder="Describe your issue in detail..." value={formData.issueDescription} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm focus:outline-none focus:border-[#ff9100]/40 focus:bg-black/40 transition-all text-white placeholder-gray-600 resize-none" />

                  </div>



                  {/* ACCORDION PICKERS */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                   

                    {/* 1. DATE PICKER */}

                    <div className="relative flex flex-col space-y-1.5">

                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-1">Select Date</span>

                      <div className="relative">

                        <button

                          type="button"

                          onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}

                          className={`w-full bg-black/20 border ${formData.appointmentDate ? 'border-[#ff9100]/30 text-white' : 'border-white/10 text-gray-400'} rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-left focus:outline-none transition-all flex items-center hover:bg-black/40`}

                        >

                          <Calendar className="absolute left-4 top-4 w-4 h-4 text-gray-500" />

                          {formData.appointmentDate || "Pick Custom Date"}

                        </button>



                        <AnimatePresence>

                          {showDatePicker && (

                            <motion.div

                              initial={{ opacity: 0, y: 15, scale: 0.95 }}

                              animate={{ opacity: 1, y: 0, scale: 1 }}

                              exit={{ opacity: 0, y: 15, scale: 0.95 }}

                              transition={{ duration: 0.2, ease: "easeOut" }}

                              className="w-full mt-2 sm:mt-0 sm:absolute sm:bottom-16 sm:left-0 sm:w-72 bg-[#0e0e16] border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 backdrop-blur-2xl origin-bottom-left"

                            >

                              <div className="flex justify-between items-center mb-3">

                                <span className="text-xs font-bold text-white">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>

                                <div className="flex gap-1">

                                  <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1 hover:bg-white/5 rounded"><ChevronLeft className="w-4 h-4" /></button>

                                  <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1 hover:bg-white/5 rounded"><ChevronRight className="w-4 h-4" /></button>

                                </div>

                              </div>

                              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-500 mb-1">

                                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>

                              </div>

                              <div className="grid grid-cols-7 gap-1 text-center">

                                {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}

                                {Array.from({ length: daysInMonth }).map((_, i) => {

                                  const day = i + 1;

                                  return (

                                    <button

                                      key={`day-${day}`}

                                      type="button"

                                      onClick={() => {

                                        setFormData({ ...formData, appointmentDate: `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` });

                                        setShowDatePicker(false);

                                      }}

                                      className="p-1.5 text-xs rounded-lg hover:bg-[#ff9100]/20 hover:text-white transition-colors text-gray-300 font-medium"

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



                    {/* 2. TIME PICKER */}

                    <div className="relative flex flex-col space-y-1.5">

                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-1">Select Time</span>

                      <div className="relative">

                        <button

                          type="button"

                          onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}

                          className={`w-full bg-black/20 border ${formData.appointmentTime ? 'border-[#ff9100]/30 text-white' : 'border-white/10 text-gray-400'} rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm text-left focus:outline-none transition-all flex items-center hover:bg-black/40`}

                        >

                          <Clock className="absolute left-4 top-4 w-4 h-4 text-gray-500" />

                          {formData.appointmentTime || "Select Time Window"}

                        </button>



                        <AnimatePresence>

                          {showTimePicker && (

                            <motion.div

                              initial={{ opacity: 0, y: 15, scale: 0.95 }}

                              animate={{ opacity: 1, y: 0, scale: 1 }}

                              exit={{ opacity: 0, y: 15, scale: 0.95 }}

                              transition={{ duration: 0.2, ease: "easeOut" }}

                              className="w-full mt-2 sm:mt-0 sm:absolute sm:bottom-16 sm:right-0 sm:w-64 bg-[#0e0e16] border border-white/10 rounded-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 backdrop-blur-2xl grid grid-cols-2 gap-2 origin-bottom-right"

                            >

                              {timeSlots.map((slot) => (

                                <button

                                  key={slot}

                                  type="button"

                                  onClick={() => { setFormData({ ...formData, appointmentTime: slot }); setShowTimePicker(false); }}

                                  className="py-2.5 text-xs text-center bg-white/[0.02] border border-white/10 hover:border-[#ff9100]/40 hover:bg-[#ff9100]/10 rounded-xl transition-all font-medium text-gray-300"

                                >

                                  {slot}

                                </button>

                              ))}

                            </motion.div>

                          )}

                        </AnimatePresence>

                      </div>

                    </div>



                  </div>



                  {bookingError && <p className="text-red-400 text-xs font-semibold pl-1">{bookingError}</p>}



                  <motion.button

                    type="submit"

                    whileHover={{ scale: 1.01, boxShadow: "0px 0px 25px rgba(255, 145, 0, 0.4)" }}

                    whileTap={{ scale: 0.99 }}

                    className="w-full py-4 mt-2 bg-gradient-to-r from-[#ff9100] to-[#ff6d00] text-[#0a0a0f] rounded-xl font-extrabold tracking-widest uppercase text-xs shadow-[0_0_15px_rgba(255,145,0,0.2)] transition-all duration-300 relative overflow-hidden flex items-center justify-center group"

                  >

                    <span className="relative z-10 flex items-center gap-2">

                      Lock In Appointment

                    </span>

                  </motion.button>

                </form>

              )}

            </motion.div>

          )}



          {/* TAB 2: CHECK STATUS MODULE */}

          {activeTab === 'status' && (

            <motion.div key="statusTab" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }} className="space-y-6">

             

              {statusLoading ? (

                /* INTERMEDIATE STATUS SEARCHING LOADER */

                <motion.div

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}

                  exit={{ opacity: 0 }}

                  className="flex flex-col items-center justify-center py-12 space-y-6"

                >

                  <div className="relative w-14 h-14 flex items-center justify-center">

                    <motion.div

                      animate={{ rotate: -360 }}

                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}

                      className="w-full h-full border-2 border-[#ff9100]/10 border-b-[#ff9100] rounded-full absolute"

                    />

                    <Search className="w-5 h-5 text-[#ff9100] animate-pulse" />

                  </div>

                  <div className="text-center space-y-1">

                    <h3 className="text-xs font-bold tracking-widest uppercase text-white">Searching Ledger Node...</h3>

                    <p className="text-[9px] text-gray-500 tracking-wide">Fetching token references from decentralized database.</p>

                  </div>

                </motion.div>

              ) : (

                <>

                  <div className="text-center max-w-sm mx-auto mb-2">

                    <h3 className="text-lg sm:text-xl font-black tracking-wide">Query Appointment Log</h3>

                    <p className="text-gray-400 text-[11px] sm:text-xs mt-1">Input your credential parameters below to track active progress.</p>

                  </div>



                  <form onSubmit={handleCheckStatus} className="space-y-4 max-w-md mx-auto">

                    <div className="relative group">

                      <User className="absolute left-4 top-4 w-4 h-4 text-gray-500" />

                      <input type="text" name="name" required placeholder="Registered Full Name" value={searchQuery.name} onChange={handleSearchChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm focus:outline-none focus:border-[#ff9100]/40 focus:bg-black/40 transition-all text-white placeholder-gray-600" />

                    </div>

                    <div className="relative group">

                      <Key className="absolute left-4 top-4 w-4 h-4 text-gray-500" />

                      <input type="text" name="appointmentId" required placeholder="Appointment ID" value={searchQuery.appointmentId} onChange={handleSearchChange} className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-xs sm:text-sm focus:outline-none focus:border-[#ff9100]/40 focus:bg-black/40 transition-all text-white placeholder-gray-600" />

                    </div>



                    <motion.button

                      type="submit"

                      whileHover={{ scale: 1.01, boxShadow: "0px 0px 20px rgba(255, 145, 0, 0.3)" }}

                      whileTap={{ scale: 0.99 }}

                      className="w-full py-4 bg-gradient-to-r from-[#ff9100] to-[#ff6d00] text-[#0a0a0f] rounded-xl font-extrabold tracking-wider uppercase text-xs shadow-[0_0_15px_rgba(255,145,0,0.15)] transition-all flex items-center justify-center gap-2 relative overflow-hidden"

                    >

                      <Search className="w-4 h-4 relative z-10" />

                      <span className="relative z-10">Verify Status</span>

                    </motion.button>

                  </form>



                  {/* OUTPUT PANEL */}

                  {(statusData || statusError) && (

                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-white/10 max-w-md mx-auto">

                      {statusError ? (

                        <p className="text-red-400 text-xs font-semibold text-center bg-red-500/5 p-4 rounded-xl sm:rounded-2xl border border-red-500/10">{statusError}</p>

                      ) : statusData ? (

                        <div className="bg-black/20 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-4">

                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

                            <span className="text-xs text-gray-400 font-medium">Ticket Holder: <b className="text-white ml-1 font-bold">{statusData.name}</b></span>

                            <div className={`w-fit px-3 py-1 border text-[10px] font-black rounded-lg flex items-center gap-1.5 ${getStatusDetails(statusData.status).color}`}>

                              {getStatusDetails(statusData.status).icon}

                              <span className="uppercase tracking-widest">{statusData.status}</span>

                            </div>

                          </div>



                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-y border-white/10 py-3 text-gray-400">

                            <div>Device Log: <span className="text-white block font-semibold mt-0.5">{statusData.deviceModel}</span></div>

                            <div>Schedule Node: <span className="text-white block font-semibold mt-0.5">{statusData.appointmentDate} @ {statusData.appointmentTime}</span></div>

                          </div>



                          <div className="p-3.5 border rounded-xl flex items-start gap-2.5 text-xs leading-relaxed bg-white/[0.01] border-white/10">

                            <p className="text-gray-300 font-medium">{getStatusDetails(statusData.status).msg}</p>

                          </div>

                        </div>

                      ) : null}

                    </motion.div>

                  )}

                </>

              )}

            </motion.div>

          )}



        </AnimatePresence>

      </motion.div>

    </div>

  );

};



export default Appointment; 

