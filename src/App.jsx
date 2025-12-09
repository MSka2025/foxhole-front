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
  const [timeRange, setTimeRange] = useState("all"); // all, 7d, 30d, 90d

  // --- Load hexes ---
  useEffect(() => {
    async function loadHexes() {
      const results = [];
      // Pobieramy wszystkie dostępne hexy dynamicznie
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

    let warData = null;

    try {
      // 1) Pobranie war state
      try {
        warData = await fetchWarState(shardId);
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
          range: warData
            ? fetchMapReportRange(shardId, selectedHexId, warData.conquestStartTime)
            : Promise.resolve([]),
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
            if (r.key === "range") setRangeData(r.value || []);
          } else {
            console.error(`${r.key} fetch failed:`, r.reason);
          }
        }
      } else {
        // Jeśli hex nie został wybrany, pobieramy tylko Victory
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

  // --- Funkcja filtrująca rangeData wg zakresu ---
  const getFilteredRangeData = () => {
    if (!rangeData || rangeData.length === 0) return [];

    if (timeRange === "all") return rangeData;

    const n = rangeData.length;
    let count;

    switch (timeRange) {
      case "7d":
        count = 7;
        break;
      case "30d":
        count = 15;
        break;
      case "90d":
        count = 30;
        break;
      default:
        count = n;
    }

    return rangeData.slice(Math.max(n - count, 0), n);
  };

  return (
    <div className="app-container">
      <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} blend={0.5} amplitude={1.0} speed={0.5} />

      <div className="main-panel">
        <h1 className="main-title">Foxhole War Tracker</h1>

        <div className="input-panel">
          {/* Shard */}
          <div className="input-group" style={{ position: "relative" }}>
            <label>Shard:</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className="shard-button" onClick={() => updateShard(shardId - 1)}>
                -
              </button>
              <div style={{ minWidth: "100px", textAlign: "center" }}>
                {shardInfo?.name || "(brak)"}
              </div>
              <button className="shard-button" onClick={() => updateShard(shardId + 1)}>
                +
              </button>
            </div>
          </div>

          {/* Hex */}
          <div className="input-group">
            <label>Hex:</label>
            <select
              value={selectedHexId || ""}
              onChange={(e) => setSelectedHexId(Number(e.target.value))}
            >
              <option value="">Wybierz hex...</option>
              {hexList.map((hex) => (
                <option key={hex.id} value={hex.id}>
                  {hex.name} (ID: {hex.id})
                </option>
              ))}
            </select>
          </div>

          {/* Zakres czasu */}
          <div className="input-group">
            <label>Zakres czasu:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #444",
                background: "#1e1e1e",
                color: "white",
                width: "150px",
              }}
            >
              <option value="all">Cała wojna</option>
              <option value="7d">Ostatnie 7 aktualizacji</option>
              <option value="30d">Ostatnie 15 aktualizacji</option>
              <option value="90d">Ostatnie 30 aktualizacji</option>
            </select>
          </div>

          <button
            className="fetch-button"
            onClick={handleFetch}
            disabled={loading || loadingWar || loadingVictory}
          >
            {loading ? "Ładowanie..." : "Pobierz"}
          </button>
        </div>

        {error && <p className="status-error">{error}</p>}
        {errorWar && <p className="status-error">{errorWar}</p>}
        {errorVictory && <p className="status-error">{errorVictory}</p>}

        {(warReport || victoryData || (report && hexInfo) || rangeData) && (
          <div className="war-and-hex-container">
            <div className="warstate-and-vt container">
              {warReport && <WarState report={warReport} warNumber={warReport.warNumber} />}
              {victoryData && <VictoryTownCard result={victoryData} />}
            </div>

            <div className="warstate-chart">
              {rangeData && <MapReportRangeChart data={getFilteredRangeData()} />}
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
