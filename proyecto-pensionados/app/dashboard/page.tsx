"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/users/me")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error cargando usuario:", err));
  }, [router]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-orange-400 to-blue-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Card de usuario */}
      {user ? (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Información del Usuario
          </h2>

          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Nombre:</span> {user.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Creado:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <Link href="/me">
              <button className="bg-gradient-to-br from-orange-400 to-blue-900 hover:from-blue-900 hover:to-orange-400 text-white font-medium py-2 px-5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                Editar Perfil
              </button>

            </Link>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">Cargando usuario...</p>
      )}
    </div>
  );
}
