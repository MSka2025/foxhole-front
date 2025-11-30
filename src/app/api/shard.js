export async function fetchShardInfo(shard_id) {
  const res = await fetch(`http://127.0.0.1:8000/war_api/shard/${shard_id}`);
  if (!res.ok) throw new Error("Nie udało się pobrać informacji o shardzie.");
  return res.json();
}
