import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export default function AestheticLoader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md text-slate-900 font-sans">
      {/* Simple Minimal Spinner Ring */}
      <div className="relative flex items-center justify-center mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 shadow-sm"
        />
        <div className="absolute bg-indigo-50 p-2.5 rounded-full text-indigo-600">
          <Cpu className="w-5 h-5" />
        </div>
      </div>

      {/* Brand & Text */}
      <div className="font-grotesk font-extrabold text-lg text-slate-900 tracking-wider">
        PART<span className="text-indigo-600">DOC</span>
      </div>
      <p className="text-xs text-slate-500 font-medium mt-1 animate-pulse">
        {text}
      </p>
    </div>
  );
}
