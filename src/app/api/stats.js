import { API_BASE_URL } from "./config";

export async function fetchStats() {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) {
    throw new Error("Failed to fetch /stats");
  }
  return res.json();
}