import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/auth/authSlice'; 

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Optimized Selectors (Infinite loop rokne ke liye inhein alag kiya hai)
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  // Redirect logic
  useEffect(() => {
    // Sirf tabhi navigate karo jab isAdmin true ho
    if (isAdmin === true) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  return (
    <div className="min-h-screen bg-[#06060b] flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-64 h-64 bg-[#ff9100]/10 rounded-full blur-[100px]" />
      
      <motion.form 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 bg-[#0a0a0f]/80 border border-[#1a1a1a] rounded-2xl backdrop-blur-md z-10"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tighter">ADMIN ACCESS</h2>
        
        {/* Error Message display */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <div className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full bg-[#111] border border-[#222] p-3 pl-10 rounded-lg text-white focus:border-[#ff9100] outline-none transition-all"
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
          </div>
          
          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full bg-[#111] border border-[#222] p-3 pl-10 rounded-lg text-white focus:border-[#ff9100] outline-none transition-all"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#ff9100] text-black font-bold p-3 rounded-lg hover:bg-[#e68200] transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "ENTER SYSTEM"}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default AdminLogin;