// import { useState } from 'react';
// import Dashboard from './pages/Dashboard';
// import Files from './pages/Files';
// import './styles/global.css';

// /**
//  * AppShell
//  * ------------------------------------------------------------
//  * Minimal sidebar + header layout wrapping the Dashboard and
//  * Files pages built for this milestone. Swap the internal
//  * `page` state for your router (react-router etc.) once auth
//  * routing lands — the two pages don't depend on this shell.
//  */

// const NAV = [
//   { key: 'dashboard', label: 'Dashboard', icon: '▦' },
//   { key: 'files',     label: 'My Files',  icon: '▤' },
//   { key: 'optimize',  label: 'Optimize',  icon: '✦', disabled: true },
//   { key: 'settings',  label: 'Settings',  icon: '⚙', disabled: true },
// ];

// export default function AppShell() {
//   const [page, setPage] = useState('dashboard');

//   return (
//     <div className="sd-root" style={{ display: 'flex', minHeight: '100vh' }}>
//       {/* Sidebar */}
//       <aside
//         style={{
//           width: 220, flexShrink: 0, padding: '22px 14px', display: 'flex', flexDirection: 'column', gap: 26,
//           borderRight: '1px solid var(--sd-glass-border)', background: 'rgba(255,255,255,0.02)',
//         }}
//         className="sd-sidebar"
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' }}>
//           <span
//             style={{
//               width: 30, height: 30, borderRadius: 9, background: 'var(--sd-grad-primary)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, boxShadow: 'var(--sd-shadow-glow-blue)',
//             }}
//           >
//             ◈
//           </span>
//           <span className="sd-h1" style={{ fontSize: 15 }}>Smart Drive</span>
//         </div>

//         <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//           {NAV.map((n) => (
//             <button
//               key={n.key}
//               disabled={n.disabled}
//               onClick={() => setPage(n.key)}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10,
//                 border: 'none', textAlign: 'left', fontSize: 13.5, cursor: n.disabled ? 'not-allowed' : 'pointer',
//                 background: page === n.key ? 'var(--sd-glass-strong)' : 'transparent',
//                 color: page === n.key ? 'var(--sd-text-hi)' : n.disabled ? 'var(--sd-text-low)' : 'var(--sd-text-mid)',
//                 borderLeft: page === n.key ? '2px solid var(--sd-blue)' : '2px solid transparent',
//                 opacity: n.disabled ? 0.5 : 1,
//                 transition: 'all 0.2s ease',
//               }}
//             >
//               <span style={{ fontSize: 14 }}>{n.icon}</span>
//               {n.label}
//               {n.disabled && <span className="sd-eyebrow" style={{ marginLeft: 'auto', fontSize: 8.5 }}>soon</span>}
//             </button>
//           ))}
//         </nav>

//         <div style={{ marginTop: 'auto', padding: 12, borderRadius: 12, background: 'var(--sd-glass)', border: '1px solid var(--sd-glass-border)' }}>
//           <div className="sd-eyebrow" style={{ marginBottom: 4 }}>Plan</div>
//           <div style={{ fontSize: 12.5, color: 'var(--sd-text-mid)' }}>Personal · Free tier</div>
//         </div>
//       </aside>

//       {/* Main */}
//       <main style={{ flex: 1, padding: '24px 28px', maxWidth: 1180, margin: '0 auto', width: '100%' }}>
//         {page === 'dashboard' && <Dashboard />}
//         {page === 'files' && <Files />}
//       </main>

//       <style>{`
//         @media (max-width: 720px) {
//           .sd-sidebar { position: fixed; z-index: 20; height: 100vh; }
//         }
//       `}</style>
//     </div>
//   );
// }




import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import './styles/global.css';

/**
 * AppShell
 * ------------------------------------------------------------
 * Minimal sidebar + header layout wrapping the Dashboard and
 * Files pages built for this milestone. Swap the internal
 * `page` state for your router (react-router etc.) once auth
 * routing lands — the two pages don't depend on this shell.
 */

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦' },
  { key: 'files',     label: 'My Files',  icon: '▤' },
  { key: 'optimize',  label: 'Optimize',  icon: '✦', disabled: true },
  { key: 'settings',  label: 'Settings',  icon: '⚙', disabled: true },
];

export default function AppShell() {
  const [page, setPage] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('sd_theme') || 'light');

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sd_theme', next);
      return next;
    });
  };

  return (
    <div className="sd-root" data-theme={theme} style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220, flexShrink: 0, padding: '22px 14px', display: 'flex', flexDirection: 'column', gap: 26,
          borderRight: '1px solid var(--sd-glass-border)', background: 'rgba(255,255,255,0.02)',
        }}
        className="sd-sidebar"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' }}>
          <span
            style={{
              width: 30, height: 30, borderRadius: 9, background: 'var(--sd-grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, boxShadow: 'var(--sd-shadow-glow-blue)',
            }}
          >
            ◈
          </span>
          <span className="sd-h1" style={{ fontSize: 15 }}>Smart Drive</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map((n) => (
            <button
              key={n.key}
              disabled={n.disabled}
              onClick={() => setPage(n.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10,
                border: 'none', textAlign: 'left', fontSize: 13.5, cursor: n.disabled ? 'not-allowed' : 'pointer',
                background: page === n.key ? 'var(--sd-glass-strong)' : 'transparent',
                color: page === n.key ? 'var(--sd-text-hi)' : n.disabled ? 'var(--sd-text-low)' : 'var(--sd-text-mid)',
                borderLeft: page === n.key ? '2px solid var(--sd-blue)' : '2px solid transparent',
                opacity: n.disabled ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 14 }}>{n.icon}</span>
              {n.label}
              {n.disabled && <span className="sd-eyebrow" style={{ marginLeft: 'auto', fontSize: 8.5 }}>soon</span>}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="sd-theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ alignSelf: 'flex-start' }}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <div style={{ padding: 12, borderRadius: 12, background: 'var(--sd-glass)', border: '1px solid var(--sd-glass-border)' }}>
            <div className="sd-eyebrow" style={{ marginBottom: 4 }}>Plan</div>
            <div style={{ fontSize: 12.5, color: 'var(--sd-text-mid)' }}>Personal · Free tier</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '24px 28px', maxWidth: 1180, margin: '0 auto', width: '100%' }}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'files' && <Files />}
      </main>

      <style>{`
        @media (max-width: 720px) {
          .sd-sidebar { position: fixed; z-index: 20; height: 100vh; }
        }
      `}</style>
    </div>
  );
}