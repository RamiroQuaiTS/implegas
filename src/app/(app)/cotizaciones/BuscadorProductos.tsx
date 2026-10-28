"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { dinero } from "@/lib/format";
import type { Producto } from "@/lib/types";

const MAX_RESULTADOS = 40;

function normalizar(t: string): string {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Buscador para agregar productos del catálogo: filtro por categoría + búsqueda por palabras. */
export function BuscadorProductos({
  productos,
  enCotizacion,
  onAgregar,
}: {
  productos: Producto[];
  enCotizacion: Map<string, number>;
  onAgregar: (p: Producto) => void;
}) {
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("");
  const categorias = useMemo(() => [...new Set(productos.map((p) => p.categoria))].sort(), [productos]);
  const indice = useMemo(
    () => productos.map((p) => ({ p, t: normalizar(`${p.nombre} ${p.categoria} ${p.especificaciones ?? ""}`) })),
    [productos],
  );

  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  const activo = palabras.length > 0 || categoria !== "";
  const resultados = activo
    ? indice
        .filter((x) => (!categoria || x.p.categoria === categoria) && palabras.every((w) => x.t.includes(w)))
        .map((x) => x.p)
    : [];

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="search"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="🔍 Buscar producto (ej. tanque 300, minisplit inverter, bota dama)…"
          className="input"
        />
        {activo && (
          <button
            type="button"
            onClick={() => {
              setTexto("");
              setCategoria("");
            }}
            className="btn px-3"
          >
            Limpiar
          </button>
        )}
      </div>
      <div className="-mx-3 px-3 flex gap-2 overflow-x-auto pb-1">
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoria(categoria === cat ? "" : cat)}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${
              categoria === cat ? "border-brand bg-brand text-white" : "border-gray-300 bg-white text-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {activo && (
        <div className="max-h-[26rem] overflow-y-auto space-y-1.5">
          {resultados.slice(0, MAX_RESULTADOS).map((p) => {
            const n = enCotizacion.get(p.id) ?? 0;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onAgregar(p)}
                className="w-full flex items-center gap-3 rounded-md bg-white border border-gray-200 p-2 text-left hover:border-brand active:bg-green-50"
              >
                <div className="h-12 w-12 shrink-0 flex items-center justify-center">
                  {p.imagenUrl ? (
                    <img src={p.imagenUrl} alt="" className="max-h-12 max-w-12 object-contain" loading="lazy" />
                  ) : (
                    <span className="text-xl text-gray-300">📦</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-medium leading-tight line-clamp-3">{p.nombre}</div>
                  <div className="text-xs text-gray-500">
                    {p.categoria} · <b className="text-gray-800">{dinero(p.precio)}</b> / {p.unidad}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                    n ? "bg-brand text-white" : "bg-green-50 text-brand"
                  }`}
                >
                  {n ? `✓ ${n}` : "+"}
                </span>
              </button>
            );
          })}
          {resultados.length === 0 && <p className="text-sm text-gray-500 px-1">No hay productos con esa búsqueda.</p>}
          {resultados.length > MAX_RESULTADOS && (
            <p className="text-xs text-gray-500 px-1">
              Mostrando {MAX_RESULTADOS} de {resultados.length}. Escribe más palabras para afinar.
            </p>
          )}
        </div>
      )}
      {!activo && <p className="text-xs text-gray-500">Escribe o toca una categoría para ver productos. Cada toque agrega uno (o suma 1 si ya está).</p>}
    </div>
  );
}
