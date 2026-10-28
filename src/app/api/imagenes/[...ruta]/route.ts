import { leerImagenPrivada } from "@/lib/storage";

export const runtime = "nodejs";

// Sirve las imágenes guardadas en un Blob store privado (requiere sesión, ver middleware).
export async function GET(_req: Request, { params }: { params: Promise<{ ruta: string[] }> }) {
  const img = await leerImagenPrivada((await params).ruta.join("/"));
  if (!img) return new Response("No encontrada", { status: 404 });
  return new Response(new Uint8Array(img.data), {
    headers: { "Content-Type": img.tipo, "Cache-Control": "private, max-age=31536000, immutable" },
  });
}
