export function texto(form: FormData, campo: string): string {
  return String(form.get(campo) ?? "").trim();
}

export function numero(form: FormData, campo: string): number {
  const n = Number(texto(form, campo).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function archivo(form: FormData, campo: string): File | null {
  const f = form.get(campo);
  return f instanceof File && f.size > 0 ? f : null;
}
