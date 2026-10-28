import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { redirect } from "next/navigation";
import { nuevoId } from "./db";

/**
 * Imágenes: en Vercel se guardan en Vercel Blob (BLOB_READ_WRITE_TOKEN);
 * en local, en data/uploads y se sirven desde /api/uploads/<archivo>.
 */
export const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");
const TIPOS: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg" };
const MAX_BYTES = 3 * 1024 * 1024;

export async function guardarImagen(file: File | null, carpeta: string): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;
  const ext = TIPOS[file.type];
  if (!ext) throw new Error("La imagen debe ser PNG o JPG.");
  if (file.size > MAX_BYTES) throw new Error("La imagen pesa más de 3 MB.");

  const nombre = `${carpeta}-${nuevoId()}.${ext}`;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`implegas/${nombre}`, file, { access: "public", contentType: file.type });
    return blob.url;
  }
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOADS_DIR, nombre), Buffer.from(await file.arrayBuffer()));
  return `/api/uploads/${nombre}`;
}

/** Carga una imagen (propia, local o remota) como buffer para incrustarla en el PDF. */
export async function cargarImagen(url: string | undefined): Promise<{ data: Buffer; format: "png" | "jpg" } | null> {
  if (!url) return null;
  try {
    let data: Buffer;
    if (url.startsWith("/api/uploads/")) {
      data = await fs.readFile(path.join(UPLOADS_DIR, path.basename(url)));
    } else if (url.startsWith("/")) {
      const publico = path.join(process.cwd(), "public");
      const archivo = path.join(publico, url);
      if (!archivo.startsWith(publico + path.sep)) return null;
      data = await fs.readFile(archivo);
    } else {
      // Solo imágenes subidas a Vercel Blob.
      if (!new URL(url).hostname.endsWith(".public.blob.vercel-storage.com")) return null;
      const res = await fetch(url);
      if (!res.ok) return null;
      data = Buffer.from(await res.arrayBuffer());
    }
    const esPng = data[0] === 0x89 && data[1] === 0x50;
    const esJpg = data[0] === 0xff && data[1] === 0xd8;
    if (!esPng && !esJpg) return null;
    return { data, format: esPng ? "png" : "jpg" };
  } catch {
    return null;
  }
}

/** Como guardarImagen, pero si falla regresa al formulario con el error en ?error=. */
export async function subirImagen(file: File | null, carpeta: string, volverA: string): Promise<string | undefined> {
  try {
    return await guardarImagen(file, carpeta);
  } catch (e) {
    console.error("Error al subir imagen", e);
    const msg = e instanceof Error && e.message ? e.message : "No se pudo subir la imagen.";
    redirect(`${volverA}?error=${encodeURIComponent(msg)}`);
  }
}
