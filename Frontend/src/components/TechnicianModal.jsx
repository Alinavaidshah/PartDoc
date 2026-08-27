import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, X, CheckCircle2, User, Phone, Briefcase, MapPin, Sparkles, Send } from 'lucide-react';

const TechnicianModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialization: 'Mobile OLED & Screen Repair',
    experience: '2-3 Years',
    area: 'Saddar / Karachi Central'
  });

  // Auto pop-up callout nudge after 30 seconds if not opened yet
  const [showCallout, setShowCallout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCallout(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setSubmitted(true);
    setTimeout(() => {
      // Keep thank you screen for 3 seconds then close
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setFormData({
          name: '',
          phone: '',
          specialization: 'Mobile OLED & Screen Repair',
          experience: '2-3 Years',
          area: 'Saddar / Karachi Central'
        });
      }, 3500);
    }, 500);
  };

  return (
    <>
      {/* FLOATING BADGE BUTTON (BOTTOM-LEFT) */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <motion.button
          onClick={() => { setIsOpen(true); setShowCallout(false); }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2.5 transition-all cursor-pointer"
        >
          {/* Glowing Ring */}
          <span className="absolute -inset-1 rounded-full bg-indigo-500/30 animate-pulse blur-sm group-hover:bg-indigo-500/50" />

          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Wrench size={15} />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>Technicians Required</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <span className="text-[10px] text-indigo-300 font-semibold">Karachi All Over (Apply Now)</span>
          </div>
        </motion.button>

        {/* PERIODIC CALLOUT NUDGE BADGE */}
        <AnimatePresence>
          {showCallout && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              className="hidden lg:flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl border border-indigo-500 relative"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span>Are you a repair expert? Join us!</span>
              <button
                onClick={() => setShowCallout(false)}
                className="ml-1 text-indigo-200 hover:text-white"
              >
                <X size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* GLASSMORPHISM FORM MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-0"
            />

            {/* Glassmorphism Container with Repair Workshop Background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative z-10 w-full max-w-lg bg-slate-900/85 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-white my-auto"
            >
              {/* Background Repair Image with Soft Dark Gradient Overlay */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 z-0 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors border border-slate-700 cursor-pointer"
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
                      className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30"
                    >
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                    </motion.div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold text-white font-grotesk">
                        Thank You For Applying For Digi Dude! 🎉
                      </h3>
                      <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
                        Your application has been received. Our technical hiring team across Karachi will contact you on WhatsApp / Phone shortly.
                      </p>
                    </div>

                    <div className="pt-4 text-xs font-mono text-indigo-400">
                      Digi Dude Lab Hiring Team · Karachi
                    </div>
                  </div>
                ) : (
                  /* FORM INPUT STATE */
                  <div>
                    {/* Header */}
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={14} className="text-amber-400" />
                        <span>Karachi Lab Technician Recruitment</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-grotesk tracking-tight leading-tight">
                        Have Magic In Your Hands? 🛠️
                      </h2>
                      <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                        Join Digi Dude's expert technician network. Earn top competitive payouts for PC, laptop & mobile repairs across Karachi.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      
                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                          <User size={13} className="text-indigo-400" />
                          <span>Full Name</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Muhammad Ali"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
                        />
                      </div>

                      {/* Phone / WhatsApp */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                          <Phone size={13} className="text-emerald-400" />
                          <span>Phone / WhatsApp Number</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0300 1234567"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
                        />
                      </div>

                      {/* Specialization & Experience */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                            <Briefcase size={13} className="text-amber-400" />
                            <span>Primary Expertise</span>
                          </label>
                          <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Mobile OLED & Screen Repair">Mobile OLED & Screens</option>
                            <option value="Laptop Hardware & Chip-Level">Laptop Chip-Level & Motherboard</option>
                            <option value="Custom PC Building & Tuning">Custom PC Building & Liquid Cooling</option>
                            <option value="Precision Soldering & IC Repair">Precision Micro-Soldering</option>
                            <option value="General Software & Diagnostic">Software & Doorstep Diagnostic</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Experience</label>
                          <select
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                          >
                            <option value="1-2 Years">1-2 Years</option>
                            <option value="2-5 Years">2-5 Years</option>
                            <option value="5+ Years Expert">5+ Years (Senior Expert)</option>
                          </select>
                        </div>
                      </div>

                      {/* Area in Karachi */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                          <MapPin size={13} className="text-rose-400" />
                          <span>Preferred Location in Karachi</span>
                        </label>
                        <select
                          name="area"
                          value={formData.area}
                          onChange={handleChange}
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Saddar / Karachi Central">Saddar / Techno City Market</option>
                          <option value="Nazimabad / North Nazimabad">Nazimabad / North Nazimabad</option>
                          <option value="Gulshan-e-Iqbal / Johar">Gulshan-e-Iqbal / Johar</option>
                          <option value="DHA / Clifton">DHA / Clifton / Defense</option>
                          <option value="Malir / Korangi">Malir / Korangi / Shah Faisal</option>
                          <option value="All Karachi Doorstep">Available All Over Karachi (Mobile Technician)</option>
                        </select>
                      </div>

                      {/* Submit CTA Button */}
                      <button
                        type="submit"
                        className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        <Send size={15} className="group-hover:translate-x-1 transition-transform" />
                        <span>Submit Application</span>
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
