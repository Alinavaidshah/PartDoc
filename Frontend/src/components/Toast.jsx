import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const isError = type === 'error';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`fixed top-24 right-6 z-[100] p-4 rounded-2xl shadow-2xl flex items-start gap-3 max-w-sm w-full border backdrop-blur-xl ${
            isError
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-100'
              : 'bg-slate-900/95 border-emerald-500/40 text-white'
          }`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className={`p-1 rounded-xl flex-shrink-0 ${
              isError ? 'text-rose-400 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'
            }`}
          >
            {isError ? <XCircle size={22} /> : <CheckCircle2 size={22} />}
          </motion.div>

          <div className="flex-1 pr-2">
            <h4 className="font-grotesk font-extrabold text-xs uppercase tracking-wider text-slate-200">
              {isError ? 'Attention Required' : 'Success'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-medium">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;