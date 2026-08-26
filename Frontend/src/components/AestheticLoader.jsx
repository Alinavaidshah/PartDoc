import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wrench, ShieldCheck } from 'lucide-react';

export default function AestheticLoader({ text = "Loading Experience..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090e] text-white selection:bg-[#D8973C] selection:text-black overflow-hidden">
      {/* Radial Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-indigo-600/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Glassmorphic Animated Ring */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Spinning Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-28 h-28 rounded-full border-2 border-transparent border-t-[#D8973C] border-r-indigo-500/40 shadow-[0_0_30px_rgba(216,151,60,0.2)]"
        />

        {/* Inner Counter-Spinning Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-20 h-20 rounded-full border-2 border-transparent border-b-[#D8973C]/80 border-l-purple-500/40"
        />

        {/* Center Glowing Icon */}
        <motion.div
          animate={{ scale: [0.92, 1.08, 0.92] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-14 h-14 rounded-2xl bg-gradient-to-br from-[#121926] to-[#07090e] border border-white/10 flex items-center justify-center shadow-xl backdrop-blur-md"
        >
          <Sparkles className="w-7 h-7 text-[#D8973C] drop-shadow-[0_0_10px_rgba(216,151,60,0.5)]" />
        </motion.div>
      </div>

      {/* Brand Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-2"
      >
        <span className="font-grotesk text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D8973C]">
          PART<span className="text-[#D8973C]">DOC</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-[#D8973C] border border-amber-500/20">
          PRO
        </span>
      </motion.div>

      {/* Loading Text */}
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xs text-slate-400 font-mono tracking-wider flex items-center gap-2"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>{text}</span>
      </motion.p>
    </div>
  );
}
