

export default function MapReportCard({ report, hexName }) {
  const displayName = hexName.slice(0, -3);
  return (
    <div className="modern-card">
      <h2 className="modern-card-title">Map Report: {displayName}</h2>
      <p><strong>Total Enlistments:</strong> {report.totalEnlistments}</p>
      <p><strong>Colonial Casualties:</strong> {report.colonialCasualties}</p>
      <p><strong>Warden Casualties:</strong> {report.wardenCasualties}</p>
      <p><strong>Day of War:</strong> {report.dayOfWar}</p>
    </div>
  );
}
