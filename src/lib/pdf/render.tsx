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

export function respuestaPdf(pdf: Buffer, nombre: string, descargar: boolean): Response {
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${descargar ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(nombre)}`,
      "Cache-Control": "no-store",
    },
  });
}
