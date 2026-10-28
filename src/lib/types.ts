export type Rol = "admin" | "vendedor";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  rol: Rol;
}

export interface Empresa {
  nombre: string;
  rfc: string;
  direccion: string;
  telefono: string;
  whatsapp: string;
  firmante: string;
  atencion: string;
  logoUrl: string;
  nota: string;
  ivaPct: number;
  vigenciaDias: number;
}

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  precio: number;
  imagenUrl?: string;
  especificaciones?: string;
  activo: boolean;
}

export interface Cliente {
  id: string;
  nombre: string;
  atencion?: string;
  email?: string;
  cel?: string;
  domicilio?: string;
  rfc?: string;
  imagenUrl?: string;
  notas?: string;
}

export interface BaseItem {
  productoId: string;
  cantidad: number;
}

export interface ManoObra {
  descripcion: string;
  precio: number;
}

/** Plantilla de cotización: al elegirla se precargan sus productos y mano de obra. */
export interface Base {
  id: string;
  nombre: string;
  logoUrl?: string;
  area?: string;
  items: BaseItem[];
  manoObra: ManoObra[];
  incluye: string;
  garantia: string;
  aviso: string;
}

export interface Partida {
  tipo: "producto" | "mano_obra";
  productoId?: string;
  cantidad: number | null;
  descripcion: string;
  precio: number;
}

export interface ClienteCotizacion {
  clienteId?: string;
  nombre: string;
  atencion: string;
  email: string;
  cel: string;
  domicilio: string;
}

export interface Cotizacion {
  id: string;
  folio: number;
  fecha: string; // YYYY-MM-DD
  validoHasta: string; // YYYY-MM-DD
  baseId?: string;
  titulo: string;
  cliente: ClienteCotizacion;
  logoCategoriaUrl?: string;
  area: string;
  partidas: Partida[];
  imagenUrl?: string;
  imagenTexto: string;
  incluye: string;
  garantia: string;
  aviso: string;
  nota: string;
  incluirIva: boolean;
  shareToken: string;
  creadoPor: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Db {
  version: 1;
  empresa: Empresa;
  usuarios: Usuario[];
  productos: Producto[];
  clientes: Cliente[];
  bases: Base[];
  cotizaciones: Cotizacion[];
  siguienteFolio: number;
}
