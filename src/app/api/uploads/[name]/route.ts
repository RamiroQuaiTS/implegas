import { promises as fs } from "fs";
import path from "path";
import { UPLOADS_DIR } from "@/lib/storage";

export const runtime = "nodejs";

// Solo para desarrollo local; en Vercel las imágenes se sirven desde Vercel Blob.
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const nombre = path.basename((await params).name);
  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, nombre));
    const tipo = nombre.endsWith(".png") ? "image/png" : "image/jpeg";
    return new Response(new Uint8Array(data), { headers: { "Content-Type": tipo } });
  } catch {
    return new Response("No encontrada", { status: 404 });
  }
}
