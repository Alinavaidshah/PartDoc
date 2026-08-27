import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Cpu, ArrowRight, CheckCircle2 } from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 4000);
  };

  return (
    <footer className="bg-slate-900 text-slate-400 font-sans border-t border-slate-800 pt-16 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-grotesk font-extrabold uppercase tracking-wider text-xl text-white">
                Digi<span className="text-indigo-500">Dude</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              Pakistan's premier platform for original computer, laptop, and mobile replacement spare parts & lab upgradations with verified serial numbers & official warranty.
            </p>
            <div className="flex items-center gap-3">
              {["Twitter", "LinkedIn", "Facebook", "YouTube"].map((name, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 transition-all shadow-sm"
                >
                  {name[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-grotesk font-bold text-white text-sm uppercase tracking-wider mb-4">Shop Categories</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/computerparts" className="hover:text-indigo-400 transition-colors">Computer Parts</Link></li>
              <li><Link to="/computerparts?category=laptop" className="hover:text-indigo-400 transition-colors">Laptop Parts</Link></li>
              <li><Link to="/mobileparts" className="hover:text-indigo-400 transition-colors">Mobile Parts</Link></li>
              <li><Link to="/computerparts" className="hover:text-indigo-400 transition-colors">Storage & NVMe SSDs</Link></li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-grotesk font-bold text-white text-sm uppercase tracking-wider mb-4">Services & Support</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li><Link to="/appointment" className="hover:text-indigo-400 transition-colors">Book Repair Appointment</Link></li>
              <li><Link to="/appointment?tab=status" className="hover:text-indigo-400 transition-colors">Check Repair Status</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">View Shopping Cart</Link></li>
              <li><Link to="/computerparts" className="hover:text-indigo-400 transition-colors">Warranty & Serial Check</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-grotesk font-bold text-white text-sm uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Subscribe for stock updates & exclusive discount alerts directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center flex-shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {subscribed && (
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                  <CheckCircle2 size={14} /> Subscribed to Digi Dude updates!
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500 font-medium">
          <p>© 2026 Digi Dude Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/" className="hover:text-slate-300 transition-colors">Shipping Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;