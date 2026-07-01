import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { store } from "../data/store.ts";

const NAV = [
  { to: "/app", label: "Dashboard", icon: "⊞", end: true },
  { to: "/app/programs", label: "Programs", icon: "◈" },
  { to: "/app/workout", label: "Workout", icon: "◉" },
  { to: "/app/nutrition", label: "Nutrition", icon: "◧" },
  { to: "/app/progress", label: "Progress", icon: "▲" },
  { to: "/app/tools", label: "Tools", icon: "⚙" },
  { to: "/app/coach", label: "AI Coach", icon: "✦" },
];

export default function AppShell() {
  const profile = store.getProfile();
  const [collapsed, setCollapsed] = useState(false);
  const nav = useNavigate();

  const xpLevel = Math.floor(profile.xp / 500) + 1;
  const xpProgress = (profile.xp % 500) / 500;

  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
      {/* SIDEBAR */}
      <aside style={{
        width: collapsed ? 64 : 220,
        flexShrink: 0,
        background: "var(--dark)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? "20px 0" : "20px 20px",
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between",
          borderBottom: "1px solid var(--border)",
          minHeight: 64,
        }}>
          {!collapsed && (
            <span style={{ fontFamily: "Barlow Condensed", fontWeight: 900, fontSize: 22, letterSpacing: "0.12em", color: "var(--gold)", cursor: "pointer" }} onClick={() => nav("/")}>
              FITERO
            </span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 18, padding: 4, lineHeight: 1 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12,
                padding: collapsed ? "12px 0" : "11px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                fontSize: 14, fontWeight: 500,
                color: isActive ? "var(--gold)" : "var(--muted)",
                background: isActive ? "rgba(201,168,76,0.08)" : "transparent",
                borderLeft: isActive ? "2px solid var(--gold)" : "2px solid transparent",
                textDecoration: "none",
                transition: "color 0.15s, background 0.15s",
              })}
            >
              <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User XP */}
        {!collapsed && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>{profile.name}</span>
              <span style={{ color: "var(--gold)", fontWeight: 700 }}>Lv.{xpLevel}</span>
            </div>
            <div style={{ height: 4, background: "var(--border2)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${xpProgress * 100}%`, background: "var(--gold)", borderRadius: 2, transition: "width 0.4s" }} />
            </div>
            <div style={{ marginTop: 5, fontSize: 11, color: "var(--muted2)" }}>{profile.xp} XP</div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto", background: "var(--black)" }}>
        <Outlet />
      </main>
    </div>
  );
}
