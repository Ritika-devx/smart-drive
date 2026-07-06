import { useMemo, useState } from 'react';

/**
 * StorageChart
 * ------------------------------------------------------------
 * The signature visual of the dashboard: a layered radial ring
 * that reads storage composition the way a scan reads layers —
 * healthy files as the base ring, duplicate / old / large as
 * concentric bands stacked outward. Each band's arc length is
 * proportional to its share of total storage. Hovering a band
 * (or its legend row) highlights the arc and reveals the exact
 * figure — this is meant to feel like a diagnostic, not a donut.
 *
 * Props:
 *  totalBytes      number
 *  breakdown       { normal, duplicate, old, large } in bytes
 *  loading         boolean
 */

const RING_ORDER = [
  { key: 'normal',    label: 'Healthy',   color: 'var(--sd-green)' },
  { key: 'duplicate', label: 'Duplicate', color: 'var(--sd-amber)' },
  { key: 'old',       label: 'Old / Unused', color: 'var(--sd-slate)' },
  { key: 'large',     label: 'Large & idle', color: 'var(--sd-rose)' },
];

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0, v = bytes;
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const s = (Math.PI / 180) * (startDeg - 90);
  const e = (Math.PI / 180) * (endDeg - 90);
  const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

export default function StorageChart({ totalBytes = 0, breakdown = {}, loading = false }) {
  const [hovered, setHovered] = useState(null);

  const rings = useMemo(() => {
    const safeTotal = totalBytes || 1;
    return RING_ORDER.map((r, idx) => {
      const value = breakdown[r.key] || 0;
      const pct = value / safeTotal;
      const startDeg = RING_ORDER
        .slice(0, idx)
        .reduce((sum, item) => sum + ((breakdown[item.key] || 0) / safeTotal), 0) * 360;
      const sweep = Math.max(pct * 360, value > 0 ? 4 : 0); // min visible sweep
      return {
        ...r,
        value,
        pct,
        radius: 86 - idx * 18,
        startDeg,
        endDeg: startDeg + sweep,
      };
    });
  }, [breakdown, totalBytes]);

  const wastedBytes = (breakdown.duplicate || 0) + (breakdown.old || 0);

  return (
    <div className="sd-card" style={{ padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div className="sd-eyebrow">Storage composition</div>
          <div className="sd-h1" style={{ fontSize: 17, marginTop: 4 }}>Where your space is going</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ flexShrink: 0 }}>
          <defs>
            <filter id="sd-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform="translate(100,100)">
            {/* base track rings */}
            {rings.map((r) => (
              <circle key={`track-${r.key}`} cx={0} cy={0} r={r.radius} fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth={11} />
            ))}
            {/* value arcs */}
            {rings.map((r) => (
              r.value > 0 && (
                <path
                  key={r.key}
                  d={arcPath(0, 0, r.radius, r.startDeg, r.endDeg)}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={hovered === r.key ? 14 : 11}
                  strokeLinecap="round"
                  filter={hovered === r.key ? 'url(#sd-glow)' : undefined}
                  opacity={hovered && hovered !== r.key ? 0.35 : 1}
                  style={{ transition: 'all 0.3s cubic-bezier(.16,1,.3,1)', cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(r.key)}
                  onMouseLeave={() => setHovered(null)}
                />
              )
            ))}
          </g>
          <text x="100" y="94" textAnchor="middle" fill="var(--sd-text-hi)" fontFamily="var(--sd-font-mono)" fontSize="19" fontWeight="600">
            {formatBytes(totalBytes)}
          </text>
          <text x="100" y="114" textAnchor="middle" fill="var(--sd-text-low)" fontFamily="var(--sd-font-mono)" fontSize="10" letterSpacing="0.08em">
            TOTAL USED
          </text>
        </svg>

        <div style={{ flex: 1, minWidth: 180 }}>
          {rings.map((r) => (
            <div
              key={r.key}
              onMouseEnter={() => setHovered(r.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 8px', borderRadius: 8, cursor: 'pointer',
                background: hovered === r.key ? 'rgba(255,255,255,0.05)' : 'transparent',
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: r.color, display: 'inline-block' }} />
                <span style={{ fontSize: 13, color: 'var(--sd-text-mid)' }}>{r.label}</span>
              </div>
              <span className="sd-mono" style={{ fontSize: 12.5, color: 'var(--sd-text-hi)' }}>
                {formatBytes(r.value)}
              </span>
            </div>
          ))}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--sd-glass-border)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12.5, color: 'var(--sd-text-low)' }}>Reclaimable</span>
            <span className="sd-mono" style={{ fontSize: 13, color: 'var(--sd-amber)', fontWeight: 600 }}>
              {formatBytes(wastedBytes)}
            </span>
          </div>
        </div>
      </div>
      {loading && <div className="sd-eyebrow" style={{ marginTop: 10 }}>Syncing…</div>}
    </div>
  );
}