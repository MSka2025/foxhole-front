import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MapReportRangeChart({ data }) {
  if (!data || data.length === 0) return null;

  // 👇 KLUCZOWA ZMIANA – wymuszamy pełną kopię tablicy i obiektów
  const chartData = data.map(item => ({ ...item }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="REV" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalEnlistments"
            stroke="#15ff00ff"
            name="Total Enlistments"
          />
          <Line
            type="monotone"
            dataKey="colonialCasualties"
            stroke="#0059ffff"
            name="Colonial Casualties"
          />
          <Line
            type="monotone"
            dataKey="wardenCasualties"
            stroke="#ff2600ff"
            name="Warden Casualties"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
