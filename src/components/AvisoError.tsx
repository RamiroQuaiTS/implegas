"use client";

import { useSearchParams } from "next/navigation";

/** Muestra el ?error= que dejan las acciones al regresar al formulario. */
export function AvisoError() {
  const error = useSearchParams().get("error");
  if (!error) return null;
  return <p className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p>;
}
