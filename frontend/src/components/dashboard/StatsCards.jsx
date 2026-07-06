// import React from 'react';

/**
 * StatsCards
 * ------------------------------------------------------------
 * Row of quick-summary metric cards for the dashboard header.
 * Each card carries an accent color mapped to what the metric
 * means for storage health (neutral blue for counts, amber for
 * duplicates, rose for waste, etc).
 *
 * Props:
 *  stats: {
 *    totalFiles, totalStorage (bytes), duplicateFiles,
 *    oldUnusedFiles, largeFiles, wastedStorage (bytes)
 *  }
 *  loading: boolean
 */

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0, v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

const CARD_DEFS = [
  { key: 'totalFiles',     label: 'Total files',      icon: '▤', color: 'var(--sd-blue)',   format: (v) => v?.toLocaleString?.() ?? v },
  { key: 'totalStorage',   label: 'Storage used',     icon: '◈', color: 'var(--sd-violet)', format: formatBytes },
  { key: 'duplicateFiles', label: 'Duplicate files',  icon: '⧉', color: 'var(--sd-amber)',  format: (v) => v?.toLocaleString?.() ?? v },
  { key: 'oldUnusedFiles', label: 'Old & unused',     icon: '◔', color: 'var(--sd-slate)',  format: (v) => v?.toLocaleString?.() ?? v },
  { key: 'largeFiles',     label: 'Large files',      icon: '▲', color: 'var(--sd-rose)',   format: (v) => v?.toLocaleString?.() ?? v },
  { key: 'wastedStorage',  label: 'Wasted storage',   icon: '⚠', color: 'var(--sd-amber)',  format: formatBytes },
];

export default function StatsCards({ stats = {}, loading = false }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 14,
      }}
    >
      {CARD_DEFS.map((def, idx) => (
        <div
          key={def.key}
          className="sd-card sd-anim-in"
          style={{
            padding: '16px 18px',
            animationDelay: `${idx * 60}ms`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute', top: -30, right: -30, width: 90, height: 90, borderRadius: '50%',
              background: def.color, opacity: 0.12, filter: 'blur(18px)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span
              style={{
                width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, background: 'rgba(255,255,255,0.06)', color: def.color, border: '1px solid var(--sd-glass-border)',
              }}
            >
              {def.icon}
            </span>
            <span className="sd-eyebrow">{def.label}</span>
          </div>
          <div className="sd-mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--sd-text-hi)' }}>
            {loading ? '—' : def.format(stats[def.key])}
          </div>
        </div>
      ))}
    </div>
  );
}