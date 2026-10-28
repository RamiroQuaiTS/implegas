/* eslint-disable @next/next/no-img-element */
import { AvisoError } from "@/components/AvisoError";
import { InputImagen } from "@/components/InputImagen";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { eliminarProducto, guardarProducto } from "../../actions";

export default async function ProductoForm({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = await getDb();
  const p = id === "nuevo" ? undefined : db.productos.find((x) => x.id === id);
  if (id !== "nuevo" && !p) notFound();
  const categorias = [...new Set(db.productos.map((x) => x.categoria))].sort();

  return (
    <div className="max-w-2xl space-y-4">
      <Link href="/admin/productos" className="text-sm text-gray-500 hover:underline">
        ← Productos
      </Link>
      <h1 className="text-xl font-bold">{p ? "Editar producto" : "Nuevo producto"}</h1>
      <AvisoError />
      <form action={guardarProducto} className="card space-y-4">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <input type="hidden" name="imagenActual" value={p?.imagenUrl ?? ""} />
        <label className="block">
          <span className="label">Descripción (como sale en la cotización)</span>
          <input name="nombre" required defaultValue={p?.nombre} className="input uppercase" />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="label">Categoría</span>
            <input name="categoria" required list="categorias" defaultValue={p?.categoria} className="input" />
            <datalist id="categorias">
              {categorias.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className="block">
            <span className="label">Unidad</span>
            <input name="unidad" defaultValue={p?.unidad ?? "PZA"} className="input uppercase" />
          </label>
          <label className="block">
            <span className="label">Precio unitario (MXN)</span>
            <input name="precio" type="number" step="0.01" min="0" required defaultValue={p?.precio} className="input" />
          </label>
        </div>
        <label className="block">
          <span className="label">Especificaciones (se muestran junto a la imagen en el PDF)</span>
          <textarea
            name="especificaciones"
            rows={3}
            defaultValue={p?.especificaciones}
            placeholder={"LARGO: 290 CM\nANCHO: 19.5 CM"}
            className="input"
          />
        </label>
        <div className="flex items-center gap-4">
          {p?.imagenUrl && <img src={p.imagenUrl} alt="" className="h-20 w-20 object-contain border rounded" />}
          <label className="block flex-1">
            <span className="label">Imagen (JPG o PNG; las fotos se reducen solas)</span>
            <InputImagen name="imagen" />
          </label>
          {p?.imagenUrl && (
            <label className="text-sm flex items-center gap-1">
              <input type="checkbox" name="quitarImagen" /> Quitar
            </label>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="activo" defaultChecked={p?.activo ?? true} /> Activo (aparece al cotizar)
        </label>
        <div className="flex gap-2">
          <button className="btn-primary">Guardar</button>
          <Link href="/admin/productos" className="btn">
            Cancelar
          </Link>
        </div>
      </form>
      {p && (
        <form action={eliminarProducto}>
          <input type="hidden" name="id" value={p.id} />
          <button className="btn-danger">Eliminar producto</button>
        </form>
      )}
    </div>
  );
}
