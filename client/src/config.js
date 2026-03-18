const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim();

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}
