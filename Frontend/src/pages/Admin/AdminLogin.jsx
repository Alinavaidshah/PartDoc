import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, User, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../features/auth/authSlice';
import api from '../../api/axiosConfig';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  // Forgot Password State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Enter Name & Email, 2: Enter OTP & New Password, 3: Success
  const [forgotName, setForgotName] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    try {
      const { data } = await api.post('/auth/forgot-password', {
        name: forgotName.trim(),
        email: forgotEmail.trim()
      });
      setForgotSuccessMsg(data.message || 'OTP sent successfully!');
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to send OTP. Please verify your name and email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    try {
      const { data } = await api.post('/auth/reset-password', {
        email: forgotEmail.trim(),
        otp: forgotOtp.trim(),
        newPassword
      });
      setForgotSuccessMsg(data.message || 'Password updated successfully!');
      setForgotStep(3);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to reset password. Please check your OTP.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgotModal = () => {
    setIsForgotModalOpen(false);
    setForgotStep(1);
    setForgotName('');
    setForgotEmail('');
    setForgotOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotError('');
    setForgotSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <motion.form 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleLogin}
        className="w-full max-w-sm p-8 bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl z-10"
      >
        <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIsForgotModalOpen(true);
                setForgotStep(1);
                setForgotError('');
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Login To Dashboard"}
          </button>
        </div>
      </motion.form>

      {/* FORGOT PASSWORD MODAL (MULTI-STEP OTP VERIFICATION) */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeForgotModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 relative text-white"
            >
              {/* STEP 1: ENTER NAME & REGISTERED EMAIL */}
              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                      <KeyRound size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Reset Admin Password</h3>
                      <p className="text-xs text-slate-400">Enter your registered details to receive an OTP.</p>
                    </div>
                  </div>

                  {forgotError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-2 text-xs font-semibold">
                      <AlertCircle size={16} /> {forgotError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="Your Full Name (As Registered)" 
                        required
                        value={forgotName}
                        onChange={(e) => setForgotName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                      <input 
                        type="email" 
                        placeholder="Registered Admin Email" 
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? <Loader2 size={16} className="animate-spin" /> : "Send 6-Digit OTP"}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: VERIFY OTP & SET NEW PASSWORD */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Enter OTP & New Password</h3>
                      <p className="text-xs text-slate-400">Code sent to: <b className="text-indigo-300">{forgotEmail}</b></p>
                    </div>
                  </div>

                  {forgotSuccessMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                      {forgotSuccessMsg}
                    </div>
                  )}

                  {forgotError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-2 text-xs font-semibold">
                      <AlertCircle size={16} /> {forgotError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="6-Digit OTP Code" 
                        required
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500 tracking-widest font-mono text-center font-bold"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                      <input 
                        type="password" 
                        placeholder="New Password (min 6 characters)" 
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                      <input 
                        type="password" 
                        placeholder="Confirm New Password" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 p-3 pl-10 rounded-xl text-white text-sm focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? <Loader2 size={16} className="animate-spin" /> : "Save New Password"}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: SUCCESS CONFIRMATION */}
              {forgotStep === 3 && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={36} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">Password Updated!</h3>
                    <p className="text-xs text-slate-300 mt-1">Your password has been successfully reset. You can now login to the admin dashboard.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCredentials(prev => ({ ...prev, email: forgotEmail }));
                      closeForgotModal();
                    }}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
                  >
                    Proceed To Login
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLogin;