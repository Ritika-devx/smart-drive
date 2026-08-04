import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Suggestions from "./pages/Suggestions";

import { useAuth } from "./context/AuthContext";

import "./styles/global.css";
import "./styles/dashboard.css";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "files", label: "My Files", icon: "📁" },
  { key: "upload", label: "Upload", icon: "☁" },
  { key: "shared", label: "Shared with me", icon: "👥", disabled: true },
  { key: "recent", label: "Recent", icon: "🕒", disabled: true },
  { key: "starred", label: "Starred", icon: "⭐", disabled: true },
  { key: "trash", label: "Trash", icon: "🗑", disabled: true },
];

const TOOLS = [
  { key: "suggestions", label: "Optimize", icon: "✦" },
  { key: "settings", label: "Settings", icon: "⚙", disabled: true },
  { key: "profile", label: "Profile", icon: "👤" },
];

const LABELS = {
  dashboard: "Dashboard",
  files: "My Files",
  upload: "Upload",
  profile: "Profile",
  suggestions: "Optimize",
};

export default function AppShell() {
  const [page, setPage] = useState("dashboard");

  const [theme, setTheme] = useState(
    () => localStorage.getItem("sd_theme") || "light"
  );

  const { logout } = useAuth();

  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("sd_theme", next);
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const initials = (storedUser?.name || storedUser?.username || storedUser?.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="sd-root" data-theme={theme}>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* ===================== Sidebar ===================== */}
        <aside className="sd-sidebar">
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px" }}>
            <div
              className="sd-sidebar-logo-mark"
              style={{ width: 36, height: 36, borderRadius: 11, fontSize: 16, color: "#fff" }}
            >
              ◈
            </div>
            <div>
              <div className="sd-h1" style={{ fontSize: 14.5, color: "#fff" }}>
                Smart Drive
              </div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.45)" }}>
                Your data, organized
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {NAV.map((n) => (
                  <button
                    key={n.key}
                    disabled={n.disabled}
                    className={`sd-nav-btn${page === n.key ? " active" : ""}`}
                    onClick={() => !n.disabled && setPage(n.key)}
                    style={{ opacity: n.disabled ? 0.55 : 1 }}
                  >
                    <span style={{ fontSize: 14 }}>{n.icon}</span>
                    {n.label}
                    {n.disabled && (
                      <span className="sd-eyebrow" style={{ marginLeft: "auto", fontSize: 8.5 }}>
                        soon
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <div className="sd-sidebar-section-label">Tools</div>
              <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {TOOLS.map((n) => (
                  <button
                    key={n.key}
                    disabled={n.disabled}
                    className={`sd-nav-btn${page === n.key ? " active" : ""}`}
                    onClick={() => !n.disabled && setPage(n.key)}
                    style={{ opacity: n.disabled ? 0.55 : 1 }}
                  >
                    <span style={{ fontSize: 14 }}>{n.icon}</span>
                    {n.label}
                    {n.disabled && (
                      <span className="sd-eyebrow" style={{ marginLeft: "auto", fontSize: 8.5 }}>
                        soon
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)" }}>Storage Used</span>
                <span style={{ fontSize: 11.5, color: "rgba(255,255,255,.6)" }}>0%</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 8 }}>0.0 B of 10 GB</div>
              <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: "0%", background: "var(--sd-grad-primary)" }} />
              </div>
            </div>

            <button
              style={{
                width: "100%", padding: "9px", border: "none", borderRadius: 10, cursor: "pointer",
                background: "rgba(255,255,255,0.06)", color: "#fff", fontWeight: 600, fontSize: 12.5,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              🚀 Upgrade Storage
            </button>

            <div
              style={{
                padding: 12, borderRadius: 12,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>🎧</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Need Help?</div>
                <div style={{ fontSize: 11, color: "var(--sd-blue-soft, #8ea2ff)" }}>Go to Help Center</div>
              </div>
            </div>

            <div className="sd-sidebar-user">
              <div className="sd-sidebar-avatar">{initials}</div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {storedUser?.name || storedUser?.username || storedUser?.email || "User"}
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    border: "none",
                    background: "none",
                    color: "rgba(255,255,255,.5)",
                    fontSize: 11,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ===================== Main ===================== */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div className="sd-topbar">
            <div className="sd-topbar-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Search files, folders..." />
            </div>

            <button className="sd-topbar-icon-btn" title="Notifications">
              🔔
              <span className="sd-topbar-badge">3</span>
            </button>

            <button
              className="sd-topbar-icon-btn sd-theme-icon"
              key={theme}
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>

            <button
              className="sd-topbar-avatar"
              onClick={() => setPage("profile")}
              title="View profile"
              style={{ border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 5 }}
            >
              {initials}
            </button>
          </div>

          {page !== "dashboard" && (
            <div style={{ padding: "14px 28px 0", fontSize: 12.5, color: "var(--sd-text-mid)" }}>
              <span
                style={{ color: "var(--sd-blue)", cursor: "pointer", fontWeight: 600 }}
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </span>
              <span style={{ margin: "0 6px", color: "var(--sd-text-low)" }}>›</span>
              <span style={{ color: "var(--sd-text-hi)", fontWeight: 600 }}>{LABELS[page]}</span>
            </div>
          )}

          {page === "dashboard" && <Dashboard onNavigate={setPage} />}
          {page === "files" && <Files />}
          {page === "upload" && <Upload />}
          {page === "profile" && <Profile />}
          {page === "suggestions" && <Suggestions />}
        </main>
      </div>

      <style>{`
        @media (max-width:720px){
          .sd-sidebar{
            position:fixed;
            z-index:20;
            height:100vh;
          }
        }
        .sd-theme-icon{
          animation: sdThemePop .4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes sdThemePop{
          0%{ transform: scale(.3) rotate(-90deg); opacity:0; }
          60%{ transform: scale(1.2) rotate(10deg); opacity:1; }
          100%{ transform: scale(1) rotate(0deg); opacity:1; }
        }
      `}</style>
    </div>
  );
}