// src/hooks/useDarkMode.js
import { useEffect, useState } from "react";

export default function useDarkMode() {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem("dark-mode");
    return saved === "true" || false;
  });

  useEffect(() => {
    const body = document.body;
    if (enabled) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
    localStorage.setItem("dark-mode", enabled);
  }, [enabled]);

  return [enabled, setEnabled];
}
