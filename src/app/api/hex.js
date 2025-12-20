import { API_BASE_URL } from "./config";

export async function fetchHexInfo(hex_id) {
  const res = await fetch(`${API_BASE_URL}/war_api/hex/${hex_id}`);
  if (!res.ok) throw new Error("Nie udało się pobrać informacji o hexie.");
  return res.json();
}
