import { useState, useEffect } from "react";
import MapReportCard from "./components/MapReportCard";
import WarState from "./components/WarState";
import VictoryTownCard from "./components/VictoryTownCard";
import { fetchMapReport } from "./app/api/mapReport";
import { fetchHexInfo } from "./app/api/hex";
import { fetchWarState } from "./app/api/warState";
import { fetchVictoryTowns } from "./app/api/victoryTowns";
import { fetchShardInfo } from "./app/api/shard";
import { fetchMapReportRange } from "./app/api/mapReportRange";
import MapReportRangeChart from "./components/MapReportRangeChart";
import Aurora from "./components/Aurora";
import "./App.css";

export default function App() {
const [hexQuery, setHexQuery] = useState("");
const [selectedHexId, setSelectedHexId] = useState(null);

const [report, setReport] = useState(null);
const [hexInfo, setHexInfo] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const [shardId, setShardId] = useState(1);
const [shardInfo, setShardInfo] = useState(null);

const [warReport, setWarReport] = useState(null);
const [loadingWar, setLoadingWar] = useState(false);
const [errorWar, setErrorWar] = useState(null);

const [victoryData, setVictoryData] = useState(null);
const [loadingVictory, setLoadingVictory] = useState(false);
const [errorVictory, setErrorVictory] = useState(null);

const [rangeData, setRangeData] = useState(null);

const [hexList, setHexList] = useState([]);
const [filteredHexList, setFilteredHexList] = useState([]);

useEffect(() => {
async function loadHexes() {
const results = [];
for (let i = 1; i <= 43; i++) {
try {
const hex = await fetchHexInfo(i);
if (hex?.name) results.push({ id: i, name: hex.name });
} catch (err) {}
}
setHexList(results);
}
loadHexes();
}, []);

const handleHexChange = (e) => {
const value = e.target.value;
setHexQuery(value);


const onlyDigits = /^\d+$/.test(value.trim());
if (onlyDigits) {
  setSelectedHexId(Number(value.trim()));
} else {
  setSelectedHexId(null);
}

if (!value) {
  setFilteredHexList([]);
  return;
}

const filtered = hexList.filter((hex) =>
  hex.name.toLowerCase().includes(value.toLowerCase())
);
setFilteredHexList(filtered);


};

const handleSelectSuggestion = (hex) => {
setHexQuery(hex.name);
setSelectedHexId(hex.id);
setFilteredHexList([]);
};

const updateShard = async (newId) => {
if (newId < 1) return;
setShardId(newId);


try {
  const info = await fetchShardInfo(newId);
  setShardInfo(info);
} catch (err) {
  console.error("fetchShardInfo failed:", err);
  try {
    const firstShard = await fetchShardInfo(1);
    setShardId(1);
    setShardInfo(firstShard);
  } catch (err2) {
    console.error("fallback fetchShardInfo failed:", err2);
  }
}


};

useEffect(() => {
updateShard(shardId);
}, []);

const handleFetch = async () => {
setError(null);
setErrorWar(null);
setErrorVictory(null);


let errorMap = null;
let errorHexLocal = null;
let errorRangeLocal = null;
let errorVictoryLocal = null;

if (!shardId) {
  setError("Musisz podać Shard ID.");
  setReport(null);
  setHexInfo(null);
  setWarReport(null);
  setVictoryData(null);
  setRangeData(null);
  return;
}

setLoading(true);
setLoadingWar(true);
setLoadingVictory(true);

try {
  // 1) War state
  try {
    const warData = await fetchWarState(shardId);
    setWarReport(warData);
  } catch (err) {
    console.error("fetchWarState error:", err);
    setErrorWar("Nie udało się pobrać danych wojny.");
    setWarReport(null);
  }

  // 2) Map + Hex + Victory + Range
  if (selectedHexId !== null && selectedHexId !== undefined && selectedHexId !== "") {
    const promises = {
      map: fetchMapReport(shardId, selectedHexId),
      hex: fetchHexInfo(selectedHexId),
      victory: fetchVictoryTowns(shardId),
      range: fetchMapReportRange(shardId, selectedHexId),
    };

    const entries = Object.entries(promises);
    const settled = await Promise.all(
      entries.map(([k, p]) =>
        p
          .then((res) => ({ key: k, status: "fulfilled", value: res }))
          .catch((err) => ({ key: k, status: "rejected", reason: err }))
      )
    );

    for (const r of settled) {
      if (r.status === "fulfilled") {
        if (r.key === "map") setReport(r.value);
        if (r.key === "hex") setHexInfo(r.value);
        if (r.key === "victory") setVictoryData(r.value);
        if (r.key === "range") {
          // --- NORMALIZACJA ---
          let rangeArray = Array.isArray(r.value) ? r.value : r.value?.results || [];
          setRangeData(rangeArray);
        }
      } else {
        console.error(`${r.key} fetch failed:`, r.reason);
        if (r.key === "map") {
          errorMap = "Nie udało się pobrać map report (map).";
          setReport(null);
        }
        if (r.key === "hex") {
          errorHexLocal = "Nie udało się pobrać informacji o hexie.";
          setHexInfo(null);
        }
        if (r.key === "victory") {
          errorVictoryLocal = "Nie udało się pobrać danych Victory Towns.";
          setVictoryData(null);
        }
        if (r.key === "range") {
          errorRangeLocal = "Nie udało się pobrać historii (range) dla hexa.";
          setRangeData(null);
        }
      }
    }

    if (errorMap || errorHexLocal || errorRangeLocal || errorVictoryLocal) {
      setError("Podany Shard ID lub Hex ID jest nieprawidłowy lub API nie odpowiada.");
      if (errorVictoryLocal) setErrorVictory(errorVictoryLocal);
    }
  } else {
    try {
      const victory = await fetchVictoryTowns(shardId);
      setVictoryData(victory);
      setReport(null);
      setHexInfo(null);
      setRangeData(null);
    } catch (err) {
      console.error("fetchVictoryTowns error:", err);
      setErrorVictory("Nie udało się pobrać danych Victory Towns.");
      setVictoryData(null);
    }
  }
} catch (err) {
  console.error("handleFetch unexpected error:", err);
  setError("Wystąpił nieoczekiwany błąd podczas pobierania danych.");
} finally {
  setLoading(false);
  setLoadingWar(false);
  setLoadingVictory(false);
}


};

// --- DEBUG rangeData ---
useEffect(() => {
console.log("rangeData:", rangeData);
}, [rangeData]);

return ( <div className="app-container">
<Aurora
colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
blend={0.5}
amplitude={1.0}
speed={0.5}
/>


  <div className="main-panel">
    <h1 className="main-title">Foxhole War Tracker</h1>

    <div className="input-panel">
      <div className="input-group" style={{ position: "relative" }}>
        <label>Shard:</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            className="shard-button"
            onClick={() => updateShard(shardId - 1)}
          >
            -
          </button>

          <div style={{ minWidth: "100px", textAlign: "center" }}>
            {shardInfo?.name || "(brak)"}
          </div>

          <button
            className="shard-button"
            onClick={() => updateShard(shardId + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="input-group" style={{ position: "relative" }}>
        <label>Hex (nazwa lub ID):</label>

        <input
          type="text"
          value={hexQuery}
          onChange={handleHexChange}
          placeholder="np. Deadlands, Umbral Wildwood lub 12"
        />

        {filteredHexList.length > 0 && (
          <div className="autocomplete-list" style={{ position: "absolute", top: "100%", left: 0, width: "100%", maxWidth: 320 }}>
            {filteredHexList.slice(0, 10).map((hex) => (
              <div
                key={hex.id}
                className="autocomplete-item"
                onClick={() => handleSelectSuggestion(hex)}
              >
                {hex.name} (ID: {hex.id})
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="fetch-button" onClick={handleFetch} disabled={loading || loadingWar || loadingVictory}>
        {loading ? "Ładowanie..." : "Pobierz"}
      </button>
    </div>

    {error && <p className="status-error">{error}</p>}
    {errorWar && <p className="status-error">{errorWar}</p>}
    {errorVictory && <p className="status-error">{errorVictory}</p>}

    {(warReport || victoryData || (report && hexInfo) || rangeData) && (
      <div className="war-and-hex-container">
        <div className="warstate-and-vt container">
          {warReport && (
            <WarState report={warReport} warNumber={warReport.warNumber} />
          )}

          {victoryData && <VictoryTownCard result={victoryData} />}
        </div>

        <div className="warstate-chart">
          {rangeData && (
            <MapReportRangeChart data={rangeData} />
          )}
        </div>

        {report && hexInfo && (
          <div className="report-container">
            <MapReportCard report={report} hexName={hexInfo.name} />
            <img
              src={
                report.colonialCasualties > report.wardenCasualties
                  ? "/images/colonials.jfif"
                  : "/images/wardens.jfif"
              }
              alt="Wynik bitwy"
              className="result-image"
            />
          </div>
        )}
      </div>
    )}
  </div>
</div>


);
}
