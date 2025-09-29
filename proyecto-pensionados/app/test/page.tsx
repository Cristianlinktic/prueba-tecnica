"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Lanzando fetch a /users/me ...");

    fetch("/users/me")
      .then(async (res) => {
        console.log("Status recibido:", res.status);

        // Leemos crudo por si no es JSON válido
        const text = await res.text();
        console.log("Respuesta cruda:", text);

        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        try {
          return JSON.parse(text); // Intentamos parsear
        } catch (e) {
          throw new Error("No se pudo parsear JSON, devolvió HTML");
        }
      })
      .then((json) => {
        console.log("JSON parseado:", json);
        setData(json);
      })
      .catch((err) => {
        console.error("Error en fetch:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test MSW</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
