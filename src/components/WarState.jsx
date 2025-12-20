
export default function WarState({ report, warNumber }) {
  return (
    <div className="modern-card">
      <h2 className="modern-card-title">War Number: {warNumber}</h2>
      <p><strong>War Started:</strong> {new Date(report.conquestStartTime).toLocaleString()}</p>
      <p><strong>Required Victory Towns:</strong> {report.requiredVictoryTowns}</p>
    </div>
  );
}
