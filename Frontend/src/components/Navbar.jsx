import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Cpu, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useUser, SignOutButton, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Computer Parts', path: '/computerparts' },
  { label: 'Mobile Parts', path: '/mobileparts' },
  { label: 'Appointment', path: '/appointment' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const { user } = useUser();
  const { items } = useSelector((state) => state.cart);
  const cartCount = items.reduce((acc, item) => acc + (item.qty || item.quantity || 1), 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 font-sans transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm' 
          : 'h-20 sm:h-22 bg-white/80 backdrop-blur-md border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex md:grid md:grid-cols-3 items-center justify-between relative">
        
        {/* LEFT SIDE: BRAND LOGO */}
        <div className="flex justify-start items-center h-full">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 group z-50">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-grotesk font-extrabold uppercase tracking-wider text-xl text-slate-900 leading-none">
                Digi<span className="text-indigo-600">Dude</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 mt-0.5">
                Tech Parts & Lab
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER: DESKTOP NAVIGATION */}
        <div className="hidden md:flex justify-center items-center space-x-1 font-semibold text-sm h-full">
          {NAV_LINKS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`relative px-4 py-2 rounded-xl transition-all duration-200 group flex items-center ${
                  isActive 
                    ? 'text-indigo-600 font-extrabold bg-indigo-50/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span className="relative z-10">
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-indigo-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE: ACTIONS */}
        <div className="flex justify-end items-center gap-3 z-50 h-full">
          
          {/* Auth Controls */}
          <div className="flex items-center gap-3">
             <SignedOut>
                <SignInButton mode="modal">
                    <button className="text-xs font-extrabold text-slate-800 hover:text-indigo-600 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer">
                        Login
                    </button>
                </SignInButton>
             </SignedOut>

             <SignedIn>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-700 font-extrabold hidden sm:block">Hi, {user?.firstName || 'User'}</span>
                    <SignOutButton>
                        <button className="text-xs bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors">
                            Logout
                        </button>
                    </SignOutButton>
                </div>
             </SignedIn>
          </div>

          {/* Cart Badge Button */}
          <Link 
            to="/cart" 
            onClick={() => setIsOpen(false)}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 transition-all group flex items-center justify-center shadow-sm"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse"
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU SLIDE-OVER SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[998] md:hidden"
            />

            {/* Sliding Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-[82%] max-w-xs bg-white shadow-2xl z-[999] flex flex-col justify-between p-6 border-l border-slate-200 md:hidden overflow-y-auto"
            >
              <div>
                {/* Drawer Brand Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-xl text-white shadow-sm">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="font-grotesk font-extrabold uppercase tracking-wider text-base text-slate-900">
                      Digi<span className="text-indigo-600">Dude</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col space-y-2">
                  {NAV_LINKS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block py-3 px-4 text-sm font-extrabold transition-all rounded-xl ${
                          isActive 
                            ? 'text-indigo-600 bg-indigo-50 border border-indigo-100 shadow-sm' 
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-[11px] font-mono text-slate-400 font-medium">Digi Dude Official Tech Store</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;