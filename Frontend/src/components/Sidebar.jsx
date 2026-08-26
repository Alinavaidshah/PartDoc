import React from 'react';
import { NavLink } from 'react-router-dom';
import { TOKENS, FONT_HEAD, FONT_BODY } from "../constants";
import { 
  LayoutDashboard, CalendarClock, PackageSearch, Users, Wrench, ChevronLeft, Star 
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, badges }) {
const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { key: "appointments", label: "Appointments", icon: CalendarClock, path: "/admin/appointments", badge: badges?.appointments },
    { key: "inventory", label: "Inventory", icon: PackageSearch, path: "/admin/inventory", badge: badges?.inventory },
    { key: "customers", label: "Customers", icon: Users, path: "/admin/customers" },
    { key: "orders", label: "Orders", icon: Wrench, path: "/admin/orders" }, 
    { key: "reviews", label: "Reviews", icon: Star, path: "/admin/reviews" },
  ];
  const width = collapsed ? 76 : 244;

  return (
    <>
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 60 }} className="adpro-mobile-scrim" />
      )}
      <aside style={{
        width, minWidth: width, background: TOKENS.sidebar, color: "#fff",
        display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0,
        transition: "width 0.25s cubic-bezier(0.16,1,0.3,1)", overflow: "hidden", flexShrink: 0,
        borderRight: `1px solid ${TOKENS.sidebarLine}`,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: collapsed ? "20px 0" : "20px 18px", justifyContent: collapsed ? "center" : "flex-start", borderBottom: `1px solid ${TOKENS.sidebarLine}`, minHeight: 68 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: TOKENS.amber, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Wrench size={17} color="#20140A" strokeWidth={2.4} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 15.5, letterSpacing: -0.2 }}>PartDoc Pro</div>
              <div style={{ fontSize: 10.5, color: "#8B8F99", letterSpacing: 0.4, textTransform: "uppercase" }}>Admin Console</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }} className="adpro-scroll">
          {items.map(item => (
            <NavLink 
              key={item.key} 
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                width: "100%", display: "flex", alignItems: "center", gap: 12, 
                padding: collapsed ? "11px 0" : "10px 12px", marginBottom: 4, borderRadius: 9, 
                background: isActive ? TOKENS.sidebarSoft : "transparent", 
                textDecoration: "none",
                border: "none", cursor: "pointer", color: isActive ? "#fff" : "#B4B7C0", 
                justifyContent: collapsed ? "center" : "flex-start", 
                fontFamily: FONT_BODY, transition: "all 0.2s ease" 
              })}
            >
              <item.icon size={18} strokeWidth={2} />
              {!collapsed && <span style={{ fontSize: 13.5, fontWeight: 500, flex: 1, textAlign: "left" }}>{item.label}</span>}
              {!collapsed && item.badge > 0 && (
                <span style={{ background: TOKENS.amber, color: "#20140A", fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 8px" }}>{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle */}
        <div style={{ borderTop: `1px solid ${TOKENS.sidebarLine}`, padding: "14px 12px" }}>
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            style={{ 
              width: "100%", display: "flex", alignItems: "center", gap: 8, 
              background: "transparent", border: "none", color: "#787C87", 
              cursor: "pointer", padding: "8px", borderRadius: 8, fontSize: 12, transition: "all 0.2s" 
            }}
          >
            <ChevronLeft size={16} style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.25s" }} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}