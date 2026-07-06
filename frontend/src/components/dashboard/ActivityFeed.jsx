import React from 'react';

/**
 * ActivityFeed
 * ------------------------------------------------------------
 * Live-feeling timeline of storage events (uploads, deletes,
 * archives, optimization actions taken). Sourced from the
 * `activity` slice of GET /api/dashboard. Purely presentational —
 * pass `live` to show the pulsing "live" indicator when the feed
 * is actively polling / socket-connected.
 *
 * Props:
 *  events: [{ id, type: 'upload'|'delete'|'archive'|'flag', message, timestamp (ISO) }]
 *  live: boolean
 *  loading: boolean
 */

const EVENT_STYLE = {
  upload:  { color: 'var(--sd-blue)',   icon: '↑' },
  delete:  { color: 'var(--sd-rose)',   icon: '✕' },
  archive: { color: 'var(--sd-violet)', icon: '⧈' },
  flag:    { color: 'var(--sd-amber)',  icon: '!' },
  default: { color: 'var(--sd-slate)',  icon: '•' },
};

function timeAgo(iso) {
  if (!iso) return '—';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ActivityFeed({ events = [], live = true, loading = false }) {
  return (
    <div className="sd-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div className="sd-eyebrow">Activity</div>
          <div className="sd-h1" style={{ fontSize: 16, marginTop: 4 }}>What's happening</div>
        </div>
        {live && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="sd-live-dot" />
            <span className="sd-eyebrow" style={{ color: 'var(--sd-green)' }}>Live</span>
          </div>
        )}
      </div>

      <div className="sd-scrollbar" style={{ position: 'relative', maxHeight: 300, overflowY: 'auto', paddingLeft: 6 }}>
        <div style={{ position: 'absolute', left: 15, top: 4, bottom: 4, width: 1, background: 'var(--sd-glass-border)' }} />
        {loading && <div className="sd-eyebrow">Loading…</div>}
        {!loading && events.length === 0 && (
          <div style={{ color: 'var(--sd-text-low)', fontSize: 13, padding: '10px 0' }}>No recent activity.</div>
        )}
        {!loading && events.map((e, idx) => {
          const style = EVENT_STYLE[e.type] || EVENT_STYLE.default;
          return (
            <div key={e.id} className="sd-anim-in" style={{ display: 'flex', gap: 12, padding: '8px 0', animationDelay: `${idx * 45}ms` }}>
              <span
                style={{
                  width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--sd-bg-1)', border: `1px solid ${style.color}`, color: style.color,
                  fontSize: 10, flexShrink: 0, zIndex: 1, marginLeft: 2,
                }}
              >
                {style.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--sd-text-mid)' }}>{e.message}</div>
                <div className="sd-mono" style={{ fontSize: 10.5, color: 'var(--sd-text-low)', marginTop: 1 }}>
                  {timeAgo(e.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}