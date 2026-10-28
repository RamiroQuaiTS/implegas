/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getDb } from "@/lib/db";

export default async function ClientesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const db = await getDb();
  const lista = db.clientes
    .filter((c) => !q || `${c.nombre} ${c.cel ?? ""} ${c.email ?? ""}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">Clientes</h1>
        <Link href="/clientes/nuevo" className="btn-primary ml-auto">
          + Nuevo cliente
        </Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q ?? ""} placeholder="Buscar por nombre, celular o correo…" className="input max-w-md" />
        <button className="btn">Buscar</button>
      </form>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((c) => (
          <Link key={c.id} href={`/clientes/${c.id}`} className="card hover:border-brand flex gap-3 items-center">
            <div className="h-12 w-12 shrink-0 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-400 font-bold">
              {c.imagenUrl ? <img src={c.imagenUrl} alt="" className="h-full w-full object-cover" /> : c.nombre.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">{c.nombre}</div>
              <div className="text-xs text-gray-500 truncate">{[c.cel, c.domicilio].filter(Boolean).join(" · ")}</div>
            </div>
          </Link>
        ))}
        {lista.length === 0 && <p className="text-gray-500">Aún no hay clientes.</p>}
      </div>
    </div>
  );
}
