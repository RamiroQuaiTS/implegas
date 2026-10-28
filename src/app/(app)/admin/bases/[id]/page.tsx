/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { eliminarBase, guardarBase } from "../../actions";
import { BaseFilas } from "./BaseFilas";

export default async function BaseForm({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = await getDb();
  const b = id === "nueva" ? undefined : db.bases.find((x) => x.id === id);
  if (id !== "nueva" && !b) notFound();

  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/admin/bases" className="text-sm text-gray-500 hover:underline">
        ← Bases
      </Link>
      <h1 className="text-xl font-bold">{b ? `Base: ${b.nombre}` : "Nueva base"}</h1>
      <form action={guardarBase} className="card space-y-5">
        <input type="hidden" name="id" value={b?.id ?? ""} />
        <input type="hidden" name="logoActual" value={b?.logoUrl ?? ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">Nombre</span>
            <input name="nombre" required defaultValue={b?.nombre} className="input" placeholder="Instalación de gas" />
          </label>
          <label className="block">
            <span className="label">Título de área (opcional)</span>
            <input name="area" defaultValue={b?.area} className="input uppercase" placeholder="AREA DE MURO" />
          </label>
        </div>
        <div className="flex items-center gap-4">
          {b?.logoUrl && <img src={b.logoUrl} alt="" className="h-16 w-16 object-contain border rounded" />}
          <label className="block flex-1">
            <span className="label">Logo de la categoría (esquina superior derecha del PDF)</span>
            <input name="logo" type="file" accept="image/png,image/jpeg" className="text-sm" />
          </label>
          {b?.logoUrl && (
            <label className="text-sm flex items-center gap-1">
              <input type="checkbox" name="quitarLogo" /> Quitar
            </label>
          )}
        </div>

        <BaseFilas
          productos={db.productos.filter((p) => p.activo)}
          items={b?.items ?? []}
          manoObra={b?.manoObra ?? []}
        />

        <label className="block">
          <span className="label">Incluye</span>
          <textarea name="incluye" rows={3} defaultValue={b?.incluye} className="input" />
        </label>
        <label className="block">
          <span className="label">Garantía (una línea por renglón)</span>
          <textarea name="garantia" rows={2} defaultValue={b?.garantia} className="input" />
        </label>
        <label className="block">
          <span className="label">Aviso en rojo (opcional)</span>
          <input name="aviso" defaultValue={b?.aviso} className="input" />
        </label>
        <div className="flex gap-2">
          <button className="btn-primary">Guardar base</button>
          <Link href="/admin/bases" className="btn">
            Cancelar
          </Link>
        </div>
      </form>
      {b && (
        <form action={eliminarBase}>
          <input type="hidden" name="id" value={b.id} />
          <button className="btn-danger">Eliminar base</button>
        </form>
      )}
    </div>
  );
}
