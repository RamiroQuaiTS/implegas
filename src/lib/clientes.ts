import type { ClienteCotizacion, Db } from "./types";

const digitos = (t?: string) => (t ?? "").replace(/\D/g, "").slice(-10);
const nombreClave = (t?: string) => (t ?? "").trim().toUpperCase().replace(/\s+/g, " ");

/**
 * Liga el cliente de una cotización con el catálogo de clientes: lo busca por id, celular o nombre;
 * si no existe lo crea, y si existe completa o actualiza sus datos de contacto. Regresa el id.
 */
export function registrarCliente(db: Db, c: ClienteCotizacion): string {
  const cel = digitos(c.cel);
  const existente =
    db.clientes.find((x) => x.id === c.clienteId) ??
    (cel.length === 10 ? db.clientes.find((x) => digitos(x.cel) === cel) : undefined) ??
    db.clientes.find((x) => nombreClave(x.nombre) === nombreClave(c.nombre));

  const datos = {
    nombre: nombreClave(c.nombre),
    email: c.email.trim() || undefined,
    cel: c.cel.trim() || undefined,
    domicilio: c.domicilio.trim() || undefined,
  };
  if (existente) {
    // Lo capturado en la cotización es lo más reciente; lo vacío no borra lo que ya había.
    existente.nombre = datos.nombre || existente.nombre;
    existente.email = datos.email ?? existente.email;
    existente.cel = datos.cel ?? existente.cel;
    existente.domicilio = datos.domicilio ?? existente.domicilio;
    return existente.id;
  }
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  db.clientes.push({ id, ...datos });
  return id;
}

/** Da de alta en el catálogo los clientes de cotizaciones hechas antes de que esto fuera automático. */
export function migrarClientesDeCotizaciones(db: Db): boolean {
  let cambios = false;
  for (const cot of db.cotizaciones) {
    if (cot.cliente.clienteId && db.clientes.some((x) => x.id === cot.cliente.clienteId)) continue;
    if (!cot.cliente.nombre.trim()) continue;
    cot.cliente.clienteId = registrarCliente(db, cot.cliente);
    cambios = true;
  }
  return cambios;
}
