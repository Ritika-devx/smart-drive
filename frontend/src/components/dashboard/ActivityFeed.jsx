import {
  Upload,
  Trash2,
  Archive,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

function timeAgo(date) {
  if (!date) return "-";

  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;

  const days = Math.floor(hrs / 24);
  return `${days} day ago`;
}

const icons = {
  upload: { icon: Upload, color: "#4f8cff" },
  delete: { icon: Trash2, color: "#ef4444" },
  archive: { icon: Archive, color: "#7c5cff" },
  flag: { icon: AlertTriangle, color: "#f59e0b" },
};

export default function ActivityFeed({ events = [], loading = false, live = true }) {
  return (
    <div className="sd-card sd-activity-card">
      <div className="sd-activity-header">
        <div>
          <div className="sd-eyebrow">LIVE ACTIVITY</div>
          <div className="sd-activity-title">Recent Timeline</div>
        </div>

        {live && (
          <div className="sd-live">
            <span className="sd-live-dot" />
            LIVE
          </div>
        )}
      </div>

      <div className="sd-activity-list">
        {loading && <div className="sd-activity-empty">Loading activity...</div>}

        {!loading && events.length === 0 && (
          <div className="sd-activity-empty">No recent activity</div>
        )}

        {!loading &&
          events.map((event, index) => {
            const item = icons[event.type] || icons.upload;
            const Icon = item.icon;

            return (
              <div
                key={event.id ?? index}
                className="sd-activity-item"
                style={{ animation: `fadeUp .45s ease ${index * 0.08}s both` }}
              >
                <div className="sd-activity-icon" style={{ background: item.color }}>
                  <Icon size={18} color="#fff" />
                </div>

                <div className="sd-activity-content">
                  <div className="sd-activity-text">{event.message}</div>
                  <div className="sd-activity-time">{timeAgo(event.timestamp)}</div>
                </div>

                <ChevronRight size={18} className="sd-activity-arrow" />
              </div>
            );
          })}
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button
          className="sd-btn sd-btn-primary"
          style={{ width: "100%", padding: "12px", borderRadius: 14, fontSize: 14 }}
        >
          View Full Activity
        </button>
      </div>
    </div>
  );
}