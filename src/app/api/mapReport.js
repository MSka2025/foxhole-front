export async function fetchMapReport(shardId, hexId) {
  const res = await fetch(`http://127.0.0.1:8000/war_api/map_report/${shardId}/${hexId}`);
  if (!res.ok) throw new Error("Nie udało się pobrać danych mapy.");
  return res.json();
}
