import type { Cotizacion, Partida } from "./types";

const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

export function dinero(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** "2026-10-27" -> "27/OCT/2026" */
export function fechaCorta(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${MESES[Number(m) - 1]}/${y}`;
}

export function hoyISO(): string {
  // Fecha local de México para que no cambie de día por la zona UTC del servidor.
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" });
}

export function sumarDias(iso: string, dias: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function importePartida(p: Partida): number {
  return (p.cantidad ?? 1) * p.precio;
}

export function totales(c: Pick<Cotizacion, "partidas" | "incluirIva">, ivaPct: number) {
  const subtotal = c.partidas.reduce((s, p) => s + importePartida(p), 0);
  const iva = c.incluirIva ? Math.round(subtotal * ivaPct) / 100 : null;
  return { subtotal, iva, total: iva === null ? null : subtotal + iva };
}

export function nombreArchivo(c: Pick<Cotizacion, "folio" | "cliente" | "titulo">): string {
  const base = `${c.cliente.nombre} ${c.titulo}`.trim() || `cotizacion ${c.folio}`;
  return `COT-${String(c.folio).padStart(4, "0")} ${base}`.replace(/[\\/:*?"<>|]+/g, "").slice(0, 120) + ".pdf";
}
