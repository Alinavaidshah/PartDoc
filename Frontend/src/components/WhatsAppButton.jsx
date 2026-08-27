import React from 'react';
import { MessageCircle, ArrowRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  const phoneNumber = '03102193694';
  const cleanNumber = '923102193694';
  const message = encodeURIComponent('Hi Digi Dude! I have an inquiry regarding tech parts / repair services.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <div className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 border-t border-emerald-400/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Left: Icon + Text */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30">
              <MessageCircle className="w-6 h-6 text-white fill-white" />
            </div>
            {/* Pulsing online dot */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </div>

          <div>
            <p className="text-white font-extrabold text-sm sm:text-base leading-tight">
              Chat with Digi Dude on WhatsApp
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3 h-3 text-emerald-100" />
              <p className="text-emerald-100 text-xs sm:text-sm font-semibold">
                {phoneNumber} · Usually replies within minutes
              </p>
            </div>
          </div>
        </div>

        {/* Right: CTA Button */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with Digi Dude"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg transition-all border border-white/60 whitespace-nowrap flex-shrink-0"
        >
          <MessageCircle className="w-5 h-5 fill-emerald-600 stroke-none" />
          <span>Start Chat Now</span>
          <ArrowRight className="w-4 h-4" />
        </motion.a>

      </div>
    </div>
  );
};

export default WhatsAppButton;
