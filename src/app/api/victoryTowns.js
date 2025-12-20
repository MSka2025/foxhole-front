import { API_BASE_URL } from "./config";

export async function fetchVictoryTowns(shardId) {
  const res = await fetch(`${API_BASE_URL}/war_api/dynamic_data/${shardId}`);
  if (!res.ok) throw new Error("Nie udało się pobrać danych dynamicznych.");
  const data = await res.json();

  let wardens = 0;
  let colonials = 0;
  let neutral = 0;

  data.forEach(region => {
    region.mapItems.forEach(item => {
      // Victory Town = flags contains IsVictoryBase = 0x01
      if ((item.flags & 0x01) !== 0) {
        if (item.teamId === "WARDENS") wardens++;
        else if (item.teamId === "COLONIALS") colonials++;
        else neutral++;
      }
    });
  });

  return { wardens, colonials, neutral };
}
