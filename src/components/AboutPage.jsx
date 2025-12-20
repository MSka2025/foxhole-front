import React from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="main-panel">
      <h1 className="main-title">Foxhole War Tracker</h1>
      <p>
        Foxhole War Tracker - czytelne podsumowanie najważniejszych statystyk z gry Foxhole z podziałem na Shardy i Hexy.
      </p>
      <p>
        <strong>Funkcje:</strong>
        <ul style={{marginTop: 8, marginBottom: 8, paddingLeft: 24}}>
          <li>Śledzenie stanu wojny i kontrolowanych miast na żywo</li>
          <li>Szczegółowe raporty mapy i heksów</li>
          <li>Interaktywne wykresy i czysty interfejs użytkownika</li>
          <li>Responsywny, przyjazny dla urządzeń mobilnych design</li>
        </ul>
      </p>
      <div style={{ marginTop: 24 }}>
        <Link to="/dashboard" className="fetch-button">Przejdź do panelu</Link>
      </div>
      <p style={{marginTop: 24, color: '#aaa'}}>
        Systemy akwizycji i przetwarzania danych
      </p>
    </div>
  );
}
