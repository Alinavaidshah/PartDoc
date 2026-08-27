import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const phoneNumber = '03102193694';
  const cleanNumber = '923102193694';
  const message = encodeURIComponent('Hi Digi Dude! I have an inquiry regarding tech parts / repair services.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip Badge */}
      <motion.div
        initial={{ opacity: 0, x: 10, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="hidden sm:flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl border border-slate-800"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Chat with Digi Dude ({phoneNumber})</span>
      </motion.div>

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Digi Dude"
        className="relative group bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        {/* Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-pulse blur-sm group-hover:bg-emerald-500/60" />
        
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 fill-white stroke-emerald-600" />

        {/* Unread Alert Counter */}
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md">
          1
        </span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
