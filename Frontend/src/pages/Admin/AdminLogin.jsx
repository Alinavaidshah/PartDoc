import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleDirectAccess = () => {
    localStorage.setItem('adminInfo', JSON.stringify({ name: 'Admin', isAdmin: true, token: 'direct-access-token' }));
    navigate('/admin/dashboard');
  };

  useEffect(() => {
    // Auto redirect to dashboard
    handleDirectAccess();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm p-8 bg-slate-800 border border-slate-700 rounded-3xl text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Admin Control Panel</h2>
        <p className="text-slate-400 text-xs mb-6">Direct access mode enabled. Redirecting to inventory & management dashboard...</p>

        <button 
          onClick={handleDirectAccess}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md"
        >
          <span>Open Admin Panel Directly</span>
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
};

export default AdminLogin;