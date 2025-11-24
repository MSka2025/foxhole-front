export default function WarState({ report, warNumber }) {


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
        War Number: {warNumber}
      </h2>
      <p><strong>War Started:</strong> {new Date(report.conquestStartTime).toLocaleString()}</p>
      <p><strong>Required Victory Towns:</strong> {report.requiredVictoryTowns}</p>
      
    </div>
  );
}
