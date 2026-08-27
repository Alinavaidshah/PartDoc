import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, Key } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/auth/authSlice';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo || isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  const handleQuickFill = () => {
    const defaultCreds = { email: 'admin@digidude.com', password: 'admin123456' };
    setCredentials(defaultCreds);
    dispatch(loginUser(defaultCreds));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl z-10"
      >
        <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={28} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-1 text-center tracking-tight">Admin System Login</h2>
        <p className="text-slate-400 text-xs mb-6 text-center">Secure authentication required for dashboard management.</p>
        
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-2 text-xs font-semibold">
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
            <input 
              type="email" 
              placeholder="Admin Email" 
              required
              value={credentials.email}
              className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={credentials.password}
              className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Login To Dashboard"}
          </button>
        </div>

        {/* Quick Credentials Info Box */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 text-left bg-slate-900/60 p-3.5 rounded-2xl border border-slate-700/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1">
            <Key size={14} />
            <span>Default Super Admin Credentials:</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono space-y-0.5">
            <div>Email: <b className="text-white">admin@digidude.com</b></div>
            <div>Password: <b className="text-white">admin123456</b></div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="mt-2.5 w-full py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold rounded-lg border border-amber-500/20 transition-all text-center"
          >
            ⚡ 1-Click Auto Fill & Login
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default AdminLogin;