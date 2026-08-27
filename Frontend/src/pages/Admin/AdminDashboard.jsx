import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { TOKENS, FONT_BODY } from "../../constants";
import { DollarSign, CalendarClock, Package, AlertTriangle, Box, TrendingUp, Sparkles, Clock, ChevronRight, Wrench } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [data, setData] = useState({ appointments: [], lowStock: [], allParts: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, stockRes, partsRes] = await Promise.all([
          api.get('/appointments/stats').catch(() => ({ data: {} })),
          api.get('/parts/low-stock').catch(() => ({ data: [] })),
          api.get('/parts').catch(() => ({ data: [] }))
        ]);

        const apptData = apptRes.data?.appointments || (Array.isArray(apptRes.data) ? apptRes.data : []);
        const stockData = Array.isArray(stockRes.data) ? stockRes.data : [];
        const partsData = Array.isArray(partsRes.data) ? partsRes.data : [];
        
        setData({ 
          appointments: apptData, 
          lowStock: stockData, 
          allParts: partsData 
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setTimeout(() => setLoaded(true), 100);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString();
  const appointmentsArr = Array.isArray(data.appointments) ? data.appointments : [];
  const lowStockArr = Array.isArray(data.lowStock) ? data.lowStock : [];
  const allPartsArr = Array.isArray(data.allParts) ? data.allParts : [];

  const pending = appointmentsArr.filter(a => a.status === 'Pending');

  const categoryMap = allPartsArr.reduce((acc, part) => {
    const cat = part.category ? part.category.trim() : 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryPieData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  const CATEGORY_COLORS = [TOKENS.amber, TOKENS.blueish, TOKENS.teal, TOKENS.rust, '#8884d8', '#82ca9d', '#ffc658'];

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', background: TOKENS.bg, height: '100vh', fontFamily: FONT_BODY, width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.15); }
          50% { box-shadow: 0 0 0 6px rgba(211, 47, 47, 0); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .dash-card {
          animation: fadeSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .dash-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0,0,0,0.12);
          border-color: #d8d8d8 !important;
        }
        .stat-icon-wrap {
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dash-card:hover .stat-icon-wrap {
          transform: scale(1.12) rotate(-6deg);
        }
        .action-link {
          transition: gap 0.2s ease, color 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
        .action-link:hover {
          gap: 6px;
          color: #d67e00 !important;
        }
        .low-stock-row {
          transition: background 0.2s ease, transform 0.2s ease;
          border-radius: 12px;
        }
        .low-stock-row:hover {
          background: #fafafa;
          transform: translateX(3px);
        }
        .pending-row {
          transition: background 0.2s ease, transform 0.2s ease;
          border-radius: 12px;
        }
        .pending-row:hover {
          background: #fafafa;
          transform: translateX(3px);
        }
        .urgent-pulse {
          animation: pulseGlow 2s infinite;
        }
        .empty-state {
          animation: fadeIn 0.6s ease 0.2s both;
        }
        .skeleton {
          background: linear-gradient(90deg, #eee 0px, #f7f7f7 40px, #eee 80px);
          background-size: 200px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 10px;
        }
        .spin-slow {
          animation: spin 20s linear infinite;
        }
        .avatar-ring {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .pending-row:hover .avatar-ring {
          transform: scale(1.08);
          box-shadow: 0 0 0 3px ${TOKENS.amberSoft};
        }
      `}</style>

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <Topbar title="Digi Dude Console" adminName="Ali Navaid Shah" onMenuClick={() => setMobileOpen(true)} />
        <main style={{ padding: '20px sm:24px', maxWidth: '100%', boxSizing: 'border-box' }} className="p-4 sm:p-6">
          <div style={{ marginBottom: 24, animation: 'fadeSlideUp 0.5s ease both' }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 style={{ margin: 0, fontSize: 28, color: '#1a1a1a', fontWeight: 800, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 10 }}>
                Dashboard Overview
                <Sparkles size={22} color={TOKENS.amber} style={{ animation: 'pulseGlow 2.5s infinite' }} />
              </h1>
              <p style={{ color: '#777', fontSize: 14, marginTop: 4 }}>Welcome back, <strong style={{ color: '#333' }}>Ali</strong>. Here is your business performance.</p>
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff',
              padding: '8px 14px', borderRadius: 14, border: '1px solid #e5e5e5',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)', fontSize: 13, color: '#555', fontWeight: 600, width: 'fit-content'
            }}>
              <Clock size={15} color={TOKENS.amber} />
              {today}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
            <div className="dash-card" style={{ animationDelay: '0.05s' }}>
              <GaugeStat label="Monthly Revenue" value="639,900" numericValue={639900} target={1000000} icon={DollarSign} color={TOKENS.amber} suffix=" PKR" />
            </div>
            <div className="dash-card" style={{ animationDelay: '0.12s' }}>
              <GaugeStat label="Pending Appts" value={pending.length} numericValue={pending.length} target={10} icon={CalendarClock} color={TOKENS.rust} />
            </div>
            <div className="dash-card" style={{ animationDelay: '0.19s' }}>
              <GaugeStat label="Total Parts" value={data.allParts.length} numericValue={data.allParts.length} target={100} icon={Package} color={TOKENS.blueish} />
            </div>
            <div className="dash-card" style={{ animationDelay: '0.26s' }}>
              <GaugeStat label="Low Stock" value={data.lowStock.length} numericValue={data.lowStock.length} target={20} icon={AlertTriangle} color={TOKENS.teal} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 mb-6">
            <div className="lg:col-span-7 xl:col-span-8 dash-card" style={{ animationDelay: '0.32s', background: TOKENS.panel, padding: 24, borderRadius: 20, border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp size={18} color={TOKENS.amber} />
                  Sales Performance
                </h3>
                <span style={{
                  fontSize: 12, fontWeight: 700, color: '#2e7d32', background: '#e8f5e9',
                  padding: '4px 10px', borderRadius: 20
                }}>▲ Trending up</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={[{ v: 400 }, { v: 600 }, { v: 500 }, { v: 800 }]}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={TOKENS.amber} stopOpacity={0.5} />
                      <stop offset="95%" stopColor={TOKENS.amber} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={TOKENS.amber} strokeWidth={2.5} fill="url(#salesGradient)" animationDuration={1200} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-5 xl:col-span-4 dash-card" style={{ animationDelay: '0.38s', background: TOKENS.panel, padding: 24, borderRadius: 20, border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={18} color={TOKENS.blueish} />
                Stock by category
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {categoryPieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={categoryPieData} cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={4} dataKey="value">
                          {categoryPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 8 }}>
                      {categoryPieData.map((item, index) => (
                        <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }} />
                          {item.name}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", color: "#aaa", padding: "30px 0", fontSize: 13 }}>No category data available</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            <div className="dash-card" style={{ animationDelay: '0.44s' }}>
              <BottomCard title="Today's schedule" icon={CalendarClock} iconColor={TOKENS.amber} action="View all">
                {data.appointments.filter(a => a.appointmentDate === today).length === 0 ? (
                  <div className="empty-state" style={{ textAlign: 'center', color: '#999', marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <CalendarClock size={30} color="#ddd" />
                    No appointments today<br />The schedule is clear.
                  </div>
                ) : (
                  data.appointments.filter(a => a.appointmentDate === today).map((a, idx) => (
                    <div key={a._id} className="pending-row" style={{ marginBottom: 4, padding: '10px 8px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10, animation: `fadeSlideUp 0.4s ease ${idx * 0.06}s both` }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: TOKENS.amber, flexShrink: 0 }} />
                      <span>{a.name} - {a.deviceModel}</span>
                    </div>
                  ))
                )}
              </BottomCard>
            </div>

            <div className="dash-card" style={{ animationDelay: '0.50s' }}>
              <BottomCard title="Needs reorder" icon={Box} iconColor={TOKENS.teal} action="View all">
                {data.lowStock.length === 0 ? (
                  <div className="empty-state" style={{ textAlign: 'center', color: '#999', marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <Box size={30} color="#ddd" />
                    All stock levels healthy.
                  </div>
                ) : (
                  data.lowStock.map((p, idx) => (
                    <div key={p._id} className="low-stock-row" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, padding: '8px', borderBottom: '1px solid #f0f0f0', paddingBottom: 14, animation: `fadeSlideUp 0.4s ease ${idx * 0.06}s both` }}>
                      <div style={{ padding: 8, background: TOKENS.amberSoft, borderRadius: 10, flexShrink: 0 }}><Box size={20} color={TOKENS.amber} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: 13, color: '#666' }}>{p.countInStock} units left</div>
                      </div>
                      <div style={{ fontSize: 10, padding: '4px 8px', background: '#fff4e5', color: TOKENS.amberDeep, borderRadius: 20, fontWeight: 600, whiteSpace: 'nowrap' }}>● Low stock</div>
                    </div>
                  ))
                )}
              </BottomCard>
            </div>

            <div className="dash-card" style={{ animationDelay: '0.56s' }}>
              <BottomCard title="Awaiting approval" icon={Wrench} iconColor={TOKENS.rust} action="Review">
                {pending.length === 0 ? (
                  <div className="empty-state" style={{ textAlign: 'center', color: '#999', marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <Wrench size={30} color="#ddd" />
                    No pending approvals.
                  </div>
                ) : (
                  pending.map((a, idx) => (
                    <div key={a._id} className="pending-row" style={{ display: 'flex', gap: 12, marginBottom: 4, padding: '8px', alignItems: 'center', animation: `fadeSlideUp 0.4s ease ${idx * 0.06}s both` }}>
                      <div className="avatar-ring" style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${TOKENS.amberSoft}, #f5f5f5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: TOKENS.amberDeep, flexShrink: 0 }}>
                        {a.name ? a.name[0].toUpperCase() : 'A'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                        <div style={{ fontSize: 12, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.appointmentDate} · {a.issueDescription}</div>
                      </div>
                      <div className="urgent-pulse" style={{ fontSize: 9, color: '#d32f2f', fontWeight: 800, background: '#fff0f0', padding: '4px 8px', borderRadius: 6, height: 'fit-content', flexShrink: 0 }}>URGENT</div>
                    </div>
                  ))
                )}
              </BottomCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const GaugeStat = ({ label, value, numericValue, target, icon: Icon, color, suffix }) => {
  const progress = Math.min((numericValue / target) * 100, 100);
  return (
    <div style={{ background: TOKENS.panel, padding: 20, borderRadius: 20, border: '1px solid #e5e5e5', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.4px' }}>{label}</div>
        <div style={{ fontSize: 25, fontWeight: 800, marginTop: 5, color: '#1a1a1a' }}>
          {value}{suffix ? <span style={{ fontSize: 13, fontWeight: 600, color: '#999' }}>{suffix}</span> : null}
        </div>
        <div style={{ fontSize: 11, color: '#aaa', marginTop: 3, fontWeight: 500 }}>{Math.round(progress)}% of target</div>
      </div>
      <div className="stat-icon-wrap" style={{ position: 'relative', width: 54, height: 54 }}>
        <PieChart width={54} height={54}>
          <Pie data={[{value: progress}, {value: 100-progress}]} innerRadius={19} outerRadius={25} startAngle={90} endAngle={-270} dataKey="value" stroke="none" animationDuration={1000} animationEasing="ease-out">
            <Cell fill={color} /><Cell fill="#eef0f2" />
          </Pie>
        </PieChart>
        <div style={{ position: 'absolute', top: 9, left: 9, background: `${color}18`, padding: 9, borderRadius: '50%', display: 'flex' }}><Icon size={18} color={color} /></div>
      </div>
    </div>
  );
};

const BottomCard = ({ title, action, children, icon: Icon, iconColor }) => (
  <div style={{ background: TOKENS.panel, padding: 24, borderRadius: 20, height: 340, border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <h3 style={{ margin: 0, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
        {Icon ? <Icon size={17} color={iconColor} /> : null}
        {title}
      </h3>
      <span className="action-link" style={{ fontSize: 13, color: TOKENS.amberDeep, cursor: 'pointer', fontWeight: 600 }}>
        {action} <ChevronRight size={14} />
      </span>
    </div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

export default AdminDashboard;