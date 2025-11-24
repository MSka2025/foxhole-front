export default function VictoryTownCard({ result }) {
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
        Victory Towns in Control:
      </h2>

      <p><strong>Wardens:</strong> {result.wardens}</p>
      <p><strong>Colonials:</strong> {result.colonials}</p>
    </div>
  );
}
