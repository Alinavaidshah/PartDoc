import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Mail, Chrome } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import navigate hook
import Toast from './Toast';
import { API_URL } from '../api/axiosConfig';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // API Call logic
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowToast(true);
        if(!isLogin) setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err) {
      console.error("Auth error", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Toast 
            message={isLogin ? "Login Success!" : "Account created successfully! Now login."} 
            isOpen={showToast} 
            onClose={() => setShowToast(false)} 
          />
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-sm z-50" />
          
          <motion.div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-[#152227] p-8 rounded-3xl border border-white/10 shadow-2xl">
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white"><X size={20} /></button>

            <h2 className="text-2xl font-bold mb-6 text-white">{isLogin ? "Welcome Back" : "Create Account"}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
                  <input required onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" placeholder="Full Name" className="w-full bg-[#0a0a0f] p-3 pl-10 rounded-xl border border-white/5 text-white focus:border-[#D8973C] outline-none" />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <input required onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="Email Address" className="w-full bg-[#0a0a0f] p-3 pl-10 rounded-xl border border-white/5 text-white focus:border-[#D8973C] outline-none" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                <input required onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" placeholder="Password" className="w-full bg-[#0a0a0f] p-3 pl-10 rounded-xl border border-white/5 text-white focus:border-[#D8973C] outline-none" />
              </div>
              
              {/* Forgot Password Link */}
              {isLogin && (
                <button 
                  type="button" 
                  onClick={() => { onClose(); navigate('/forgot-password'); }} 
                  className="text-xs text-gray-400 hover:text-[#D8973C] w-full text-right transition-colors"
                >
                  Forgot Password?
                </button>
              )}

              <button type="submit" className="w-full py-3 bg-[#D8973C] text-[#152227] font-bold rounded-xl hover:scale-[1.02] transition-all">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-xs text-gray-500 uppercase">OR</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <button className="w-full py-3 flex items-center justify-center gap-2 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all">
              <Chrome size={18} className="text-[#D8973C]" />
              {isLogin ? "Login with Google" : "Sign Up with Google"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;