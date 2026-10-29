"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { enlaceWhatsApp } from "./datos";

export interface ProductoWeb {
  id: string;
  nombre: string;
  categoria: string;
  imagenUrl?: string;
}

const POR_PAGINA = 24;

function normalizar(t: string): string {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Catálogo público: sin precios, cada producto lleva a solicitar cotización por WhatsApp. */
export function CatalogoWeb({ productos }: { productos: ProductoWeb[] }) {
  const [categoria, setCategoria] = useState("");
  const [texto, setTexto] = useState("");
  const [visibles, setVisibles] = useState(POR_PAGINA);
  const categorias = useMemo(() => [...new Set(productos.map((p) => p.categoria))].sort(), [productos]);

  const palabras = normalizar(texto).split(/\s+/).filter(Boolean);
  const lista = productos.filter(
    (p) =>
      (!categoria || p.categoria === categoria) &&
      palabras.every((w) => normalizar(`${p.nombre} ${p.categoria}`).includes(w)),
  );

  function elegir(cat: string) {
    setCategoria(cat);
    setVisibles(POR_PAGINA);
  }

  return (
    <div className="space-y-5">
      <input
        type="search"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setVisibles(POR_PAGINA);
        }}
        placeholder="🔍 Buscar producto…"
        className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
      <div className="-mx-4 px-4 flex gap-2 overflow-x-auto pb-1">
        {["", ...categorias].map((cat) => (
          <button
            key={cat || "todas"}
            type="button"
            onClick={() => elegir(cat)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium ${
              categoria === cat ? "border-brand bg-brand text-white" : "border-gray-300 bg-white text-gray-600 hover:border-brand"
            }`}
          >
            {cat || "Todos"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {lista.slice(0, visibles).map((p) => (
          <div key={p.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50">
              {p.imagenUrl ? (
                <img src={p.imagenUrl} alt={p.nombre} loading="lazy" className="max-h-28 max-w-full object-contain" />
              ) : (
                <img src="/icon.svg" alt="" className="h-12 w-12 opacity-30" />
              )}
            </div>
            <div className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-brand">{p.categoria}</div>
            <div className="mt-0.5 flex-1 text-xs font-medium leading-snug text-gray-800 line-clamp-3">{p.nombre}</div>
            <a
              href={enlaceWhatsApp(`Hola, me interesa cotizar: ${p.nombre}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 rounded-full bg-brand px-3 py-2 text-center text-xs font-semibold text-white hover:bg-brand-dark"
            >
              Solicitar cotización
            </a>
          </div>
        ))}
      </div>
      {lista.length === 0 && <p className="text-center text-gray-500">No encontramos productos con esa búsqueda.</p>}
      {lista.length > visibles && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setVisibles((v) => v + POR_PAGINA)}
            className="rounded-full border border-brand px-6 py-2 text-sm font-semibold text-brand hover:bg-green-50"
          >
            Ver más ({lista.length - visibles})
          </button>
        </div>
      )}
    </div>
  );
}
