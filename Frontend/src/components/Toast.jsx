import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react'; // Make sure lucide-react is installed

const Toast = ({ message, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // 3 seconds baad auto hide
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className="fixed top-24 right-6 z-[100] bg-[#152227] border border-[#D8973C]/30 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 w-80"
        >
          <div className="text-[#D8973C]">
            <CheckCircle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Success!</h4>
            <p className="text-xs text-gray-400">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;