import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-orange-400 to-blue-900 text-white">
      <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-lg text-center">
        Bienvenido a la Plataforma Pensionados
      </h1>
      <p className="text-lg sm:text-xl opacity-90 text-center max-w-md">
        Por favor, inicia sesión para continuar y acceder a tu dashboard.
      </p>
      <Link
        href="/login"
        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 hover:scale-105 transform transition"
      >
        Iniciar Sesión
      </Link>
    </div>
  );
}
