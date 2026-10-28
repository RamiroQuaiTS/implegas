"use client";

import { useState } from "react";

const LADO_MAX = 1600;

/**
 * Selector de imagen que reduce las fotos en el navegador antes de subirlas
 * (las del celular suelen pesar varios MB o venir en formatos que el PDF no acepta).
 */
export function InputImagen({ name }: { name: string }) {
  const [estado, setEstado] = useState<string | null>(null);

  async function alCambiar(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const original = input.files?.[0];
    setEstado(null);
    if (!original) return;
    // Un PNG ligero se deja igual para conservar la transparencia de los logos.
    if (original.type === "image/png" && original.size < 1_500_000) return;
    try {
      setEstado("Preparando imagen…");
      const bitmap = await createImageBitmap(original);
      const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * escala);
      canvas.height = Math.round(bitmap.height * escala);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
      if (!blob) throw new Error();
      const dt = new DataTransfer();
      dt.items.add(new File([blob], original.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }));
      input.files = dt.files;
      setEstado(`Lista (${Math.round(blob.size / 1024)} KB)`);
    } catch {
      input.value = "";
      setEstado("No se pudo leer esa imagen. Usa una foto JPG o PNG (en iPhone: compartir como JPG o tomar captura).");
    }
  }

  return (
    <div className="space-y-1">
      <input name={name} type="file" accept="image/*" onChange={alCambiar} />
      {estado && <p className="text-xs text-gray-500">{estado}</p>}
    </div>
  );
}
