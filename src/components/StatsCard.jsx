export default function StatsCard({ stats }) {
  return (
    <div style={{
      background: "#1e1e1e",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      width: "320px",
      boxShadow: "0 0 15px rgba(0,0,0,0.3)"
    }}>
      <h2 style={{ marginBottom: "15px" }}>Foxhole Stats</h2>

      <p><strong>Total Players:</strong> {stats.totalPlayers}</p>
      <p><strong>Active Servers:</strong> {stats.activeServers}</p>
      <p><strong>War Number:</strong> {stats.warNumber}</p>
    </div>
  );
}
