import { API_BASE_URL } from "./config";

export async function fetchShardInfo(shard_id) {
  const res = await fetch(`${API_BASE_URL}/war_api/shard/${shard_id}`);
  if (!res.ok) throw new Error("Nie udało się pobrać informacji o shardzie.");
  return res.json();
}
