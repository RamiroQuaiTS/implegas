import "server-only";
import ExcelJS from "exceljs";
import { nuevoId } from "./db";
import type { Producto } from "./types";

// Columnas del Excel de productos. "ID" enlaza cada renglón con el producto existente.
const COLUMNAS = [
  { header: "ID", key: "id", width: 16 },
  { header: "DESCRIPCION", key: "nombre", width: 50 },
  { header: "CATEGORIA", key: "categoria", width: 22 },
  { header: "UNIDAD", key: "unidad", width: 10 },
  { header: "PRECIO", key: "precio", width: 14 },
  { header: "ESPECIFICACIONES", key: "especificaciones", width: 40 },
  { header: "ACTIVO (SI/NO)", key: "activo", width: 14 },
];

export async function productosAExcel(productos: Producto[]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Productos");
  ws.columns = COLUMNAS;
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDEBF7" } };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  for (const p of [...productos].sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre))) {
    ws.addRow({ ...p, especificaciones: p.especificaciones ?? "", activo: p.activo ? "SI" : "NO" });
  }
  ws.getColumn("precio").numFmt = '"$"#,##0.00';
  ws.getColumn("especificaciones").alignment = { wrapText: true, vertical: "top" };

  const ayuda = wb.addWorksheet("Instrucciones");
  ayuda.getColumn(1).width = 110;
  [
    "Cómo usar este archivo:",
    "• Edita descripción, categoría, unidad, precio, especificaciones o activo y vuelve a subirlo en Productos › Subir Excel.",
    "• No cambies la columna ID: con ella se identifica cada producto existente.",
    "• Para agregar un producto nuevo, agrega un renglón con el ID vacío.",
    "• Para dejar de usar un producto, pon NO en ACTIVO. Los productos que no estén en el archivo no se modifican.",
    "• Las imágenes no viajan en el Excel: se conservan las que ya tenga cada producto.",
  ].forEach((t) => ayuda.addRow([t]));

  return Buffer.from(await wb.xlsx.writeBuffer());
}

function celda(v: ExcelJS.CellValue): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    if ("result" in v) return celda(v.result as ExcelJS.CellValue);
    if ("text" in v) return String(v.text);
    if ("richText" in v) return v.richText.map((r) => r.text).join("");
  }
  return String(v).trim();
}

export interface ResultadoImportacion {
  actualizados: number;
  nuevos: number;
  errores: string[];
}

/** Aplica el Excel sobre la lista de productos (la modifica) y regresa un resumen. */
export async function aplicarExcel(archivo: ArrayBuffer, productos: Producto[]): Promise<ResultadoImportacion> {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(archivo);
  const ws = wb.getWorksheet("Productos") ?? wb.worksheets[0];
  if (!ws) return { actualizados: 0, nuevos: 0, errores: ["El archivo no tiene hojas."] };

  // Ubica las columnas por su encabezado para tolerar que las muevan de lugar.
  const pos: Record<string, number> = {};
  ws.getRow(1).eachCell((c, n) => {
    const h = celda(c.value).toUpperCase();
    const col = COLUMNAS.find((x) => h.startsWith(x.header.split(" ")[0]));
    if (col) pos[col.key] = n;
  });
  const faltan = ["nombre", "categoria", "precio"].filter((k) => !pos[k]);
  if (faltan.length) {
    return { actualizados: 0, nuevos: 0, errores: ["Faltan columnas: DESCRIPCION, CATEGORIA y PRECIO son obligatorias."] };
  }

  const r: ResultadoImportacion = { actualizados: 0, nuevos: 0, errores: [] };
  const porId = new Map(productos.map((p) => [p.id, p]));
  ws.eachRow((row, n) => {
    if (n === 1) return;
    const v = (k: string) => (pos[k] ? celda(row.getCell(pos[k]).value) : "");
    const nombre = v("nombre").toUpperCase();
    if (!nombre && !v("precio")) return; // renglón vacío
    const precio = Number(v("precio").replace(/[$,\s]/g, ""));
    if (!nombre || !v("categoria") || !Number.isFinite(precio)) {
      r.errores.push(`Renglón ${n}: falta descripción, categoría o el precio no es un número.`);
      return;
    }
    const datos = {
      nombre,
      categoria: v("categoria"),
      unidad: v("unidad").toUpperCase() || "PZA",
      precio,
      especificaciones: v("especificaciones") || undefined,
      activo: pos.activo ? !/^no$/i.test(v("activo")) : true,
    };
    const existente = porId.get(v("id"));
    if (existente) {
      Object.assign(existente, datos);
      r.actualizados++;
    } else {
      const nuevo: Producto = { id: nuevoId(), ...datos };
      productos.push(nuevo);
      porId.set(nuevo.id, nuevo);
      r.nuevos++;
    }
  });
  return r;
}
