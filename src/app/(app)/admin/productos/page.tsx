/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { dinero } from "@/lib/format";
import { importarProductos } from "../actions";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; msg?: string }>;
}) {
  await requireAdmin();
  const { cat, q, msg } = await searchParams;
  const [tipoMsg, textoMsg] = msg ? [msg.split(":")[0], msg.slice(msg.indexOf(":") + 1)] : [];
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
        <div className="ml-auto flex flex-wrap gap-2">
          <a href="/api/productos/excel" className="btn">
            ⬇ Descargar Excel
          </a>
          <Link href="/admin/productos/nuevo" className="btn-primary">
            + Nuevo producto
          </Link>
        </div>
      </div>
      <form action={importarProductos} className="card flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-64">
          <span className="label">Subir Excel con cambios</span>
          <input name="excel" type="file" required accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
        </div>
        <button className="btn-primary">Subir y actualizar</button>
        <p className="basis-full text-xs text-gray-500">
          Descarga el Excel, edita precios o datos (o agrega renglones sin ID para productos nuevos) y súbelo aquí. Los productos que
          no vengan en el archivo no se tocan.
        </p>
      </form>
      {msg && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${tipoMsg === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {textoMsg}
        </p>
      )}
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
