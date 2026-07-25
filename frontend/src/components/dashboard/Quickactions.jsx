import { Upload, FolderOpen, Sparkles, Trash2 } from "lucide-react";

const actions = [
  { title: "Upload Files", icon: Upload, color: "#4f8cff", page: "upload" },
  { title: "My Files", icon: FolderOpen, color: "#22c55e", page: "files" },
  { title: "Smart Suggestions", icon: Sparkles, color: "#7c5cff", page: "suggestions" },
  { title: "Trash", icon: Trash2, color: "#ef4444", page: "trash" },
];

export default function Quickactions({ onNavigate }) {
  return (
    <div className="sd-card sd-quick-card">
      <div className="sd-quick-title">Quick Actions</div>

      <div className="sd-quick-grid">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="sd-quick-btn"
              onClick={() => onNavigate?.(action.page)}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: action.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon color="#fff" size={20} />
              </div>
              <span>{action.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}