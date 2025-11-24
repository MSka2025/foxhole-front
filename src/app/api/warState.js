export async function fetchWarState(shard_id) {
  const res = await fetch(`http://127.0.0.1:8000/war_api/war_state/${shard_id}`);
  if (!res.ok) throw new Error("Nie udało się pobrać danych wojny.");
  return res.json();
}
