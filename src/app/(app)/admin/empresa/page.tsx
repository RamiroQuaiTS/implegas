/* eslint-disable @next/next/no-img-element */
import { AvisoError } from "@/components/AvisoError";
import { InputImagen } from "@/components/InputImagen";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { guardarEmpresa } from "../actions";

export default async function EmpresaPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireAdmin();
  const { ok } = await searchParams;
  const e = (await getDb()).empresa;
  const campo = (name: keyof typeof e, label: string, extra = "") => (
    <label className="block">
      <span className="label">{label}</span>
      <input name={name} defaultValue={String(e[name])} className={`input ${extra}`} />
    </label>
  );

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-bold">Datos de la empresa</h1>
      <AvisoError />
      <p className="text-sm text-gray-500">Así aparecen en el encabezado, la firma y el pie de cada cotización.</p>
      {ok && <p className="rounded-md bg-green-50 text-green-700 text-sm px-3 py-2">Cambios guardados.</p>}
      <form action={guardarEmpresa} className="card space-y-4">
        <div className="flex items-center gap-4">
          <img src={e.logoUrl} alt="Logo" className="h-16 object-contain" />
          <label className="block flex-1">
            <span className="label">Cambiar logo (PNG o JPG)</span>
            <InputImagen name="logo" />
          </label>
        </div>
        {campo("nombre", "Nombre / razón social", "uppercase")}
        <div className="grid gap-4 sm:grid-cols-2">
          {campo("rfc", "RFC", "uppercase")}
          {campo("telefono", "Teléfono (pie de página)")}
        </div>
        {campo("direccion", "Dirección", "uppercase")}
        <div className="grid gap-4 sm:grid-cols-2">
          {campo("firmante", "Firma (ATENTAMENTE)", "uppercase")}
          {campo("whatsapp", "WhatsApp bajo la firma")}
        </div>
        {campo("atencion", "Atención (valor por defecto)", "uppercase")}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">IVA %</span>
            <input name="ivaPct" type="number" step="0.01" defaultValue={e.ivaPct} className="input" />
          </label>
          <label className="block">
            <span className="label">Vigencia de la cotización (días)</span>
            <input name="vigenciaDias" type="number" min="1" defaultValue={e.vigenciaDias} className="input" />
          </label>
        </div>
        <label className="block">
          <span className="label">Nota (recuadro al final, una línea por renglón)</span>
          <textarea name="nota" rows={6} defaultValue={e.nota} className="input" />
        </label>
        <button className="btn-primary">Guardar</button>
      </form>
    </div>
  );
}
