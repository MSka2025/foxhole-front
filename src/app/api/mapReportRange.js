// app/api/mapReportRange.js
export async function fetchMapReportRange(shardId, hexId) {
  const url = `http://127.0.0.1:8000/war_api/map_report/range/${shardId}/${hexId}/?datetime_from=2025-01-01&datetime_to=2027-01-01`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać danych mapy: ${response.status}`);
  }
  return await response.json();
}
