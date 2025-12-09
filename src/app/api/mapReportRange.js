// app/api/mapReportRange.js
export async function fetchMapReportRange(shardId, hexId, warStartTime) {
  const datetimeFrom = warStartTime.split("T")[0];  // wyciągamy YYYY-MM-DD
  const datetimeTo = "2027-01-01";                 // lub dynamicznie później

  const url = `http://127.0.0.1:8000/war_api/map_report/range/${shardId}/${hexId}/?datetime_from=${datetimeFrom}&datetime_to=${datetimeTo}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać danych mapy: ${response.status}`);
  }
  console.log("fetchMapReportRange FROM:", datetimeFrom);
  console.log("fetchMapReportRange URL:", url);

  return await response.json();
}
