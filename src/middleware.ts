import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verificarSesion } from "@/lib/session";

// Todo requiere sesión, excepto la página web pública ("/"), el login, el PDF compartido (/c/<token>),
// las fotos de productos (las usa el catálogo de la web) y los archivos estáticos.
export async function middleware(req: NextRequest) {
  const sesion = await verificarSesion(req.cookies.get(COOKIE)?.value);
  if (sesion) return NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!login|c/|_next/|brand/|seed/|favicon.ico|icon.svg|apple-icon.png|web/|api/imagenes/implegas/producto-).+)"],
};
