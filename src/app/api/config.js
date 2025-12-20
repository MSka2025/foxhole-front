// Frontend API configuration
// Uses Vite env (client-exposed keys must start with VITE_)

const rawBase = import.meta.env?.VITE_API_BASE_URL || "http://127.0.0.1:8000";
// normalize: remove trailing slashes
export const API_BASE_URL = String(rawBase).replace(/\/+$/, "");

export function buildApiUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}
