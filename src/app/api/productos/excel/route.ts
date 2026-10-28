import { getSesion } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { productosAExcel } from "@/lib/excel";
import { hoyISO } from "@/lib/format";

export const runtime = "nodejs";

export async function GET() {
  const sesion = await getSesion();
  if (sesion?.rol !== "admin") return new Response("No autorizado", { status: 403 });
  const xlsx = await productosAExcel((await getDb()).productos);
  return new Response(new Uint8Array(xlsx), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="productos-implegas-${hoyISO()}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
