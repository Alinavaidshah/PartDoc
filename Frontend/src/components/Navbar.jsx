import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
// Clerk imports
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
  
  // User identity hook
  const { user } = useUser();
  
  // Cart items access
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
      className={`fixed top-0 left-0 w-full z-50 font-sans transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'h-16 bg-[#152227]/90 backdrop-blur-md border-b border-[#D8C99B]/20 shadow-[0_10px_30px_-10px_rgba(216,151,60,0.15)]' 
          : 'h-20 sm:h-24 bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex md:grid md:grid-cols-3 items-center justify-between relative">
        
        {/* LEFT SIDE: LOGO */}
        <div className="flex justify-start items-center h-full">
          <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5 group font-black tracking-tighter z-50">
            <div className="bg-[#D8973C] p-2 rounded-xl text-[#152227] shadow-[0_0_15px_rgba(216,151,60,0.4)] group-hover:shadow-[0_0_25px_rgba(216,151,60,0.8)] transition-all duration-300 flex items-center justify-center">
              <Cpu className="w-4.5 h-4.5 sm:w-5 h-5 animate-pulse" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D8973C] via-[#D8C99B] to-[#E5DBC0] font-extrabold uppercase tracking-widest text-lg sm:text-xl font-sans">
              PartDoc
            </span>
          </Link>
        </div>

        {/* CENTER: DESKTOP LINKS */}
        <div className="hidden md:flex justify-center items-center space-x-1 font-medium tracking-wide text-sm h-full">
          {NAV_LINKS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 font-sans group flex items-center ${
                  isActive 
                    ? 'text-[#D8973C] font-semibold' 
                    : 'text-[#BAC7BE] hover:text-white'
                }`}
              >
                <span className="relative z-10 transition-transform duration-300 block group-hover:scale-105">
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#D8973C] shadow-[0_0_10px_#D8973C]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE: ACTIONS */}
        <div className="flex justify-end items-center gap-3 z-50 h-full">
          
          {/* Clerk Auth Section */}
          <div className="flex items-center gap-3">
             <SignedOut>
                <SignInButton mode="modal">
                    <button className="text-sm font-bold text-[#BAC7BE] hover:text-[#D8973C] transition-colors cursor-pointer">
                        Login
                    </button>
                </SignInButton>
             </SignedOut>

             <SignedIn>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-[#D8973C] hidden sm:block font-medium">Hi, {user?.firstName}</span>
                    <SignOutButton>
                        <button className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-[#D8973C]/20 transition-all text-[#BAC7BE] cursor-pointer">
                            Logout
                        </button>
                    </SignOutButton>
                </div>
             </SignedIn>
          </div>

          <Link 
            to="/cart" 
            onClick={() => setIsOpen(false)}
            className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#BAC7BE] hover:text-[#D8973C] hover:border-[#D8973C]/40 hover:bg-[#D8973C]/5 transition-all duration-300 group flex items-center justify-center"
          >
            <ShoppingCart className="w-4.5 h-4.5 sm:w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#D8973C] to-[#E5A955] text-[#152227] text-[9px] sm:text-[10px] font-black w-4 sm:w-4.5 h-4 sm:h-4.5 rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(216,151,60,0.5)] transform group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            )}
          </Link>

          {/* HAMBURGER MENU */}
          <button 
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 gap-1.5 transition-all duration-300 hover:bg-white/10 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`h-[2px] w-5 bg-[#BAC7BE] rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2 !bg-[#D8973C]' : ''}`} />
            <span className={`h-[2px] w-5 bg-[#BAC7BE] rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`h-[2px] w-5 bg-[#BAC7BE] rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2 !bg-[#D8973C]' : ''}`} />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'linear' }}
            className="fixed inset-0 w-full h-screen bg-[#152227]/98 backdrop-blur-2xl flex flex-col justify-center items-center px-6 md:hidden z-40"
          >
            <div className="flex flex-col space-y-5 w-full max-w-xs text-center">
              {NAV_LINKS.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-3 text-xl sm:text-2xl font-bold font-sans tracking-widest uppercase transition-all ${
                        isActive 
                          ? 'text-[#D8973C] drop-shadow-[0_0_12px_rgba(216,151,60,0.4)] font-extrabold scale-105' 
                          : 'text-[#BAC7BE] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
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