import { Upload, Trash2, Archive, AlertTriangle, ChevronRight } from 'lucide-react';

/**
 * ActivityFeed
 * ------------------------------------------------------------
 * "Live Activity" panel shown on the Dashboard. Pulled from the
 * `activity` slice of the GET /api/dashboard response (a 10-item
 * preview — the full log lives on the "Recent" sidebar page's
 * activity, if you need more history, use GET /api/activity).
 *
 * Props:
 *  events: [{ id, type, message, timestamp }]
 *  loading: boolean
 *  live: boolean - shows the "LIVE" badge in the header
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

export default function ActivityFeed({ events = [], loading = false, live = false }) {
  return (
    <div className="sd-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div className="sd-eyebrow">Live activity</div>
          <div className="sd-h1" style={{ fontSize: 16, marginTop: 4 }}>Recent Timeline</div>
        </div>
        {live && (
          <div className="sd-live">
            <span className="sd-live-dot" />
            LIVE
          </div>
        )}
      </div>

      <div className="sd-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 320, overflowY: 'auto' }}>
        {loading && <div className="sd-eyebrow">Loading activity…</div>}
        {!loading && events.length === 0 && (
          <div style={{ color: 'var(--sd-text-low)', fontSize: 13, padding: '10px 0' }}>No recent activity.</div>
        )}
        {!loading && events.map((event, index) => {
          const item = ACTIVITY_ICON[event.type] || ACTIVITY_ICON.upload;
          const Icon = item.icon;
          return (
            <div
              key={event.id ?? index}
              className="sd-anim-in"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px' }}
            >
              <div
                style={{
                  width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.color, flexShrink: 0,
                }}
              >
                <Icon size={15} color="#fff" />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--sd-text-hi)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {event.message}
                </div>
                <div className="sd-mono" style={{ fontSize: 11, color: 'var(--sd-text-low)' }}>
                  {timeAgo(event.timestamp)}
                </div>
              </div>
              <ChevronRight size={16} className="sd-activity-arrow" />
            </div>
          );
        })}
      </div>
    </div>
  );
}