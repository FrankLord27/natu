import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware para proteger rutas basadas en el tipo de usuario.
 * Intercepta peticiones para validar autenticación y roles.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener el token JWT de la sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ===== RUTAS DE ADMIN =====
  if (pathname.startsWith("/admin")) {
    // Permitir acceso a la página de login del admin
    if (pathname === "/admin/login") {
      // Si ya está autenticado como admin, redirigir al dashboard
      if (token?.userType === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Para cualquier otra ruta de admin, verificar autenticación
    if (!token || token.userType !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // ===== RUTAS DE CUENTA DEL CLIENTE =====
  if (pathname.startsWith("/mi-cuenta")) {
    if (!token || token.userType !== "customer") {
      // Redirigir al login de clientes si no está autenticado
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ===== RUTAS DE LOGIN/REGISTRO =====
  // Si ya está autenticado, redirigir a su dashboard correspondiente
  if (pathname === "/login" || pathname === "/registrarse") {
    if (token) {
      const destination = token.userType === "admin" ? "/admin" : "/mi-cuenta";
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.next();
}

/**
 * Config: especificar qué rutas deben pasar por este middleware
 */
export const config = {
  matcher: ["/admin/:path*", "/mi-cuenta/:path*", "/login", "/registrarse"],
};
