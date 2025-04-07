// src/components/Navbar.jsx
import React from "react";
import useDarkMode from "../hooks/useDarkMode";

export default function Navbar() {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <nav style={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
      <h2>🔥 Chat App</h2>
      <label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        <span style={{ marginLeft: "8px" }}>{darkMode ? "🌙 Dark" : "☀️ Light"}</span>
      </label>
    </nav>
  );
}
