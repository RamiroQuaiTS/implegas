/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSesion } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { fechaCorta } from "@/lib/format";
import { eliminarCliente, guardarCliente } from "../actions";

export default async function ClienteForm({ params }: { params: Promise<{ id: string }> }) {
  const sesion = await requireSesion();
  const { id } = await params;
  const db = await getDb();
  const c = id === "nuevo" ? undefined : db.clientes.find((x) => x.id === id);
  if (id !== "nuevo" && !c) notFound();
  const cotizaciones = c ? db.cotizaciones.filter((q) => q.cliente.clienteId === c.id) : [];

  const campo = (name: string, label: string, valor?: string, extra = "") => (
    <label className="block">
      <span className="label">{label}</span>
      <input name={name} defaultValue={valor} className={`input ${extra}`} />
    </label>
  );

  return (
    <div className="max-w-2xl space-y-4">
      <Link href="/clientes" className="text-sm text-gray-500 hover:underline">
        ← Clientes
      </Link>
      <h1 className="text-xl font-bold">{c ? c.nombre : "Nuevo cliente"}</h1>
      <form action={guardarCliente} className="card space-y-4">
        <input type="hidden" name="id" value={c?.id ?? ""} />
        <input type="hidden" name="imagenActual" value={c?.imagenUrl ?? ""} />
        <label className="block">
          <span className="label">Nombre</span>
          <input name="nombre" required defaultValue={c?.nombre} className="input uppercase" placeholder="ARQ. DIEGO ACOSTA" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {campo("cel", "Celular / WhatsApp", c?.cel)}
          {campo("email", "Correo", c?.email)}
        </div>
        {campo("domicilio", "Domicilio", c?.domicilio, "uppercase")}
        <div className="grid gap-4 sm:grid-cols-2">
          {campo("atencion", "Atención (si es distinto al de la empresa)", c?.atencion, "uppercase")}
          {campo("rfc", "RFC", c?.rfc, "uppercase")}
        </div>
        <label className="block">
          <span className="label">Notas internas</span>
          <textarea name="notas" rows={2} defaultValue={c?.notas} className="input" />
        </label>
        <div className="flex items-center gap-4">
          {c?.imagenUrl && <img src={c.imagenUrl} alt="" className="h-20 w-20 object-cover border rounded" />}
          <label className="block flex-1">
            <span className="label">Imagen (foto, logo o fachada; PNG o JPG)</span>
            <input name="imagen" type="file" accept="image/png,image/jpeg" className="text-sm" />
          </label>
          {c?.imagenUrl && (
            <label className="text-sm flex items-center gap-1">
              <input type="checkbox" name="quitarImagen" /> Quitar
            </label>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn-primary">Guardar</button>
          {c && (
            <Link href={`/cotizaciones/nueva?cliente=${c.id}`} className="btn">
              Cotizar a este cliente
            </Link>
          )}
        </div>
      </form>

      {cotizaciones.length > 0 && (
        <div className="card">
          <h2 className="font-semibold mb-2">Cotizaciones</h2>
          <ul className="text-sm space-y-1">
            {cotizaciones.map((q) => (
              <li key={q.id}>
                <Link href={`/cotizaciones/${q.id}`} className="text-brand hover:underline">
                  #{String(q.folio).padStart(4, "0")} · {fechaCorta(q.fecha)} · {q.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {c && sesion.rol === "admin" && (
        <form action={eliminarCliente}>
          <input type="hidden" name="id" value={c.id} />
          <button className="btn-danger">Eliminar cliente</button>
        </form>
      )}
    </div>
  );
}
