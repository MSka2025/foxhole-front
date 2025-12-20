export default function StatsCard({ stats }) {
  return (
    <div className="modern-card">
      <h2 className="modern-card-title">Foxhole Stats</h2>
      <p><strong>Total Players:</strong> {stats.totalPlayers}</p>
      <p><strong>Active Servers:</strong> {stats.activeServers}</p>
      <p><strong>War Number:</strong> {stats.warNumber}</p>
    </div>
  );
}
