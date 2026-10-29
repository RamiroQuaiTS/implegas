"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { COOKIE, cookieOpciones, firmarSesion } from "@/lib/session";

export async function iniciarSesion(_prev: string | null, form: FormData): Promise<string | null> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const db = await getDb();
  const u = db.usuarios.find((x) => x.email === email);
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) {
    return "Correo o contraseña incorrectos.";
  }
  (await cookies()).set(COOKIE, await firmarSesion({ uid: u.id, rol: u.rol, nombre: u.nombre }), cookieOpciones);
  redirect("/cotizador");
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE);
  redirect("/login");
}
