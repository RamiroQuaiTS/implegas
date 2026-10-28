import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { Editor } from "../../Editor";

export default async function EditarCotizacion({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const c = db.cotizaciones.find((x) => x.id === id);
  if (!c) notFound();
  // Campos internos que el editor no maneja.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { folio, shareToken, creadoPor, creadoEn, actualizadoEn, ...borrador } = c;
  return (
    <Editor
      inicial={borrador}
      productos={db.productos.filter((p) => p.activo)}
      clientes={db.clientes}
      bases={db.bases}
      ivaPct={db.empresa.ivaPct}
    />
  );
}
