"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/users/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setName(data.name);
      })
      .catch((err) => console.error(err));
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Error actualizando perfil");

      const updated = await res.json();
      setUser(updated);

      // ✅ Mostrar mensaje y redirigir
      setSuccess("Perfil actualizado correctamente ✅");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="p-6 text-gray-500 text-center">Cargando perfil...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-blue-900 p-6">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Editar Perfil
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <label className="block">
          <span className="text-gray-700">Nombre</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
          />
        </label>

        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Creado:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-br from-orange-400 to-blue-900 hover:from-blue-900 hover:to-orange-400 text-white font-medium py-2 px-5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
