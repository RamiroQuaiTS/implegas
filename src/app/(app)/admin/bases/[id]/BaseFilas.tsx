"use client";

import { useState } from "react";
import { dinero } from "@/lib/format";
import type { BaseItem, ManoObra, Producto } from "@/lib/types";

export function BaseFilas(props: { productos: Producto[]; items: BaseItem[]; manoObra: ManoObra[] }) {
  const [items, setItems] = useState(props.items);
  const [mano, setMano] = useState(props.manoObra);
  const porId = new Map(props.productos.map((p) => [p.id, p]));
  const categorias = [...new Set(props.productos.map((p) => p.categoria))].sort();

  return (
    <div className="space-y-5">
      <input type="hidden" name="items" value={JSON.stringify(items)} />
      <input type="hidden" name="manoObra" value={JSON.stringify(mano)} />

      <div>
        <span className="label">Productos que se precargan</span>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                step="any"
                value={it.cantidad}
                onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, cantidad: Number(e.target.value) } : x)))}
                className="input w-20"
              />
              <select
                value={it.productoId}
                onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, productoId: e.target.value } : x)))}
                className="input flex-1"
              >
                <option value="">Elige un producto…</option>
                {categorias.map((c) => (
                  <optgroup key={c} label={c}>
                    {props.productos
                      .filter((p) => p.categoria === c)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} ({dinero(p.precio)})
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <span className="w-24 text-right text-sm text-gray-500">
                {porId.get(it.productoId) ? dinero(porId.get(it.productoId)!.precio * it.cantidad) : ""}
              </span>
              <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} className="btn-danger">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setItems([...items, { productoId: "", cantidad: 1 }])} className="btn">
            + Agregar producto
          </button>
        </div>
      </div>

      <div>
        <span className="label">Mano de obra</span>
        <div className="space-y-2">
          {mano.map((m, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={m.descripcion}
                onChange={(e) => setMano(mano.map((x, j) => (j === i ? { ...x, descripcion: e.target.value } : x)))}
                placeholder="INSTALACION…"
                className="input flex-1 uppercase"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={m.precio}
                onChange={(e) => setMano(mano.map((x, j) => (j === i ? { ...x, precio: Number(e.target.value) } : x)))}
                className="input w-32"
              />
              <button type="button" onClick={() => setMano(mano.filter((_, j) => j !== i))} className="btn-danger">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setMano([...mano, { descripcion: "", precio: 0 }])} className="btn">
            + Agregar mano de obra
          </button>
        </div>
      </div>
    </div>
  );
}
