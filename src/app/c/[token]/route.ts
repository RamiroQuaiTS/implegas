import { getDb } from "@/lib/db";
import { nombreArchivo } from "@/lib/format";
import { respuestaPdf } from "@/lib/pdf/render";

export const runtime = "nodejs";

// Enlace público que se manda al cliente por WhatsApp o correo: /c/<token>
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = await getDb();
  const cot = token.length >= 16 ? db.cotizaciones.find((c) => c.shareToken === token) : undefined;
  if (!cot) return new Response("Cotización no encontrada", { status: 404 });
  return respuestaPdf(cot, db.empresa, nombreArchivo(cot), false);
}
