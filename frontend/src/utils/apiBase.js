const raw = import.meta.env.VITE_API_URL || "";
export const API_BASE = raw.replace(/\/api\/?$/, "");

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}