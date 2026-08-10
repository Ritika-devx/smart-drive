import { FileText, Image, Video, FolderOpen, AlertTriangle } from "lucide-react";

const TYPES = [
  { key: "documents", label: "Documents", color: "#5B8CFF", icon: FileText },
  { key: "images", label: "Images", color: "#34D399", icon: Image },
  { key: "videos", label: "Videos", color: "#FBBF24", icon: Video },
  { key: "others", label: "Others", color: "#A78BFA", icon: FolderOpen },
  { key: "largeIdle", label: "Large & Idle", color: "#FB7185", icon: AlertTriangle },
];

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function StorageChart({
  totalBytes = 0,
  breakdown = {},
  loading = false,
  onNavigate,
}) {
  const segments = TYPES.map((t) => ({ ...t, value: breakdown[t.key] || 0 }));
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const isEmpty = total === 0;

  let cumulative = 0;
  const gradientStops = isEmpty
    ? "var(--sd-border) 0% 100%"
    : segments
        .map((s) => {
          const pct = (s.value / total) * 100;
          const start = cumulative;
          cumulative += pct;
          return `${s.color} ${start}% ${cumulative}%`;
        })
        .join(", ");

  const usedPct = totalBytes ? Math.round((total / totalBytes) * 100) : 0;

  return (
    <div className="sd-card sd-storage-card">
      <div className="sd-eyebrow">STORAGE OVERVIEW</div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px 0",
            color: "var(--sd-text-low)",
          }}
        >
          Loading...
        </div>
      ) : (
        <>
          <div className="sd-donut-wrapper">
            <div
              className="sd-donut"
              style={{ background: `conic-gradient(${gradientStops})` }}
            >
              <div className="sd-donut-center">
                <h2>{formatBytes(total)}</h2>
                <span>
                  of {formatBytes(totalBytes)} — {usedPct}% Used
                </span>
              </div>
            </div>
          </div>

          {isEmpty ? (
            <div
              style={{
                textAlign: "center",
                padding: "10px 0 4px",
                color: "var(--sd-text-low)",
                fontSize: 13,
              }}
            >
              No files uploaded yet
            </div>
          ) : (
            <div className="sd-storage-legend">
              {segments
                .filter((s) => s.value > 0)
                .map((s) => {
                  const pct = Math.round((s.value / total) * 100) || 0;

                  return (
                    <div key={s.key} className="sd-storage-item">
                      <div className="sd-storage-left">
                        <span className="sd-storage-dot" style={{ background: s.color }} />
                        <span className="sd-storage-name">{s.label}</span>
                      </div>

                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span className="sd-storage-size">{formatBytes(s.value)}</span>
                        <span
                          style={{
                            fontSize: 12,
                            color: "var(--sd-text-low)",
                            width: 30,
                            textAlign: "right",
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}

      <button
        className="sd-btn sd-btn-primary"
        style={{ marginTop: 14, width: "100%", padding: 11, borderRadius: 12 }}
        onClick={() => onNavigate?.("files")}
      >
        View Detailed Breakdown →
      </button>
    </div>
  );
}