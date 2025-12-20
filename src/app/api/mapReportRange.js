// app/api/mapReportRange.js
import { API_BASE_URL } from "./config";

export async function fetchMapReportRange(shardId, hexId, warStartTime) {
  const datetimeFrom = warStartTime.split("T")[0];  // wyciągamy YYYY-MM-DD
  const datetimeTo = "2027-01-01";                 // lub dynamicznie później

  const url = `${API_BASE_URL}/war_api/map_report/range/${shardId}/${hexId}/?datetime_from=${datetimeFrom}&datetime_to=${datetimeTo}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać danych mapy: ${response.status}`);
  }
  console.log("fetchMapReportRange FROM:", datetimeFrom);
  console.log("fetchMapReportRange URL:", url);

  return await response.json();
}
