"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSesion } from "@/lib/auth";
import { nuevoId, updateDb } from "@/lib/db";
import { hoyISO, sumarDias } from "@/lib/format";
import type { Cotizacion } from "@/lib/types";

export type BorradorCotizacion = Omit<
  Cotizacion,
  "id" | "folio" | "shareToken" | "creadoPor" | "creadoEn" | "actualizadoEn"
> & { id?: string; guardarCliente?: boolean };

function token(): string {
  return nuevoId() + nuevoId();
}

export async function guardarCotizacion(b: BorradorCotizacion): Promise<{ error: string } | void> {
  const sesion = await requireSesion();
  if (!b.cliente.nombre.trim()) return { error: "Falta el nombre del cliente." };
  if (b.partidas.length === 0) return { error: "Agrega al menos un concepto." };

  const ahora = new Date().toISOString();
  const partidas = b.partidas
    .filter((p) => p.descripcion.trim())
    .map((p) => ({
      ...p,
      descripcion: p.descripcion.trim(),
      cantidad: p.cantidad === null || Number.isNaN(Number(p.cantidad)) ? null : Number(p.cantidad),
      precio: Number(p.precio) || 0,
    }));

  const id = await updateDb((db) => {
    const cliente = { ...b.cliente };
    if (b.guardarCliente && !cliente.clienteId) {
      cliente.clienteId = nuevoId();
      db.clientes.push({
        id: cliente.clienteId,
        nombre: cliente.nombre.toUpperCase(),
        email: cliente.email || undefined,
        cel: cliente.cel || undefined,
        domicilio: cliente.domicilio || undefined,
      });
    }
    const datos = {
      fecha: b.fecha || hoyISO(),
      validoHasta: b.validoHasta || sumarDias(hoyISO(), db.empresa.vigenciaDias),
      baseId: b.baseId,
      titulo: b.titulo.trim(),
      cliente,
      logoCategoriaUrl: b.logoCategoriaUrl || undefined,
      area: b.area.trim().toUpperCase(),
      partidas,
      imagenUrl: b.imagenUrl || undefined,
      imagenTexto: b.imagenTexto,
      incluye: b.incluye,
      garantia: b.garantia,
      aviso: b.aviso,
      nota: b.nota,
      incluirIva: b.incluirIva,
      actualizadoEn: ahora,
    };
    const existente = b.id ? db.cotizaciones.find((c) => c.id === b.id) : undefined;
    if (existente) {
      Object.assign(existente, datos);
      return existente.id;
    }
    const nueva: Cotizacion = {
      ...datos,
      id: nuevoId(),
      folio: db.siguienteFolio++,
      shareToken: token(),
      creadoPor: sesion.nombre,
      creadoEn: ahora,
    };
    db.cotizaciones.push(nueva);
    return nueva.id;
  });

  revalidatePath("/");
  redirect(`/cotizaciones/${id}`);
}

export async function duplicarCotizacion(form: FormData) {
  const sesion = await requireSesion();
  const origen = String(form.get("id"));
  const id = await updateDb((db) => {
    const c = db.cotizaciones.find((x) => x.id === origen);
    if (!c) return null;
    const hoy = hoyISO();
    const copia: Cotizacion = {
      ...structuredClone(c),
      id: nuevoId(),
      folio: db.siguienteFolio++,
      fecha: hoy,
      validoHasta: sumarDias(hoy, db.empresa.vigenciaDias),
      shareToken: token(),
      creadoPor: sesion.nombre,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    };
    db.cotizaciones.push(copia);
    return copia.id;
  });
  revalidatePath("/");
  redirect(id ? `/cotizaciones/${id}/editar` : "/");
}

export async function eliminarCotizacion(form: FormData) {
  const sesion = await requireSesion();
  if (sesion.rol !== "admin") redirect("/");
  const id = String(form.get("id"));
  await updateDb((db) => {
    db.cotizaciones = db.cotizaciones.filter((c) => c.id !== id);
  });
  revalidatePath("/");
  redirect("/");
}
