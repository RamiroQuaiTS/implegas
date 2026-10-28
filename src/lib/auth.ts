import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verificarSesion, type Sesion } from "./session";

export async function getSesion(): Promise<Sesion | null> {
  return verificarSesion((await cookies()).get(COOKIE)?.value);
}

export async function requireSesion(): Promise<Sesion> {
  const s = await getSesion();
  if (!s) redirect("/login");
  return s;
}

export async function requireAdmin(): Promise<Sesion> {
  const s = await requireSesion();
  if (s.rol !== "admin") redirect("/");
  return s;
}
