import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";

import { useAuth } from "./context/AuthContext";

// IMPORTANT: import order matters here.
// global.css loads first (shared tokens / other pages),
// dashboard.css loads last so its dashboard-specific styling
// (sidebar, topbar, cards) always wins for shared class names.
import "./styles/global.css";
import "./styles/dashboard.css";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "files", label: "My Files", icon: "📁" },
  { key: "shared", label: "Shared with me", icon: "👥", disabled: true },
  { key: "recent", label: "Recent", icon: "🕒", disabled: true },
  { key: "starred", label: "Starred", icon: "⭐", disabled: true },
  { key: "trash", label: "Trash", icon: "🗑", disabled: true },
];

const TOOLS = [
  { key: "optimize", label: "Optimize", icon: "✦", disabled: true },
  { key: "settings", label: "Settings", icon: "⚙", disabled: true },
];

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
  const initials = (storedUser?.username || storedUser?.email || "U")
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

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="sd-sidebar-upgrade">
              <div>🚀 Upgrade to Pro</div>
              <div>Get more storage, priority support and advanced tools.</div>
              <button>Upgrade Now</button>
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
                  {storedUser?.username || storedUser?.email || "User"}
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

            <div className="sd-topbar-avatar">{initials}</div>
          </div>

          {page === "dashboard" && <Dashboard onNavigate={setPage} />}
          {page === "files" && <Files />}
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