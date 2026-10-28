/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { dinero } from "@/lib/format";

export default async function ProductosPage({ searchParams }: { searchParams: Promise<{ cat?: string; q?: string }> }) {
  await requireAdmin();
  const { cat, q } = await searchParams;
  const db = await getDb();
  const categorias = [...new Set(db.productos.map((p) => p.categoria))].sort();
  const lista = db.productos
    .filter((p) => !cat || p.categoria === cat)
    .filter((p) => !q || p.nombre.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">Catálogo de productos</h1>
        <Link href="/admin/productos/nuevo" className="btn-primary ml-auto">
          + Nuevo producto
        </Link>
      </div>
      <form className="flex flex-wrap gap-2">
        <select name="cat" defaultValue={cat ?? ""} className="input max-w-xs">
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input name="q" defaultValue={q ?? ""} placeholder="Buscar…" className="input max-w-xs" />
        <button className="btn">Filtrar</button>
      </form>
      <div className="card overflow-x-auto p-0">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Unidad</th>
              <th className="text-right">Precio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id} className={p.activo ? "" : "opacity-50"}>
                <td className="w-12">
                  {p.imagenUrl ? <img src={p.imagenUrl} alt="" className="h-10 w-10 object-contain" /> : null}
                </td>
                <td className="font-medium">{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.unidad}</td>
                <td className="text-right">{dinero(p.precio)}</td>
                <td className="text-right">
                  <Link href={`/admin/productos/${p.id}`} className="text-brand hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-6">
                  No hay productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
