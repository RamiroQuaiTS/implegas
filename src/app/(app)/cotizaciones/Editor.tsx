"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState, useTransition } from "react";
import { dinero, importePartida, totales } from "@/lib/format";
import type { Base, Cliente, Partida, Producto } from "@/lib/types";
import { guardarCotizacion, type BorradorCotizacion } from "./actions";

interface Props {
  inicial: BorradorCotizacion;
  productos: Producto[];
  clientes: Cliente[];
  bases: Base[];
  ivaPct: number;
}

export function Editor({ inicial, productos, clientes, bases, ivaPct }: Props) {
  const [c, setC] = useState<BorradorCotizacion>(inicial);
  const [error, setError] = useState<string | null>(null);
  const [guardando, startTransition] = useTransition();
  const [agregarId, setAgregarId] = useState("");

  const set = <K extends keyof BorradorCotizacion>(k: K, v: BorradorCotizacion[K]) => setC((x) => ({ ...x, [k]: v }));
  const setCliente = (k: keyof BorradorCotizacion["cliente"], v: string) =>
    setC((x) => ({ ...x, cliente: { ...x.cliente, [k]: v } }));
  const setPartida = (i: number, cambios: Partial<Partida>) =>
    setC((x) => ({ ...x, partidas: x.partidas.map((p, j) => (j === i ? { ...p, ...cambios } : p)) }));
  const mover = (i: number, d: -1 | 1) =>
    setC((x) => {
      const ps = [...x.partidas];
      const j = i + d;
      if (j < 0 || j >= ps.length) return x;
      [ps[i], ps[j]] = [ps[j], ps[i]];
      return { ...x, partidas: ps };
    });

  const { subtotal, iva, total } = totales(c, ivaPct);
  const categorias = useMemo(() => [...new Set(productos.map((p) => p.categoria))].sort(), [productos]);
  const imagenes = useMemo(() => productos.filter((p) => p.imagenUrl), [productos]);
  const logos = useMemo(() => bases.filter((b) => b.logoUrl), [bases]);

  function elegirCliente(id: string) {
    const cl = clientes.find((x) => x.id === id);
    setC((x) => ({
      ...x,
      guardarCliente: false,
      cliente: cl
        ? {
            clienteId: cl.id,
            nombre: cl.nombre,
            atencion: cl.atencion ?? x.cliente.atencion,
            email: cl.email ?? "",
            cel: cl.cel ?? "",
            domicilio: cl.domicilio ?? "",
          }
        : { ...x.cliente, clienteId: undefined, nombre: "", email: "", cel: "", domicilio: "" },
    }));
  }

  function agregarProducto() {
    const p = productos.find((x) => x.id === agregarId);
    if (!p) return;
    // Los productos van antes de la mano de obra, como en las cotizaciones de ejemplo.
    const nueva: Partida = { tipo: "producto", productoId: p.id, cantidad: 1, descripcion: p.nombre, precio: p.precio };
    setC((x) => {
      const i = x.partidas.findIndex((y) => y.tipo === "mano_obra");
      const ps = [...x.partidas];
      ps.splice(i < 0 ? ps.length : i, 0, nueva);
      return {
        ...x,
        partidas: ps,
        ...(x.imagenUrl || !p.imagenUrl ? {} : { imagenUrl: p.imagenUrl, imagenTexto: p.especificaciones ?? "" }),
      };
    });
    setAgregarId("");
  }

  function guardar() {
    setError(null);
    startTransition(async () => {
      const r = await guardarCotizacion(c);
      if (r?.error) setError(r.error);
    });
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold">{c.id ? "Editar cotización" : "Nueva cotización"}</h1>
        <input
          value={c.titulo}
          onChange={(e) => set("titulo", e.target.value)}
          placeholder="Concepto (ej. Instalación de gas)"
          className="input max-w-xs"
        />
      </div>

      {/* Cliente */}
      <section className="card space-y-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="block flex-1 min-w-60">
            <span className="label">Cliente del catálogo</span>
            <select value={c.cliente.clienteId ?? ""} onChange={(e) => elegirCliente(e.target.value)} className="input">
              <option value="">— Cliente nuevo / capturar a mano —</option>
              {[...clientes]
                .sort((a, b) => a.nombre.localeCompare(b.nombre))
                .map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.nombre}
                    {cl.cel ? ` · ${cl.cel}` : ""}
                  </option>
                ))}
            </select>
          </label>
          {!c.cliente.clienteId && (
            <label className="flex items-center gap-2 text-sm pb-2">
              <input type="checkbox" checked={!!c.guardarCliente} onChange={(e) => set("guardarCliente", e.target.checked)} />
              Guardar en el catálogo de clientes
            </label>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Campo label="Nombre" value={c.cliente.nombre} onChange={(v) => setCliente("nombre", v)} upper />
          <Campo label="Atención" value={c.cliente.atencion} onChange={(v) => setCliente("atencion", v)} upper />
          <Campo label="E-mail" value={c.cliente.email} onChange={(v) => setCliente("email", v)} upper />
          <Campo label="Celular" value={c.cliente.cel} onChange={(v) => setCliente("cel", v)} />
        </div>
        <Campo label="Domicilio" value={c.cliente.domicilio} onChange={(v) => setCliente("domicilio", v)} upper />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="label">Fecha</span>
            <input type="date" value={c.fecha} onChange={(e) => set("fecha", e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="label">Válida hasta</span>
            <input type="date" value={c.validoHasta} onChange={(e) => set("validoHasta", e.target.value)} className="input" />
          </label>
          <Campo label="Título de área (opcional)" value={c.area} onChange={(v) => set("area", v)} upper placeholder="AREA DE MURO" />
        </div>
      </section>

      {/* Conceptos */}
      <section className="card space-y-3">
        <h2 className="font-semibold">Conceptos</h2>
        {/* En celular cada concepto se apila; en pantallas grandes se ve como tabla. */}
        <div className="hidden md:grid grid-cols-[6rem_1fr_9rem_7rem_5.5rem] gap-2 px-1 text-xs font-semibold uppercase text-gray-500">
          <span>Cantidad</span>
          <span>Descripción</span>
          <span>Precio unitario</span>
          <span className="text-right">Total</span>
          <span></span>
        </div>
        <div className="divide-y divide-gray-100">
          {c.partidas.map((p, i) => (
            <div
              key={i}
              className={`grid grid-cols-[5rem_1fr_auto] md:grid-cols-[6rem_1fr_9rem_7rem_5.5rem] gap-2 items-center py-2 px-1 ${
                p.tipo === "mano_obra" ? "bg-amber-50/60" : ""
              }`}
            >
              <div className="col-span-3 md:col-span-1 md:col-start-2 md:row-start-1 flex items-center gap-2">
                {p.tipo === "mano_obra" && (
                  <span className="text-[10px] font-bold uppercase text-amber-700 whitespace-nowrap">Mano de obra</span>
                )}
                <input
                  value={p.descripcion}
                  placeholder="Descripción"
                  onChange={(e) => setPartida(i, { descripcion: e.target.value.toUpperCase() })}
                  className="input"
                />
              </div>
              <label className="md:col-start-1 md:row-start-1">
                <span className="label md:hidden">Cant.</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={p.cantidad ?? ""}
                  onFocus={(e) => e.target.select()}
                  placeholder="—"
                  onChange={(e) => setPartida(i, { cantidad: e.target.value === "" ? null : Number(e.target.value) })}
                  className="input"
                />
              </label>
              <label>
                <span className="label md:hidden">Precio unitario</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={p.precio || ""}
                  placeholder="0.00"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setPartida(i, { precio: Number(e.target.value) })}
                  className="input"
                />
              </label>
              <div className="text-right">
                <span className="label md:hidden">Total</span>
                <span className="font-medium whitespace-nowrap">{dinero(importePartida(p))}</span>
              </div>
              <div className="col-span-3 md:col-span-1 whitespace-nowrap text-right">
                <button type="button" onClick={() => mover(i, -1)} className="px-2 py-1 text-gray-400 hover:text-gray-700" title="Subir">
                  ▲
                </button>
                <button type="button" onClick={() => mover(i, 1)} className="px-2 py-1 text-gray-400 hover:text-gray-700" title="Bajar">
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => set("partidas", c.partidas.filter((_, j) => j !== i))}
                  className="px-2 py-1 text-red-500 hover:text-red-700"
                  title="Quitar"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <select value={agregarId} onChange={(e) => setAgregarId(e.target.value)} className="input w-full sm:max-w-md">
            <option value="">Agregar producto del catálogo…</option>
            {categorias.map((cat) => (
              <optgroup key={cat} label={cat}>
                {productos
                  .filter((p) => p.categoria === cat)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({dinero(p.precio)})
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <button type="button" onClick={agregarProducto} disabled={!agregarId} className="btn">
            Agregar
          </button>
          <button
            type="button"
            onClick={() =>
              set("partidas", [...c.partidas, { tipo: "mano_obra", cantidad: 1, descripcion: "MANO DE OBRA", precio: 0 }])
            }
            className="btn"
          >
            + Mano de obra
          </button>
          <button
            type="button"
            onClick={() => set("partidas", [...c.partidas, { tipo: "producto", cantidad: 1, descripcion: "", precio: 0 }])}
            className="btn"
          >
            + Concepto libre
          </button>
        </div>

        <div className="ml-auto w-full max-w-xs space-y-1 text-sm pt-2">
          <Fila label="Subtotal" valor={dinero(subtotal)} />
          <Fila label={`IVA ${ivaPct}%`} valor={iva === null ? "—" : dinero(iva)} />
          <Fila label="Total" valor={total === null ? "—" : dinero(total)} bold />
          <label className="flex items-center justify-end gap-2 pt-1 text-gray-600">
            <input type="checkbox" checked={c.incluirIva} onChange={(e) => set("incluirIva", e.target.checked)} />
            Calcular IVA y total en el PDF
          </label>
        </div>
      </section>

      {/* Imagen y textos */}
      <section className="card space-y-4">
        <h2 className="font-semibold">Imagen y textos del PDF</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <span className="label">Logo de la categoría (arriba a la derecha)</span>
            <div className="flex items-center gap-3">
              {c.logoCategoriaUrl && <img src={c.logoCategoriaUrl} alt="" className="h-14 w-14 object-contain border rounded" />}
              <select value={c.logoCategoriaUrl ?? ""} onChange={(e) => set("logoCategoriaUrl", e.target.value || undefined)} className="input">
                <option value="">Sin logo</option>
                {logos.map((b) => (
                  <option key={b.id} value={b.logoUrl}>
                    {b.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <span className="label">Imagen del producto (debajo de la tabla)</span>
            <div className="flex items-center gap-3">
              {c.imagenUrl && <img src={c.imagenUrl} alt="" className="h-14 w-14 object-contain border rounded" />}
              <select
                value={c.imagenUrl ?? ""}
                onChange={(e) => {
                  const p = imagenes.find((x) => x.imagenUrl === e.target.value);
                  setC((x) => ({ ...x, imagenUrl: e.target.value || undefined, imagenTexto: p?.especificaciones ?? x.imagenTexto }));
                }}
                className="input"
              >
                <option value="">Sin imagen</option>
                {imagenes.map((p) => (
                  <option key={p.id} value={p.imagenUrl}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <Area label="Texto junto a la imagen (medidas, características)" value={c.imagenTexto} onChange={(v) => set("imagenTexto", v)} rows={3} />
        <Area label="Incluye" value={c.incluye} onChange={(v) => set("incluye", v.toUpperCase())} rows={2} />
        <Area label="Aviso en rojo (opcional)" value={c.aviso} onChange={(v) => set("aviso", v.toUpperCase())} rows={1} />
        <Area label="Garantía (una línea por renglón)" value={c.garantia} onChange={(v) => set("garantia", v.toUpperCase())} rows={2} />
        <Area label="Nota" value={c.nota} onChange={(v) => set("nota", v)} rows={5} />
      </section>

      <div className="fixed bottom-0 inset-x-0 bg-white/95 border-t border-gray-200 py-3">
        <div className="mx-auto max-w-6xl px-4 flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Subtotal <b className="text-gray-900">{dinero(subtotal)}</b>
          </span>
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button onClick={guardar} disabled={guardando} className="btn-primary ml-auto">
            {guardando ? "Guardando…" : "Guardar y generar PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo(props: { label: string; value: string; onChange: (v: string) => void; upper?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="label">{props.label}</span>
      <input
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(props.upper ? e.target.value.toUpperCase() : e.target.value)}
        className="input"
      />
    </label>
  );
}

function Area(props: { label: string; value: string; onChange: (v: string) => void; rows: number }) {
  return (
    <label className="block">
      <span className="label">{props.label}</span>
      <textarea value={props.value} rows={props.rows} onChange={(e) => props.onChange(e.target.value)} className="input" />
    </label>
  );
}

function Fila({ label, valor, bold }: { label: string; valor: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-base border-t pt-1" : ""}`}>
      <span>{label}</span>
      <span>{valor}</span>
    </div>
  );
}
