export default function MapReportCard({ report, hexName }) {

const displayName = hexName.slice(0, -3);

  return (
    <div style={{
      background: "#1e1e1e",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      width: "350px",
      boxShadow: "0 0 15px rgba(0,0,0,0.3)",
      marginTop: "20px"
    }}>
      <h2 style={{ marginBottom: "15px" }}>
        Map Report: {displayName}
      </h2>
      <p><strong>Total Enlistments:</strong> {report.totalEnlistments}</p>
      <p><strong>Colonial Casualties:</strong> {report.colonialCasualties}</p>
      <p><strong>Warden Casualties:</strong> {report.wardenCasualties}</p>
      <p><strong>Day of War:</strong> {report.dayOfWar}</p>
    </div>
  );
}
