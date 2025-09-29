import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value || null;

  // ✅ Si no hay token y el usuario intenta entrar a rutas privadas
  if (!accessToken && (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/me"))) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Si hay token o es una ruta pública → continuar
  return NextResponse.next();
}

// ⚡ Configuración de en qué rutas se aplica el middleware
export const config = {
  matcher: ["/dashboard/:path*", "/me/:path*"],
};
