import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSesion } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { dinero, fechaCorta, nombreArchivo, totales } from "@/lib/format";
import { duplicarCotizacion, eliminarCotizacion } from "../actions";
import { Compartir } from "./Compartir";

export default async function VerCotizacion({ params }: { params: Promise<{ id: string }> }) {
  const sesion = await requireSesion();
  const { id } = await params;
  const db = await getDb();
  const c = db.cotizaciones.find((x) => x.id === id);
  if (!c) notFound();
  const { subtotal, total } = totales(c, db.empresa.ivaPct);
  const pdfUrl = `/api/cotizaciones/${c.id}/pdf?v=${encodeURIComponent(c.actualizadoEn)}`;

  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-gray-500 hover:underline">
        ← Cotizaciones
      </Link>
      <div className="flex flex-wrap items-start gap-4">
        <div>
          <h1 className="text-xl font-bold">
            Cotización {String(c.folio).padStart(4, "0")} · {c.cliente.nombre}
          </h1>
          <p className="text-sm text-gray-500">
            {c.titulo} · {fechaCorta(c.fecha)} · {dinero(total ?? subtotal)} {total === null ? "+ IVA" : ""} · por {c.creadoPor}
          </p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Link href={`/cotizaciones/${c.id}/editar`} className="btn">
            Editar
          </Link>
          <form action={duplicarCotizacion}>
            <input type="hidden" name="id" value={c.id} />
            <button className="btn">Duplicar</button>
          </form>
          {sesion.rol === "admin" && (
            <form action={eliminarCotizacion}>
              <input type="hidden" name="id" value={c.id} />
              <button className="btn-danger">Eliminar</button>
            </form>
          )}
        </div>
      </div>

      <Compartir
        pdfUrl={pdfUrl}
        sharePath={`/c/${c.shareToken}`}
        archivo={nombreArchivo(c)}
        cliente={c.cliente}
        folio={c.folio}
        titulo={c.titulo}
      />

      <iframe src={pdfUrl} title="Vista previa" className="w-full h-[80vh] rounded-xl border border-gray-200 bg-white" />
    </div>
  );
}
