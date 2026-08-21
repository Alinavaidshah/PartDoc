import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Bell, Search, X, ChevronDown, LogOut, CheckCircle, AlertCircle, UserPlus, PackageX, Loader2 } from "lucide-react";
import { TOKENS } from "../constants";
import { motion, AnimatePresence } from "framer-motion";

const NOTIF_ICONS = {
  error: PackageX,
  success: UserPlus,
  info: CheckCircle,
};

export default function Topbar({ title }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [bellRing, setBellRing] = useState(false);

  const getAuthConfig = () => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    return {
      headers: { Authorization: `Bearer ${adminInfo?.token}` }
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    window.location.href = '/admin/login';
  };

  // Notification Fetching Logic with Safe Fallbacks
  const fetchNotifs = async () => {
    try {
      const [stocksRes, ordersRes, usersRes] = await Promise.all([
        api.get('/parts/low-stock').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/users').catch(() => ({ data: [] }))
      ]);
      
      let temp = [];
      
      // Safe check and extraction for Low Stock
      const stockData = Array.isArray(stocksRes?.data) ? stocksRes.data : (stocksRes?.data?.parts || []);
      stockData.forEach(s => {
        if (s) temp.push({ id: s._id, type: 'error', title: 'Low Stock', msg: `${s.name || 'Item'} (${s.countInStock ?? 0} left)` });
      });
      
      // Safe check and extraction for Orders
      const orderData = Array.isArray(ordersRes?.data) ? ordersRes.data : (ordersRes?.data?.orders || []);
      orderData.filter(o => o?.orderStatus === 'Order Received & Being Prepared').forEach(o => {
        temp.push({ id: o._id, type: 'info', title: 'New Order', msg: `Rs. ${o?.totalPrice ?? 0} from ${o?.shippingAddress?.fullName || 'Customer'}` });
      });

      // Safe check and extraction for Users
      const userData = Array.isArray(usersRes?.data) ? usersRes.data : (usersRes?.data?.users || []);
      userData.slice(-5).forEach(u => {
        if (u) temp.push({ id: u._id, type: 'success', title: 'New User', msg: `${u?.name || 'User'} registered` });
      });

      setNotifs(temp);
    } catch (e) { console.error("Notif Error:", e); }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (val) => {
    if (val && val.length > 2) {
      setSearchLoading(true);
      try {
        // Fixed axios to use configured 'api' instance
        const response = await api.get(`/parts?name=${val}`, getAuthConfig());
        const resultData = Array.isArray(response?.data) ? response.data : (response?.data?.parts || []);
        setSearchResults(resultData);
      } catch (e) { 
        console.error("Search Error:", e); 
        setSearchResults([]);
      } finally { 
        setSearchLoading(false); 
      }
    } else { 
      setSearchResults([]); 
    }
  };

  return (
    <>
      <style>{`
        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-12deg); }
          45% { transform: rotate(8deg); }
          60% { transform: rotate(-6deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes badgePop {
          0% { transform: scale(0); }
          60% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .bell-ring {
          animation: bellRing 0.6s ease;
          transform-origin: top center;
        }
        .notif-badge {
          animation: badgePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .icon-btn {
          transition: background 0.2s ease, transform 0.15s ease;
          border-radius: 8px;
        }
        .icon-btn:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
        }
        .profile-btn {
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .profile-btn:hover {
          background: #fafafa;
          border-color: #d1d5db;
        }
        .dropdown-caret {
          transition: transform 0.25s ease;
        }
        .dropdown-caret.open {
          transform: rotate(180deg);
        }
        .notif-card {
          animation: fadeSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
        }
        .notif-card:hover {
          transform: translateX(-3px);
          box-shadow: 0 3px 10px rgba(0,0,0,0.06);
        }
        .search-result-row {
          transition: background 0.2s ease, padding-left 0.2s ease;
          animation: fadeSlideIn 0.3s ease both;
        }
        .search-result-row:hover {
          background: #fafafa;
          padding-left: 6px;
        }
        .close-icon-btn {
          transition: background 0.2s ease, transform 0.2s ease;
          border-radius: 50%;
          padding: 4px;
        }
        .close-icon-btn:hover {
          background: #f3f4f6;
          transform: rotate(90deg);
        }
        .search-input-focus {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .search-input-focus:focus {
          border-color: ${TOKENS?.rustDeep || '#111'};
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
          outline: none;
        }
        .logout-btn {
          transition: background 0.2s ease;
          border-radius: 6px;
        }
        .logout-btn:hover {
          background: #fef2f2;
        }
        .spin-loader {
          animation: spin 0.8s linear infinite;
        }
        .empty-state-fade {
          animation: fadeSlideIn 0.4s ease both;
        }
      `}</style>

      <AnimatePresence>
        {(notifOpen || searchOpen) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setNotifOpen(false); setSearchOpen(false); }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', zIndex: 999 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(notifOpen || searchOpen) && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            style={{ position: 'fixed', top: 0, right: 0, width: 400, height: '100vh', background: '#fff', zIndex: 1000, padding: 30, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                {searchOpen ? <Search size={20} color={TOKENS?.rustDeep || '#111'} /> : <Bell size={20} color={TOKENS?.rustDeep || '#111'} />}
                {searchOpen ? "Search Parts" : `Notifications (${notifs.length})`}
              </h2>
              <div className="close-icon-btn" onClick={() => { setNotifOpen(false); setSearchOpen(false); }}>
                <X size={22} style={{ cursor: 'pointer', display: 'block' }} />
              </div>
            </div>
            {searchOpen ? (
              <>
                <div style={{ position: 'relative', marginBottom: 15 }}>
                  <Search size={16} color="#999" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input autoFocus placeholder="Type part name..." onChange={(e) => handleSearch(e.target.value)} className="search-input-focus" style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: 8, border: '1px solid #ccc', boxSizing: 'border-box' }} />
                  {searchLoading && <Loader2 size={16} className="spin-loader" color="#999" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />}
                </div>
                {(!searchResults || searchResults.length === 0) && !searchLoading && (
                  <div className="empty-state-fade" style={{ textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 13 }}>
                    Start typing to search parts...
                  </div>
                )}
                {Array.isArray(searchResults) && searchResults.map((r, idx) => (
                  <div key={r?._id || idx} className="search-result-row" style={{ padding: 10, borderBottom: '1px solid #eee', animationDelay: `${idx * 0.04}s` }}>
                    {r?.name}
                  </div>
                ))}
              </>
            ) : (
              <>
                {notifs.length === 0 ? (
                  <div className="empty-state-fade" style={{ textAlign: 'center', color: '#aaa', marginTop: 60, fontSize: 13, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <Bell size={28} color="#ddd" />
                    No notifications right now.
                  </div>
                ) : (
                  notifs.map((n, i) => {
                    const NotifIcon = NOTIF_ICONS[n.type] || CheckCircle;
                    const iconColor = n.type === 'error' ? '#d93025' : n.type === 'success' ? '#1e8e3e' : '#1a73e8';
                    return (
                      <div key={n.id || i} className="notif-card" style={{
                        padding: 15, borderRadius: 10,
                        background: n.type === 'error' ? '#fff1f0' : n.type === 'success' ? '#f0fff4' : '#f0f7ff',
                        marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start',
                        animationDelay: `${i * 0.05}s`
                      }}>
                        <div style={{ background: '#fff', padding: 6, borderRadius: 8, flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                          <NotifIcon size={15} color={iconColor} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: iconColor }}>{n.title}</div>
                          <div style={{ fontSize: 12, color: '#444', marginTop: 2 }}>{n.msg}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: TOKENS?.panel, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${TOKENS?.line}` }}>
        <div><h2 style={{ fontSize: 18, margin: 0, fontWeight: 700 }}>{title}</h2></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setSearchOpen(true)} className="icon-btn" style={{ background: "none", border: "none", cursor: 'pointer', padding: 8 }}>
            <Search size={20} />
          </button>
          <button onClick={() => setNotifOpen(true)} className="icon-btn" style={{ background: "none", border: "none", cursor: 'pointer', position: 'relative', padding: 8 }}>
            <Bell size={20} className={bellRing ? 'bell-ring' : ''} />
            {notifs.length > 0 && (
              <span className="notif-badge" style={{ position: 'absolute', top: 2, right: 2, background: 'red', color: 'white', borderRadius: '50%', fontSize: 10, padding: '2px 5px', minWidth: 16, textAlign: 'center', lineHeight: 1.2 }}>
                {notifs.length}
              </span>
            )}
          </button>
          
          <div style={{ position: "relative" }}>
            <button onClick={() => setProfileOpen(!profileOpen)} className="profile-btn" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, border: `1px solid ${TOKENS?.line}`, background: "none", cursor: "pointer" }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${TOKENS?.rustDeep || '#111'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: TOKENS?.rustDeep || '#111' }}>
                A
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Ali Navaid Shah</span>
              <ChevronDown size={14} className={`dropdown-caret ${profileOpen ? 'open' : ''}`} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  style={{ position: "absolute", top: "110%", right: 0, background: TOKENS?.panel, border: `1px solid ${TOKENS?.line}`, borderRadius: 10, padding: 8, width: 150, zIndex: 100, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                >
                  <button onClick={handleLogout} className="logout-btn" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, border: "none", background: "none", color: TOKENS?.rustDeep, cursor: "pointer", padding: 8 }}>
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}