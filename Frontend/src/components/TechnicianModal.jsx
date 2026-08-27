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
      {/* RIGHT SIDE COLLAPSIBLE TECHNICIAN TRIGGER TAB */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* CLOSED STATE: SLEEK RIGHT-EDGE BADGE WITH ARROW & HIRING ICON */
            <motion.button
              key="closed-tab"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              whileHover={{ x: -4 }}
              onClick={() => setIsExpanded(true)}
              className="bg-slate-900/95 hover:bg-slate-900 text-white pl-3.5 pr-2.5 py-3 rounded-l-2xl shadow-2xl border-y border-l border-indigo-500/40 backdrop-blur-md flex items-center gap-2 group cursor-pointer transition-all"
              aria-label="Open Technician Hiring Info"
            >
              <ChevronLeft size={16} className="text-indigo-400 group-hover:-translate-x-1 transition-transform" />
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Wrench size={14} />
              </div>
              <div className="flex flex-col text-left pr-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>Hiring</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </span>
              </div>
            </motion.button>
          ) : (
            /* OPEN / EXPANDED STATE: SLIDES OUT WITH FULL DETAILS AND APPLY BUTTON */
            <motion.div
              key="expanded-tab"
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="bg-slate-900/95 text-white pl-4 pr-3 py-3.5 rounded-l-3xl shadow-2xl border-y border-l border-indigo-500/50 backdrop-blur-xl flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                <Wrench size={16} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5 leading-none">
                  <span>Technicians Required</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </span>
                <span className="text-[10px] text-indigo-300 font-semibold mt-1">Karachi All Over</span>
              </div>
              <button
                onClick={() => { setIsOpen(true); setIsExpanded(false); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-md transition-colors ml-1 cursor-pointer"
              >
                Apply Now
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Collapse tab"
              >
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
