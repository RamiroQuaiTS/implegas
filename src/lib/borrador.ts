import type { BorradorCotizacion } from "@/app/(app)/cotizaciones/actions";
import { hoyISO, sumarDias } from "./format";
import type { Cliente, Db, Partida } from "./types";

/** Arma una cotización nueva a partir de una base (o en blanco). */
export function borradorDesdeBase(db: Db, baseId?: string, cliente?: Cliente): BorradorCotizacion {
  const base = db.bases.find((b) => b.id === baseId);
  const hoy = hoyISO();
  const productos = (base?.items ?? [])
    .map((it) => ({ it, p: db.productos.find((p) => p.id === it.productoId) }))
    .filter((x) => x.p);
  const partidas: Partida[] = [
    ...productos.map(({ it, p }) => ({
      tipo: "producto" as const,
      productoId: p!.id,
      cantidad: it.cantidad,
      descripcion: p!.nombre,
      precio: p!.precio,
    })),
    ...(base?.manoObra ?? []).map((m) => ({
      tipo: "mano_obra" as const,
      cantidad: 1,
      descripcion: m.descripcion,
      precio: m.precio,
    })),
  ];
  const conImagen = productos.find((x) => x.p!.imagenUrl)?.p;

  return {
    fecha: hoy,
    validoHasta: sumarDias(hoy, db.empresa.vigenciaDias),
    baseId: base?.id,
    titulo: base?.nombre ?? "",
    cliente: {
      clienteId: cliente?.id,
      nombre: cliente?.nombre ?? "",
      atencion: cliente?.atencion ?? db.empresa.atencion,
      email: cliente?.email ?? "",
      cel: cliente?.cel ?? "",
      domicilio: cliente?.domicilio ?? "",
    },
    logoCategoriaUrl: base?.logoUrl,
    area: base?.area ?? "",
    partidas,
    imagenUrl: conImagen?.imagenUrl,
    imagenTexto: conImagen?.especificaciones ?? "",
    incluye: base?.incluye ?? "",
    garantia: base?.garantia ?? "",
    aviso: base?.aviso ?? "",
    nota: db.empresa.nota,
    incluirIva: false,
  };
}
