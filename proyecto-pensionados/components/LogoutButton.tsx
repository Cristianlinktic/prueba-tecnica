"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Borrar token de localStorage
    localStorage.removeItem("accessToken");

    // Borrar cookie (se hace poniéndola expirada)
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";

    console.log("Sesión cerrada");

    // Redirigir al login
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Cerrar Sesión
    </button>
  );
}
