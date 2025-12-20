import { API_BASE_URL } from "./config";

export async function fetchWarState(shard_id) {
  const res = await fetch(`${API_BASE_URL}/war_api/war_state/${shard_id}`);
  if (!res.ok) throw new Error("Nie udało się pobrać danych wojny.");
  return res.json();
}
