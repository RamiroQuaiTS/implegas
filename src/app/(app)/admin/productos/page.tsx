/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { dinero } from "@/lib/format";
import { importarProductos } from "../actions";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string; msg?: string; vista?: string }>;
}) {
  await requireAdmin();
  const { cat, q, msg, vista } = await searchParams;
  // Sin vista elegida: tarjetas en celular y tabla en pantallas grandes.
  const verTarjetas = vista === "tarjetas" ? "" : vista === "tabla" ? "hidden" : "md:hidden";
  const verTabla = vista === "tabla" ? "" : vista === "tarjetas" ? "hidden" : "hidden md:block";
  const enlaceVista = (v: string) => `?${new URLSearchParams({ ...(cat ? { cat } : {}), ...(q ? { q } : {}), vista: v })}`;
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
      <details className="card py-3" open={!!msg}>
        <summary className="cursor-pointer text-sm font-semibold text-gray-700">⬆ Subir Excel con cambios</summary>
      <form action={importarProductos} className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-56">
          <input name="excel" type="file" required accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
        </div>
        <button className="btn-primary">Subir y actualizar</button>
        <p className="basis-full text-xs text-gray-500">
          Descarga el Excel, edita precios o datos (o agrega renglones sin ID para productos nuevos) y súbelo aquí. Los productos que
          no vengan en el archivo no se tocan.
        </p>
      </form>
      </details>
      {msg && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${tipoMsg === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {textoMsg}
        </p>
      )}
      <form className="flex flex-wrap gap-2">
        {vista && <input type="hidden" name="vista" value={vista} />}
        <select name="cat" defaultValue={cat ?? ""} className="input max-w-xs">
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input name="q" defaultValue={q ?? ""} placeholder="Buscar…" className="input max-w-xs" />
        <button className="btn">Filtrar</button>
        <div className="ml-auto flex rounded-md border border-gray-300 overflow-hidden text-sm">
          <Link href={enlaceVista("tarjetas")} className={`px-3 py-2 ${vista === "tarjetas" ? "bg-brand text-white" : "bg-white"}`}>
            ▦ Tarjetas
          </Link>
          <Link href={enlaceVista("tabla")} className={`px-3 py-2 ${vista === "tabla" ? "bg-brand text-white" : "bg-white"}`}>
            ☰ Tabla
          </Link>
        </div>
      </form>
      <p className="text-xs text-gray-500">{lista.length} productos</p>

      <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${verTarjetas}`}>
        {lista.map((p) => (
          <Link
            key={p.id}
            href={`/admin/productos/${p.id}`}
            className={`card p-3 hover:border-brand flex gap-3 items-center ${p.activo ? "" : "opacity-50"}`}
          >
            <div className="h-16 w-16 shrink-0 flex items-center justify-center rounded bg-gray-50">
              {p.imagenUrl ? (
                <img src={p.imagenUrl} alt="" className="max-h-16 max-w-16 object-contain" />
              ) : (
                <span className="text-2xl text-gray-300">📦</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight line-clamp-2">{p.nombre}</div>
              <div className="text-xs text-gray-500 mt-1">
                {p.categoria} · {p.unidad}
              </div>
              <div className="text-sm font-bold text-brand mt-0.5">{dinero(p.precio)}</div>
            </div>
          </Link>
        ))}
        {lista.length === 0 && <p className="text-gray-500">No hay productos.</p>}
      </div>

      <div className={`card overflow-x-auto p-0 ${verTabla}`}>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Unidad</th>
              <th className="text-right">Precio</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id} className={`relative hover:bg-gray-50 cursor-pointer ${p.activo ? "" : "opacity-50"}`}>
                <td className="w-12">
                  {p.imagenUrl ? <img src={p.imagenUrl} alt="" className="h-10 w-10 object-contain" /> : null}
                </td>
                <td className="font-medium">
                  {/* El enlace cubre toda la fila. */}
                  <Link href={`/admin/productos/${p.id}`} className="after:absolute after:inset-0">
                    {p.nombre}
                  </Link>
                </td>
                <td>{p.categoria}</td>
                <td>{p.unidad}</td>
                <td className="text-right">{dinero(p.precio)}</td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-6">
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
