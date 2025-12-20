export default function VictoryTownCard({ result }) {
  return (
    <div className="modern-card">
      <h2 className="modern-card-title">Victory Towns in Control:</h2>
      <p><strong>Wardens:</strong> {result.wardens}</p>
      <p><strong>Colonials:</strong> {result.colonials}</p>
    </div>
  );
}
