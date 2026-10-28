/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function BasesPage() {
  await requireAdmin();
  const db = await getDb();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-xl font-bold">Bases de cotización</h1>
          <p className="text-sm text-gray-500">
            Cada base define los productos, la mano de obra y los textos que se precargan al cotizar.
          </p>
        </div>
        <Link href="/admin/bases/nueva" className="btn-primary ml-auto">
          + Nueva base
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {db.bases.map((b) => (
          <Link key={b.id} href={`/admin/bases/${b.id}`} className="card hover:border-brand flex gap-4 items-center">
            <div className="h-14 w-14 shrink-0 flex items-center justify-center">
              {b.logoUrl ? <img src={b.logoUrl} alt="" className="max-h-14 object-contain" /> : null}
            </div>
            <div>
              <div className="font-semibold">{b.nombre}</div>
              <div className="text-xs text-gray-500">
                {b.items.length} productos · {b.manoObra.length} conceptos de mano de obra
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
