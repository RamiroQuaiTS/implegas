import Link from "next/link";
import { getDb } from "@/lib/db";
import { dinero, fechaCorta, totales } from "@/lib/format";

export default async function Inicio({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const db = await getDb();
  const lista = db.cotizaciones
    .filter((c) => !q || `${c.folio} ${c.cliente.nombre} ${c.titulo}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.folio - a.folio);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">Cotizaciones</h1>
        <Link href="/cotizaciones/nueva" className="btn-primary ml-auto">
          + Nueva cotización
        </Link>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={q ?? ""} placeholder="Buscar por folio, cliente o concepto…" className="input max-w-md" />
        <button className="btn">Buscar</button>
      </form>
      {/* Celular: tarjetas. */}
      <div className="space-y-2 md:hidden">
        {lista.map((c) => (
          <Link key={c.id} href={`/cotizaciones/${c.id}`} className="card p-3 block hover:border-brand">
            <div className="flex justify-between text-xs text-gray-500">
              <span className="font-mono">#{String(c.folio).padStart(4, "0")}</span>
              <span>{fechaCorta(c.fecha)}</span>
            </div>
            <div className="font-semibold mt-1">{c.cliente.nombre}</div>
            <div className="flex justify-between text-sm mt-0.5">
              <span className="text-gray-600 truncate">{c.titulo}</span>
              <span className="font-bold whitespace-nowrap ml-2">{dinero(totales(c, db.empresa.ivaPct).subtotal)}</span>
            </div>
          </Link>
        ))}
        {lista.length === 0 && <p className="text-gray-500">Aún no hay cotizaciones. Crea la primera con “Nueva cotización”.</p>}
      </div>

      {/* Escritorio: tabla; toda la fila abre la cotización. */}
      <div className="card overflow-x-auto p-0 hidden md:block">
        <table className="table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Concepto</th>
              <th className="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((c) => (
              <tr key={c.id} className="relative hover:bg-gray-50 cursor-pointer">
                <td className="font-mono">
                  <Link href={`/cotizaciones/${c.id}`} className="after:absolute after:inset-0">
                    {String(c.folio).padStart(4, "0")}
                  </Link>
                </td>
                <td className="whitespace-nowrap">{fechaCorta(c.fecha)}</td>
                <td className="font-medium">{c.cliente.nombre}</td>
                <td className="text-gray-600">{c.titulo}</td>
                <td className="text-right">{dinero(totales(c, db.empresa.ivaPct).subtotal)}</td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">
                  Aún no hay cotizaciones. Crea la primera con “Nueva cotización”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
