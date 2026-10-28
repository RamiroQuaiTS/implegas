"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { nuevoId, updateDb } from "@/lib/db";
import { aplicarExcel } from "@/lib/excel";
import { archivo, numero, texto } from "@/lib/form";
import { guardarImagen } from "@/lib/storage";
import type { Base, BaseItem, ManoObra, Producto, Rol } from "@/lib/types";

// ---------- Productos ----------

export async function guardarProducto(form: FormData) {
  await requireAdmin();
  const id = texto(form, "id") || nuevoId();
  const imagenUrl = (await guardarImagen(archivo(form, "imagen"), "producto")) ?? (texto(form, "imagenActual") || undefined);
  const producto: Producto = {
    id,
    nombre: texto(form, "nombre").toUpperCase(),
    categoria: texto(form, "categoria"),
    unidad: texto(form, "unidad").toUpperCase() || "PZA",
    precio: numero(form, "precio"),
    especificaciones: texto(form, "especificaciones") || undefined,
    imagenUrl: form.get("quitarImagen") ? undefined : imagenUrl,
    activo: form.get("activo") === "on",
  };
  await updateDb((db) => {
    const i = db.productos.findIndex((p) => p.id === id);
    if (i >= 0) db.productos[i] = producto;
    else db.productos.push(producto);
  });
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function eliminarProducto(form: FormData) {
  await requireAdmin();
  const id = texto(form, "id");
  await updateDb((db) => {
    db.productos = db.productos.filter((p) => p.id !== id);
    for (const b of db.bases) b.items = b.items.filter((it) => it.productoId !== id);
  });
  revalidatePath("/admin/productos");
  redirect("/admin/productos");
}

export async function importarProductos(form: FormData) {
  await requireAdmin();
  const f = archivo(form, "excel");
  let mensaje: string;
  if (!f || !f.name.toLowerCase().endsWith(".xlsx")) {
    mensaje = "error:Elige un archivo .xlsx (el que descargas con “Descargar Excel”).";
  } else {
    const contenido = await f.arrayBuffer();
    mensaje = await updateDb(async (db) => {
      // Se trabaja sobre una copia: si hay errores no se guarda nada.
      const copia = structuredClone(db.productos);
      const r = await aplicarExcel(contenido, copia);
      if (r.errores.length) return "error:" + r.errores.slice(0, 5).join(" ");
      db.productos = copia;
      return `ok:Se actualizaron ${r.actualizados} productos y se agregaron ${r.nuevos} nuevos.`;
    }).catch(() => "error:No se pudo leer el archivo. Revisa que sea un Excel (.xlsx).");
  }
  revalidatePath("/admin/productos");
  redirect(`/admin/productos?msg=${encodeURIComponent(mensaje)}`);
}

// ---------- Bases de cotización ----------

export async function guardarBase(form: FormData) {
  await requireAdmin();
  const id = texto(form, "id") || nuevoId();
  const items = JSON.parse(texto(form, "items") || "[]") as BaseItem[];
  const manoObra = JSON.parse(texto(form, "manoObra") || "[]") as ManoObra[];
  const logoUrl = (await guardarImagen(archivo(form, "logo"), "base")) ?? (texto(form, "logoActual") || undefined);
  const base: Base = {
    id,
    nombre: texto(form, "nombre"),
    area: texto(form, "area").toUpperCase(),
    logoUrl: form.get("quitarLogo") ? undefined : logoUrl,
    items: items.filter((it) => it.productoId).map((it) => ({ productoId: it.productoId, cantidad: Number(it.cantidad) || 1 })),
    manoObra: manoObra
      .filter((m) => m.descripcion.trim())
      .map((m) => ({ descripcion: m.descripcion.trim().toUpperCase(), precio: Number(m.precio) || 0 })),
    incluye: texto(form, "incluye"),
    garantia: texto(form, "garantia"),
    aviso: texto(form, "aviso"),
  };
  await updateDb((db) => {
    const i = db.bases.findIndex((b) => b.id === id);
    if (i >= 0) db.bases[i] = base;
    else db.bases.push(base);
  });
  revalidatePath("/admin/bases");
  redirect("/admin/bases");
}

export async function eliminarBase(form: FormData) {
  await requireAdmin();
  const id = texto(form, "id");
  await updateDb((db) => {
    db.bases = db.bases.filter((b) => b.id !== id);
  });
  revalidatePath("/admin/bases");
  redirect("/admin/bases");
}

// ---------- Empresa ----------

export async function guardarEmpresa(form: FormData) {
  await requireAdmin();
  const logo = await guardarImagen(archivo(form, "logo"), "empresa");
  await updateDb((db) => {
    db.empresa = {
      ...db.empresa,
      nombre: texto(form, "nombre").toUpperCase(),
      rfc: texto(form, "rfc").toUpperCase(),
      direccion: texto(form, "direccion").toUpperCase(),
      telefono: texto(form, "telefono"),
      whatsapp: texto(form, "whatsapp"),
      firmante: texto(form, "firmante").toUpperCase(),
      atencion: texto(form, "atencion").toUpperCase(),
      nota: texto(form, "nota"),
      ivaPct: numero(form, "ivaPct"),
      vigenciaDias: Math.max(1, Math.round(numero(form, "vigenciaDias"))),
      logoUrl: logo ?? db.empresa.logoUrl,
    };
  });
  revalidatePath("/admin/empresa");
  redirect("/admin/empresa?ok=1");
}

// ---------- Usuarios ----------

export async function guardarUsuario(form: FormData) {
  await requireAdmin();
  const id = texto(form, "id");
  const email = texto(form, "email").toLowerCase();
  const password = texto(form, "password");
  const rol = (texto(form, "rol") === "admin" ? "admin" : "vendedor") as Rol;
  const error = await updateDb((db) => {
    if (db.usuarios.some((u) => u.email === email && u.id !== id)) return "Ya existe un usuario con ese correo.";
    const existente = db.usuarios.find((u) => u.id === id);
    if (existente) {
      if (existente.rol === "admin" && rol !== "admin" && db.usuarios.filter((u) => u.rol === "admin").length === 1) {
        return "Debe quedar al menos un administrador.";
      }
      existente.nombre = texto(form, "nombre");
      existente.email = email;
      existente.rol = rol;
      if (password) existente.passwordHash = bcrypt.hashSync(password, 10);
      return null;
    }
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    db.usuarios.push({ id: nuevoId(), nombre: texto(form, "nombre"), email, rol, passwordHash: bcrypt.hashSync(password, 10) });
    return null;
  });
  revalidatePath("/admin/usuarios");
  redirect(`/admin/usuarios${error ? `?error=${encodeURIComponent(error)}` : ""}`);
}

export async function eliminarUsuario(form: FormData) {
  const sesion = await requireAdmin();
  const id = texto(form, "id");
  if (id !== sesion.uid) {
    await updateDb((db) => {
      db.usuarios = db.usuarios.filter((u) => u.id !== id);
    });
  }
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}
