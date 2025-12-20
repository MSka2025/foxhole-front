import Aurora from "./components/Aurora";
import AboutPage from "./components/AboutPage";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import "./App.css";

export default function App() {
  return (
    <>
      <Aurora colorStops={["#3A29FF", "#FF94B4", "#FF3232"]} blend={0.5} amplitude={1.0} speed={0.5} />
      <div className="app-container">
        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <Routes>
            <Route path="/" element={<AboutPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
