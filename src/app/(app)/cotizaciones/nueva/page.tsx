/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { borradorDesdeBase } from "@/lib/borrador";
import { getDb } from "@/lib/db";
import { Editor } from "../Editor";

export default async function NuevaCotizacion({
  searchParams,
}: {
  searchParams: Promise<{ base?: string; cliente?: string }>;
}) {
  const { base, cliente } = await searchParams;
  const db = await getDb();
  const extra = cliente ? `&cliente=${cliente}` : "";

  if (base === undefined) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Nueva cotización</h1>
        <p className="text-gray-600">Elige una base. Se precargan los productos más comunes y la mano de obra, y luego puedes editar todo.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {db.bases.map((b) => (
            <Link
              key={b.id}
              href={`/cotizaciones/nueva?base=${b.id}${extra}`}
              className="card hover:border-brand hover:shadow flex gap-4 items-center"
            >
              <div className="h-16 w-16 shrink-0 flex items-center justify-center">
                {b.logoUrl ? (
                  <img src={b.logoUrl} alt="" className="max-h-16 object-contain" />
                ) : (
                  <span className="text-3xl">🔧</span>
                )}
              </div>
              <div>
                <div className="font-semibold">{b.nombre}</div>
                <div className="text-xs text-gray-500">
                  {b.items.length} productos · {b.manoObra.length} mano de obra
                </div>
              </div>
            </Link>
          ))}
          <Link href={`/cotizaciones/nueva?base=${extra}`} className="card border-dashed hover:border-brand flex items-center gap-4">
            <span className="text-3xl">📄</span>
            <div className="font-semibold">En blanco</div>
          </Link>
        </div>
      </div>
    );
  }

  const c = db.clientes.find((x) => x.id === cliente);
  return (
    <Editor
      inicial={borradorDesdeBase(db, base || undefined, c)}
      productos={db.productos.filter((p) => p.activo)}
      clientes={db.clientes}
      bases={db.bases}
      ivaPct={db.empresa.ivaPct}
    />
  );
}
