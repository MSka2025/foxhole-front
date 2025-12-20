import { API_BASE_URL } from "./config";

export async function fetchMapReport(shardId, hexId) {
  const res = await fetch(`${API_BASE_URL}/war_api/map_report/${shardId}/${hexId}`);
  if (!res.ok) throw new Error("Nie udało się pobrać danych mapy.");
  return res.json();
}
