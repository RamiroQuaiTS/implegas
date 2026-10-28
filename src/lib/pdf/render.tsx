import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { cargarImagen } from "../storage";
import type { Cotizacion, Empresa } from "../types";
import { CotizacionPdf } from "./CotizacionPdf";

export async function generarPdf(cot: Cotizacion, empresa: Empresa): Promise<Buffer> {
  const [logo, categoria, producto, whatsapp] = await Promise.all([
    cargarImagen(empresa.logoUrl),
    cargarImagen(cot.logoCategoriaUrl),
    cargarImagen(cot.imagenUrl),
    cargarImagen("/brand/whatsapp.png"),
  ]);
  return renderToBuffer(<CotizacionPdf cot={cot} empresa={empresa} imagenes={{ logo, categoria, producto, whatsapp }} />);
}

export async function respuestaPdf(cot: Cotizacion, empresa: Empresa, nombre: string, descargar: boolean): Promise<Response> {
  let pdf: Buffer;
  try {
    pdf = await generarPdf(cot, empresa);
  } catch (e) {
    console.error("Error al generar el PDF", e);
    const detalle = e instanceof Error ? `${e.name}: ${e.message}\n${e.stack ?? ""}` : String(e);
    return new Response(`No se pudo generar el PDF.\n\n${detalle}`, {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${descargar ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(nombre)}`,
      "Cache-Control": "no-store",
    },
  });
}
