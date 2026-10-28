import { getDb } from "@/lib/db";
import { nombreArchivo } from "@/lib/format";
import { respuestaPdf } from "@/lib/pdf/render";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const cot = db.cotizaciones.find((c) => c.id === id);
  if (!cot) return new Response("No encontrada", { status: 404 });
  const descargar = new URL(req.url).searchParams.has("descargar");
  return respuestaPdf(cot, db.empresa, nombreArchivo(cot), descargar);
}
