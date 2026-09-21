export function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

export function getStoredUser() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}