import {
  Folder,
  HardDrive,
  Copy,
  Clock3,
  FileWarning,
  Trash2,
} from "lucide-react";

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let i = 0;

  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }

  return `${value.toFixed(1)} ${units[i]}`;
}

const cards = [
  { title: "Files", key: "totalFiles", icon: Folder, color: "#4F8CFF", sub: "Stored" },
  { title: "Storage", key: "totalStorage", icon: HardDrive, color: "#06D6A0", bytes: true, sub: "Used" },
  { title: "Duplicates", key: "duplicateFiles", icon: Copy, color: "#F59E0B", sub: "Detected" },
  { title: "Unused", key: "oldUnusedFiles", icon: Clock3, color: "#8B5CF6", sub: "Old Files" },
  { title: "Large", key: "largeFiles", icon: FileWarning, color: "#EF4444", sub: "Heavy Files" },
  { title: "Wasted", key: "wastedStorage", icon: Trash2, color: "#F97316", bytes: true, sub: "Recoverable" },
];

export default function StatsCards({ stats = {}, loading = false }) {
  return (
    <div className="sd-stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.key} className="sd-stat-card">
            <div className="sd-stat-top">
              <div>
                <div className="sd-stat-title">{card.title}</div>

                <div className="sd-stat-value">
                  {loading
                    ? "--"
                    : card.bytes
                    ? formatBytes(stats[card.key] || 0)
                    : stats[card.key] || 0}
                </div>

                <div className="sd-stat-sub">{card.sub}</div>
              </div>

              <div className="sd-stat-icon" style={{ background: card.color }}>
                <Icon size={18} color="#fff" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}