import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, X, CheckCircle2, User, Phone, Briefcase, Sparkles, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axiosConfig';

const TechnicianModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: 'Mobile OLED & Screen Repair',
    experience: '2-3 Years',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setSubmitting(true);
    try {
      await api.post('/technicians/apply', formData);
      setSubmitted(true);
      setSubmitting(false);

      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFormData({
          name: '',
          phone: '',
          specialization: 'Mobile OLED & Screen Repair',
          experience: '2-3 Years',
        });
      }, 3500);
    } catch (err) {
      setSubmitting(false);
      alert('Error submitting application: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      {/* BOTTOM-RIGHT HIRING TECHNICIAN TRIGGER */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="hiring-card"
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.92 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="bg-slate-900/95 text-white p-4 rounded-3xl shadow-2xl border border-indigo-500/50 backdrop-blur-xl flex flex-col gap-3 min-w-[280px] max-w-xs mb-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Wrench size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5 leading-none">
                      Technicians Required
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                    </span>
                    <span className="text-[10px] text-indigo-300 font-semibold mt-0.5">Karachi All Over</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                We are recruiting mobile and computer repair specialists across all areas of Karachi.
              </p>

              <button
                onClick={() => { setIsOpen(true); setIsExpanded(false); }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-2"
              >
                <span>Apply For Job Now</span>
                <Send size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM-RIGHT HIRING PILL BUTTON */}
        <motion.button
          onClick={() => setIsExpanded(prev => !prev)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="relative group bg-slate-900/95 hover:bg-slate-900 text-white pl-3.5 pr-4 py-3 rounded-2xl shadow-2xl border border-indigo-500/50 backdrop-blur-xl flex items-center gap-3 cursor-pointer transition-all"
          aria-label="Technicians Hiring Trigger"
        >
          {/* Subtle Glow Ring */}
          <span className="absolute -inset-0.5 rounded-2xl bg-indigo-500/30 animate-pulse blur-sm pointer-events-none" />

          {/* Left chevron arrow */}
          <motion.div
            animate={{ x: isExpanded ? 2 : [0, -3, 0] }}
            transition={{ repeat: isExpanded ? 0 : Infinity, duration: 1.8, ease: "easeInOut" }}
            className="text-indigo-400 flex-shrink-0"
          >
            <ChevronLeft size={16} />
          </motion.div>

          {/* Wrench Icon Badge */}
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
            <Wrench size={16} />
          </div>

          {/* Text Labels */}
          <div className="flex flex-col text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5 leading-none">
              <span>Hiring Technicians</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
            </span>
            <span className="text-[10px] text-indigo-300 font-semibold mt-1">Karachi All Over (Apply)</span>
          </div>
        </motion.button>
      </div>

      {/* LIGHT THEME FORM MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-0"
            />

            {/* Light Theme Glass Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative z-10 w-full max-w-lg bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-900 my-auto backdrop-blur-xl"
            >
              {/* Background Repair Image with Soft Light Overlay */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80')` }}
              />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="relative z-10">
                
                {submitted ? (
                  /* THANK YOU TICK ANIMATION STATE */
                  <div className="py-10 text-center space-y-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 15 }}
                      className="w-20 h-20 bg-emerald-50 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
                    </motion.div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold text-slate-900 font-grotesk">
                        Thank You For Applying For Digi Dude! 🎉
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                        Your application has been received. Our technical hiring team across Karachi will contact you on WhatsApp / Phone shortly.
                      </p>
                    </div>

                    <div className="pt-4 text-xs font-bold text-indigo-600">
                      Digi Dude Lab Hiring Team · Karachi
                    </div>
                  </div>
                ) : (
                  /* FORM INPUT STATE (LIGHT THEME) */
                  <div>
                    {/* Header */}
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Karachi Lab Technician Recruitment</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-grotesk tracking-tight leading-tight">
                        Have Magic In Your Hands? 🛠️
                      </h2>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
                        Join Digi Dude's expert technician network. Earn top competitive payouts for PC, laptop & mobile repairs across Karachi.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                          <User size={13} className="text-indigo-600" />
                          <span>Full Name</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Muhammad Ali"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
                        />
                      </div>

                      {/* Phone / WhatsApp */}
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                          <Phone size={13} className="text-emerald-600" />
                          <span>Phone / WhatsApp Number</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0300 1234567"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all"
                        />
                      </div>

                      {/* Specialization & Experience */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                            <Briefcase size={13} className="text-indigo-600" />
                            <span>Primary Expertise</span>
                          </label>
                          <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white font-semibold transition-all"
                          >
                            <option value="Mobile OLED & Screen Repair">Mobile OLED & Screens</option>
                            <option value="Laptop Hardware & Chip-Level">Laptop Chip-Level & Motherboard</option>
                            <option value="Custom PC Building & Tuning">Custom PC Building & Liquid Cooling</option>
                            <option value="Precision Soldering & IC Repair">Precision Micro-Soldering</option>
                            <option value="General Software & Diagnostic">Software & Doorstep Diagnostic</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">Experience</label>
                          <select
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white font-semibold transition-all"
                          >
                            <option value="1-2 Years">1-2 Years</option>
                            <option value="2-5 Years">2-5 Years</option>
                            <option value="5+ Years Expert">5+ Years (Senior Expert)</option>
                          </select>
                        </div>
                      </div>

                      {/* Submit CTA Button */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                      >
                        <Send size={15} className="group-hover:translate-x-1 transition-transform" />
                        <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
                      </button>

                    </form>
                  </div>
                )}

              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TechnicianModal;
