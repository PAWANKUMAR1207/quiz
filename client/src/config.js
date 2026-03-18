const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://quiz-1-mb5q.onrender.com"
).trim();

export function apiUrl(path) {
  return `${API_BASE_URL}${path}`;
}
