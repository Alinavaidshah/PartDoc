import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Cpu, Menu, X } from 'lucide-react';
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
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 font-sans transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm' 
          : 'h-20 sm:h-22 bg-white/70 backdrop-blur-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex md:grid md:grid-cols-3 items-center justify-between relative">
        
        {/* LEFT SIDE: LOGO */}
        <div className="flex justify-start items-center h-full">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 group z-50">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-grotesk font-extrabold uppercase tracking-wider text-xl text-slate-900">
              Part<span className="text-indigo-600">Doc</span>
            </span>
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
                    ? 'text-indigo-600 font-bold bg-indigo-50/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span className="relative z-10">
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-indigo-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE: ACTIONS */}
        <div className="flex justify-end items-center gap-3 z-50 h-full">
          
          {/* Auth Button */}
          <div className="flex items-center gap-3">
             <SignedOut>
                <SignInButton mode="modal">
                    <button className="text-xs font-bold text-slate-700 hover:text-indigo-600 border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer">
                        Login
                    </button>
                </SignInButton>
             </SignedOut>

             <SignedIn>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-indigo-700 font-bold hidden sm:block">Hi, {user?.firstName}</span>
                    <SignOutButton>
                        <button className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer">
                            Logout
                        </button>
                    </SignOutButton>
                </div>
             </SignedIn>
          </div>

          {/* Cart Icon */}
          <Link 
            to="/cart" 
            onClick={() => setIsOpen(false)}
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 transition-all group flex items-center justify-center shadow-sm"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {/* HAMBURGER MENU BUTTON */}
          <button 
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 w-full h-screen bg-white flex flex-col justify-center items-center px-6 md:hidden z-40"
          >
            <div className="flex flex-col space-y-4 w-full max-w-xs text-center">
              {NAV_LINKS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 text-lg font-bold transition-all rounded-xl ${
                      isActive 
                        ? 'text-indigo-600 bg-indigo-50' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;