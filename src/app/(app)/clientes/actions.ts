"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSesion } from "@/lib/auth";
import { nuevoId, updateDb } from "@/lib/db";
import { archivo, texto } from "@/lib/form";
import { guardarImagen } from "@/lib/storage";
import type { Cliente } from "@/lib/types";

export async function guardarCliente(form: FormData) {
  await requireSesion();
  const id = texto(form, "id") || nuevoId();
  const imagenUrl = (await guardarImagen(archivo(form, "imagen"), "cliente")) ?? (texto(form, "imagenActual") || undefined);
  const cliente: Cliente = {
    id,
    nombre: texto(form, "nombre").toUpperCase(),
    atencion: texto(form, "atencion").toUpperCase() || undefined,
    email: texto(form, "email").toUpperCase() || undefined,
    cel: texto(form, "cel") || undefined,
    domicilio: texto(form, "domicilio").toUpperCase() || undefined,
    rfc: texto(form, "rfc").toUpperCase() || undefined,
    notas: texto(form, "notas") || undefined,
    imagenUrl: form.get("quitarImagen") ? undefined : imagenUrl,
  };
  await updateDb((db) => {
    const i = db.clientes.findIndex((c) => c.id === id);
    if (i >= 0) db.clientes[i] = cliente;
    else db.clientes.push(cliente);
  });
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function eliminarCliente(form: FormData) {
  const sesion = await requireSesion();
  if (sesion.rol !== "admin") redirect("/clientes");
  const id = texto(form, "id");
  await updateDb((db) => {
    db.clientes = db.clientes.filter((c) => c.id !== id);
  });
  revalidatePath("/clientes");
  redirect("/clientes");
}
