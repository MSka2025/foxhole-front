export async function fetchHexInfo(hex_id) {
  const res = await fetch(`http://127.0.0.1:8000/war_api/hex/${hex_id}`);
  if (!res.ok) throw new Error("Nie udało się pobrać informacji o hexie.");
  return res.json();
}
