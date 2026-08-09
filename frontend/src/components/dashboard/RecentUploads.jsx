// // import React from 'react';

// /**
//  * RecentUploads
//  * ------------------------------------------------------------
//  * Compact list of the most recently uploaded files, shown on
//  * the dashboard. Pulled from the `recentUploads` slice of the
//  * GET /api/dashboard response.
//  *
//  * Props:
//  *  files: [{ id, name, type, size (bytes), uploadedAt (ISO) }]
//  *  loading: boolean
//  */

// const TYPE_ICON = {
//   image: '🖼', pdf: '▤', video: '▶', audio: '♫', archive: '⧉', doc: '▤', default: '◈',
// };

// function formatBytes(bytes) {
//   if (!bytes && bytes !== 0) return '—';
//   const units = ['B', 'KB', 'MB', 'GB'];
//   let i = 0, v = bytes;
//   while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
//   return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
// }

// function timeAgo(iso) {
//   if (!iso) return '—';
//   const diffMs = Date.now() - new Date(iso).getTime();
//   const mins = Math.floor(diffMs / 60000);
//   if (mins < 1) return 'just now';
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h ago`;
//   const days = Math.floor(hrs / 24);
//   return `${days}d ago`;
// }

// export default function RecentUploads({ files = [], loading = false }) {
//   return (
//     <div className="sd-card" style={{ padding: 20 }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
//         <div>
//           <div className="sd-eyebrow">Recent uploads</div>
//           <div className="sd-h1" style={{ fontSize: 16, marginTop: 4 }}>Just landed</div>
//         </div>
//       </div>

//       <div className="sd-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280, overflowY: 'auto' }}>
//         {loading && <div className="sd-eyebrow">Loading…</div>}
//         {!loading && files.length === 0 && (
//           <div style={{ color: 'var(--sd-text-low)', fontSize: 13, padding: '10px 0' }}>Nothing uploaded yet.</div>
//         )}
//         {!loading && files.map((f, idx) => (
//           <div
//             key={f.id}
//             className="sd-anim-in"
//             style={{
//               display: 'flex', alignItems: 'center', gap: 12, padding: '9px 8px',
//               borderRadius: 10, transition: 'background 0.2s ease', animationDelay: `${idx * 45}ms`,
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.045)')}
//             onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
//           >
//             <span
//               style={{
//                 width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 background: 'rgba(91,124,255,0.1)', border: '1px solid var(--sd-glass-border)', fontSize: 14, flexShrink: 0,
//               }}
//             >
//               {TYPE_ICON[f.type] || TYPE_ICON.default}
//             </span>
//             <div style={{ minWidth: 0, flex: 1 }}>
//               <div style={{ fontSize: 13.5, color: 'var(--sd-text-hi)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                 {f.name}
//               </div>
//               <div className="sd-mono" style={{ fontSize: 11, color: 'var(--sd-text-low)' }}>
//                 {formatBytes(f.size)} · {timeAgo(f.uploadedAt)}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// import React from 'react';

/**
 * RecentUploads
 * ------------------------------------------------------------
 * Compact list of the most recently uploaded files, shown on
 * the dashboard. Pulled from the `recentUploads` slice of the
 * GET /api/dashboard response.
 *
 * Props:
 *  files: [{ id, name, type, size (bytes), uploadedAt (ISO) }]
 *  loading: boolean
 */

const TYPE_ICON = {
  image: '🖼', pdf: '▤', video: '▶', audio: '♫', archive: '⧉', doc: '▤', default: '◈',
};

const PREVIEWABLE_TYPES = ['image', 'pdf'];

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function openFile(file) {
  try {
    const res = await fetch(`/api/download/${file.id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Could not open file');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    if (PREVIEWABLE_TYPES.includes((file.type || '').toLowerCase())) {
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  } catch (err) {
    window.alert(err.message || 'Could not open file.');
  }
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0, v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function timeAgo(iso) {
  if (!iso) return '—';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function RecentUploads({ files = [], loading = false }) {
  return (
    <div className="sd-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div className="sd-eyebrow">Recent uploads</div>
          <div className="sd-h1" style={{ fontSize: 16, marginTop: 4 }}>Just landed</div>
        </div>
      </div>

      <div className="sd-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280, overflowY: 'auto' }}>
        {loading && <div className="sd-eyebrow">Loading…</div>}
        {!loading && files.length === 0 && (
          <div style={{ color: 'var(--sd-text-low)', fontSize: 13, padding: '10px 0' }}>Nothing uploaded yet.</div>
        )}
        {!loading && files.map((f, idx) => (
          <div
            key={f.id}
            className="sd-anim-in"
            onClick={() => openFile(f)}
            title={PREVIEWABLE_TYPES.includes((f.type || '').toLowerCase()) ? 'Open' : 'Download'}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '9px 8px',
              borderRadius: 10, transition: 'background 0.2s ease', animationDelay: `${idx * 45}ms`,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.045)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span
              style={{
                width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(91,124,255,0.1)', border: '1px solid var(--sd-glass-border)', fontSize: 14, flexShrink: 0,
              }}
            >
              {TYPE_ICON[f.type] || TYPE_ICON.default}
            </span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13.5, color: 'var(--sd-text-hi)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {f.name}
              </div>
              <div className="sd-mono" style={{ fontSize: 11, color: 'var(--sd-text-low)' }}>
                {formatBytes(f.size)} · {timeAgo(f.uploadedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}