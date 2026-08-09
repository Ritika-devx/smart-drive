import { useEffect, useState, useCallback } from 'react';
import { Upload, Trash2, Archive, AlertTriangle, ChevronRight } from 'lucide-react';

/**
 * Recent
 * ------------------------------------------------------------
 * Full activity log (uploads, downloads, deletes, archives...).
 * This used to live as a "Recent Activity" section on the
 * Dashboard — moved here to its own sidebar page instead.
 */

const ACTIVITY_ICON = {
  upload: { icon: Upload, color: '#4f8cff' },
  delete: { icon: Trash2, color: '#ef4444' },
  archive: { icon: Archive, color: '#7c5cff' },
  flag: { icon: AlertTriangle, color: '#f59e0b' },
};

function timeAgo(iso) {
  if (!iso) return '-';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day ago`;
}

export default function Recent() {
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(null);

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadActivity = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch('/api/activity', { headers: authHeaders() });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = await res.json();
      setActivity(json.activity || []);
    } catch (err) {
      setError(err.message || 'Could not load activity.');
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!active) return;
      await loadActivity();
    })();
    return () => { active = false; };
  }, [loadActivity]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="sd-eyebrow">Activity</div>
          <h1 className="sd-h1" style={{ fontSize: 26, margin: '6px 0 0' }}>Recent</h1>
        </div>
        <div className="sd-live">
          <span className="sd-live-dot" />
          LIVE
        </div>
      </div>

      {error && (
        <div className="sd-card" style={{ padding: 14, borderColor: 'rgba(251,91,124,0.4)', color: 'var(--sd-rose)', fontSize: 13 }}>
          {error}
        </div>
      )}

      <div className="sd-card" style={{ padding: 8 }}>
        {activity === null && <div className="sd-eyebrow" style={{ padding: 16 }}>Loading activity…</div>}
        {activity !== null && activity.length === 0 && (
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--sd-text-low)', fontSize: 13 }}>
            No recent activity.
          </div>
        )}
        {activity !== null && activity.map((event, idx) => {
          const item = ACTIVITY_ICON[event.type] || ACTIVITY_ICON.upload;
          const Icon = item.icon;
          return (
            <div
              key={event.id ?? idx}
              className="sd-anim-in"
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 10px',
                borderBottom: idx < activity.length - 1 ? '1px solid var(--sd-glass-border)' : 'none',
                animationDelay: `${idx * 30}ms`,
              }}
            >
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.color, flexShrink: 0,
                }}
              >
                <Icon size={17} color="#fff" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--sd-text-hi)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {event.message}
                </div>
                <div className="sd-mono" style={{ fontSize: 11, color: 'var(--sd-text-low)' }}>
                  {timeAgo(event.timestamp)}
                </div>
              </div>
              <ChevronRight size={18} className="sd-activity-arrow" />
            </div>
          );
        })}
      </div>
    </div>
  );
}