"use client";

import { useEffect } from "react";

export function MswProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Solo en desarrollo
      import("../mocks/browser").then(({ worker }) => {
        worker.start({
          onUnhandledRequest: "bypass", // evita romper si falta un handler
        });
        console.log("MSW inicializado en el cliente");
      });
    }
  }, []);

  return null; // No renderiza nada en la UI
}
