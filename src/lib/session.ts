import { SignJWT, jwtVerify } from "jose";
import type { Rol } from "./types";

// Sin dependencias de Node: lo usa también el middleware (edge).
export const COOKIE = "implegas_session";
const DURACION_SEG = 60 * 60 * 24 * 30;

export interface Sesion {
  uid: string;
  rol: Rol;
  nombre: string;
}

function secreto(): Uint8Array {
  const s = process.env.AUTH_SECRET ?? (process.env.VERCEL ? "" : "dev-secret-solo-local");
  if (!s) throw new Error("Define AUTH_SECRET en las variables de entorno.");
  return new TextEncoder().encode(s);
}

export async function firmarSesion(s: Sesion): Promise<string> {
  return new SignJWT({ ...s })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACION_SEG}s`)
    .sign(secreto());
}

export async function verificarSesion(token: string | undefined): Promise<Sesion | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secreto());
    return { uid: String(payload.uid), rol: payload.rol as Rol, nombre: String(payload.nombre) };
  } catch {
    return null;
  }
}

export const cookieOpciones = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: !!process.env.VERCEL,
  path: "/",
  maxAge: DURACION_SEG,
};
