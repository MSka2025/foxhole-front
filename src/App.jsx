import { useState } from "react";
import MapReportCard from "./components/MapReportCard";
import WarState from "./components/WarState";
import VictoryTownCard from "./components/VictoryTownCard";
import { fetchMapReport } from "./app/api/mapReport";
import { fetchHexInfo } from "./app/api/hex";
import { fetchWarState } from "./app/api/warState";
import { fetchVictoryTowns } from "./app/api/victoryTowns";
import Aurora from "./components/Aurora";
import "./App.css";

export default function App() {
  const [hexId, setHexId] = useState("");
  const [report, setReport] = useState(null);
  const [hexInfo, setHexInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shardId, setShardId] = useState("");

  // War state
  const [warReport, setWarReport] = useState(null);
  const [loadingWar, setLoadingWar] = useState(false);
  const [errorWar, setErrorWar] = useState(null);

  // Victory Towns
  const [victoryData, setVictoryData] = useState(null);
  const [loadingVictory, setLoadingVictory] = useState(false);
  const [errorVictory, setErrorVictory] = useState(null);

  const handleFetch = async () => {
    if (!shardId) {
      setError("Musisz podać Shard ID.");
      setReport(null);
      setHexInfo(null);
      setWarReport(null);
      setVictoryData(null);
      return;
    }

    setLoading(true);
    setLoadingWar(true);
    setLoadingVictory(true);
    setError(null);
    setErrorWar(null);
    setErrorVictory(null);

    try {
      // Pobierz dane wojny
      const warData = await fetchWarState(shardId);
      setWarReport(warData);

      // Pobierz dane mapy tylko jeśli wpisano hexId
      if (hexId) {
        const [mapData, hexData, victory] = await Promise.all([
          fetchMapReport(shardId, hexId),
          fetchHexInfo(hexId),
          fetchVictoryTowns(shardId),
        ]);

        setReport(mapData);
        setHexInfo(hexData);
        setVictoryData(victory);
      } else {
        // jeśli brak hexId, pobieramy tylko victory towns
        const victory = await fetchVictoryTowns(shardId);
        setVictoryData(victory);

        setReport(null);
        setHexInfo(null);
      }
    } catch (err) {
      console.error(err);
      setError("Podany Shard ID lub Hex ID jest nieprawidłowy lub API nie odpowiada.");
      setErrorWar("Nie udało się pobrać danych wojny.");
      setErrorVictory("Nie udało się pobrać danych Victory Towns.");
      setReport(null);
      setHexInfo(null);
      setWarReport(null);
      setVictoryData(null);
    } finally {
      setLoading(false);
      setLoadingWar(false);
      setLoadingVictory(false);
    }
  };

  return (
    <div className="app-container">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

      <div className="main-panel">
        <h1 className="main-title">Foxhole War Tracker</h1>

        {/* Inputs */}
        <div className="input-panel">
          <div className="input-group">
            <label>Shard ID:</label>
            <input
              type="number"
              value={shardId}
              onChange={(e) => setShardId(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Hex ID (opcjonalnie):</label>
            <input
              type="number"
              value={hexId}
              onChange={(e) => setHexId(e.target.value)}
            />
          </div>

          <button className="fetch-button" onClick={handleFetch}>
            Pobierz
          </button>
        </div>

        {error && <p className="status-error">{error}</p>}
        {errorWar && <p className="status-error">{errorWar}</p>}
        {errorVictory && <p className="status-error">{errorVictory}</p>}

        {(warReport || victoryData || (report && hexInfo)) && (
          <div className="war-and-hex-container">
            {/* WAR STATE CARD */}
           
            {warReport && <WarState report={warReport} warNumber={warReport.warNumber} />}

            {/* VICTORY TOWN CARD */}
           
            {victoryData && <VictoryTownCard result={victoryData} />}

            {/* MAP REPORT CARD */}
            <div>
              
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
          </div>
        )}
      </div>
    </div>
  );
}
