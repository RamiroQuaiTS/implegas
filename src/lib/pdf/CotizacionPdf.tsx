/* eslint-disable jsx-a11y/alt-text */
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { dinero, fechaCorta, importePartida, totales } from "../format";
import type { Cotizacion, Empresa } from "../types";

export type ImagenPdf = { data: Buffer; format: "png" | "jpg" } | null;

export interface CotizacionPdfProps {
  cot: Cotizacion;
  empresa: Empresa;
  imagenes: { logo: ImagenPdf; categoria: ImagenPdf; producto: ImagenPdf; whatsapp: ImagenPdf };
}

// Sin guiones automáticos al cortar palabras.
Font.registerHyphenationCallback((palabra) => [palabra]);

// Medidas tomadas de las cotizaciones de ejemplo (hoja carta, 612 x 792 pt).
const AZUL = "#DDEBF7";
const GRIS = "#E7E6E6";
const ANCHO_LBL = 82;
const COLS = { cant: 82, desc: 227, pu: 87, total: 89 };

const s = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 48, paddingLeft: 50, paddingRight: 76, fontFamily: "Helvetica", fontSize: 9.5 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", height: 72 },
  logo: { width: 150, height: 64, objectFit: "contain" },
  logoCat: { width: 100, height: 72, objectFit: "contain" },
  empresa: { alignItems: "center", marginTop: 4 },
  empresaNombre: { fontFamily: "Helvetica-Bold", fontSize: 12.5 },
  rfc: { marginTop: 4, marginLeft: -40, fontSize: 9.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  direccion: { marginTop: 10, fontSize: 9.5 },
  bloqueCliente: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  tablaCliente: { width: 310, borderWidth: 1.2, borderColor: "#000" },
  filaCliente: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#000", minHeight: 16 },
  lblCliente: {
    width: ANCHO_LBL,
    borderRightWidth: 1.2,
    borderColor: "#000",
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    paddingRight: 3,
    paddingTop: 3,
  },
  valCliente: { flex: 1, textAlign: "center", paddingTop: 3, paddingHorizontal: 3 },
  cajaCot: { width: 88, marginRight: 0 },
  cotTitulo: { backgroundColor: GRIS, fontFamily: "Helvetica-Bold", textAlign: "center", paddingVertical: 5, fontSize: 9.5 },
  cotFecha: { fontSize: 7.5, marginTop: 6 },
  area: { textAlign: "center", fontFamily: "Helvetica-Bold", marginTop: 18, fontSize: 9 },
  tabla: { marginTop: 16 },
  filaHead: { flexDirection: "row", backgroundColor: AZUL, borderWidth: 1, borderColor: "#000" },
  th: { fontFamily: "Helvetica-Bold", textAlign: "center", paddingVertical: 3, borderRightWidth: 1, borderColor: "#000" },
  fila: { flexDirection: "row", borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#000" },
  td: { paddingVertical: 2.5, paddingHorizontal: 3, borderRightWidth: 1, borderColor: "#000" },
  debajo: { flexDirection: "row", justifyContent: "space-between" },
  producto: { flexDirection: "row", width: COLS.cant + COLS.desc, paddingTop: 8, paddingRight: 8 },
  productoImg: { width: 110, height: 80, objectFit: "contain" },
  productoTxt: { flex: 1, paddingLeft: 10, paddingTop: 10, gap: 4 },
  totales: { width: COLS.pu + COLS.total },
  filaTot: { flexDirection: "row", borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#000" },
  lblTot: {
    width: COLS.pu,
    backgroundColor: AZUL,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    paddingVertical: 2.5,
    paddingRight: 3,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  valTot: { flex: 1, backgroundColor: AZUL, textAlign: "right", fontFamily: "Helvetica-Bold", paddingVertical: 2.5, paddingRight: 3 },
  seccion: { flexDirection: "row", marginTop: 10 },
  seccionLbl: { fontFamily: "Helvetica-Bold" },
  aviso: { color: "#E00000", textDecoration: "underline", marginTop: 2 },
  nota: { flexDirection: "row", borderWidth: 2, borderColor: "#000", marginTop: 6, padding: 2 },
  firmas: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  firmaCol: { width: 210, alignItems: "center" },
  linea: { borderBottomWidth: 0.6, borderColor: "#555", marginTop: 10, marginBottom: 4, width: 190 },
  wa: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  waIcon: { width: 18, height: 18, marginRight: 8 },
  footer: { position: "absolute", bottom: 28, left: 50, right: 76, textAlign: "center", fontSize: 9.5 },
});

function lineas(t: string) {
  return t.split("\n").filter((l) => l.trim() !== "");
}

export function CotizacionPdf({ cot, empresa, imagenes }: CotizacionPdfProps) {
  const { subtotal, iva, total } = totales(cot, empresa.ivaPct);
  const filasCliente: [string, string][] = [
    ["NOMBRE:", cot.cliente.nombre],
    ["ATENCION:", cot.cliente.atencion],
    ["E-MAIL", cot.cliente.email],
    ["CEL:", cot.cliente.cel],
    ["DOMICILIO:", cot.cliente.domicilio],
  ];

  return (
    <Document title={`Cotización ${cot.folio} ${cot.cliente.nombre}`} author={empresa.nombre}>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          {imagenes.logo ? <Image src={imagenes.logo} style={s.logo} /> : <View />}
          {imagenes.categoria ? <Image src={imagenes.categoria} style={s.logoCat} /> : <View />}
        </View>

        <View style={s.empresa}>
          <Text style={s.empresaNombre}>{empresa.nombre}</Text>
          {empresa.rfc ? (
            <Text style={s.rfc}>
              <Text style={s.bold}>RFC: </Text>
              {empresa.rfc}
            </Text>
          ) : null}
          <Text style={s.direccion}>{empresa.direccion}</Text>
        </View>

        <View style={s.bloqueCliente}>
          <View style={s.tablaCliente}>
            {filasCliente.map(([lbl, val], i) => (
              <View key={lbl} style={[s.filaCliente, i === filasCliente.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                <Text style={s.lblCliente}>{lbl}</Text>
                <Text style={[s.valCliente, lbl === "E-MAIL" ? { color: "#4a7bb0", textDecoration: "underline" } : {}]}>
                  {val}
                </Text>
              </View>
            ))}
          </View>
          <View style={s.cajaCot}>
            <Text style={s.cotTitulo}>COTIZACIÓN</Text>
            <Text style={s.cotFecha}>
              <Text style={s.bold}>FECHA: </Text>
              {fechaCorta(cot.fecha)}
            </Text>
            <Text style={s.cotFecha}>
              <Text style={s.bold}>VALIDO: </Text>
              {fechaCorta(cot.validoHasta)}
            </Text>
            <Text style={[s.cotFecha, { color: "#666" }]}>FOLIO: {String(cot.folio).padStart(4, "0")}</Text>
          </View>
        </View>

        {cot.area ? <Text style={s.area}>{cot.area}</Text> : null}

        <View style={[s.tabla, cot.area ? { marginTop: 12 } : {}]}>
          <View style={s.filaHead}>
            <Text style={[s.th, { width: COLS.cant }]}>CANTIDAD</Text>
            <Text style={[s.th, { width: COLS.desc }]}>DESCRIPCIÓN</Text>
            <Text style={[s.th, { width: COLS.pu }]}>PRECIO UNITARIO</Text>
            <Text style={[s.th, { width: COLS.total - 2, borderRightWidth: 0 }]}>TOTAL</Text>
          </View>
          {cot.partidas.map((p, i) => (
            <View key={i} style={s.fila} wrap={false}>
              <Text style={[s.td, { width: COLS.cant, textAlign: "center" }]}>{p.cantidad ?? ""}</Text>
              <Text style={[s.td, { width: COLS.desc }]}>{p.descripcion}</Text>
              <Text style={[s.td, { width: COLS.pu, textAlign: "right" }]}>{dinero(p.precio)}</Text>
              <Text style={[s.td, { width: COLS.total - 2, textAlign: "right", borderRightWidth: 0 }]}>
                {dinero(importePartida(p))}
              </Text>
            </View>
          ))}
        </View>

        <View style={s.debajo} wrap={false}>
          <View style={s.producto}>
            {imagenes.producto ? <Image src={imagenes.producto} style={s.productoImg} /> : null}
            {cot.imagenTexto ? (
              <View style={s.productoTxt}>
                {lineas(cot.imagenTexto).map((l, i) => {
                  const [k, ...v] = l.split(":");
                  return v.length && k.length < 20 ? (
                    <Text key={i}>
                      <Text style={s.bold}>{k}:</Text>
                      {v.join(":")}
                    </Text>
                  ) : (
                    <Text key={i} style={{ marginBottom: 2.5 }}>{l}</Text>
                  );
                })}
              </View>
            ) : null}
          </View>
          <View style={s.totales}>
            <View style={s.filaTot}>
              <Text style={s.lblTot}>SUB TOTAL</Text>
              <Text style={s.valTot}>{dinero(subtotal)}</Text>
            </View>
            <View style={s.filaTot}>
              <Text style={s.lblTot}>IVA</Text>
              <Text style={s.valTot}>{iva === null ? " " : dinero(iva)}</Text>
            </View>
            <View style={s.filaTot}>
              <Text style={s.lblTot}>TOTAL</Text>
              <Text style={s.valTot}>{total === null ? " " : dinero(total)}</Text>
            </View>
          </View>
        </View>

        {cot.incluye ? (
          <View style={[s.seccion, { marginTop: 16 }]} wrap={false}>
            <Text style={[s.seccionLbl, { width: 50 }]}>INCLUYE:</Text>
            <Text style={{ flex: 1 }}>{cot.incluye}</Text>
          </View>
        ) : null}
        {cot.aviso ? <Text style={s.aviso}>{cot.aviso}</Text> : null}

        {cot.garantia ? (
          <View style={s.seccion} wrap={false}>
            <Text style={[s.seccionLbl, { width: 60 }]}>GARANTIA:</Text>
            <View style={{ flex: 1 }}>
              {lineas(cot.garantia).map((l, i) => (
                <Text key={i} style={{ marginBottom: 2.5 }}>{l}</Text>
              ))}
            </View>
          </View>
        ) : null}

        {cot.nota ? (
          <View style={[s.nota, { marginTop: 10 }]} wrap={false}>
            <Text style={[s.seccionLbl, { width: 32 }]}>NOTA:</Text>
            <View style={{ flex: 1 }}>
              {lineas(cot.nota).map((l, i) => (
                <Text key={i} style={{ marginBottom: 2.5 }}>{l}</Text>
              ))}
            </View>
          </View>
        ) : null}

        <View style={s.firmas} wrap={false}>
          <View style={s.firmaCol}>
            <Text style={s.bold}>ATENTAMENTE</Text>
            <View style={s.linea} />
            <Text style={s.bold}>{empresa.firmante}</Text>
            {empresa.whatsapp ? (
              <View style={s.wa}>
                {imagenes.whatsapp ? <Image src={imagenes.whatsapp} style={s.waIcon} /> : null}
                <Text style={s.bold}>{empresa.whatsapp}</Text>
              </View>
            ) : null}
          </View>
          <View style={s.firmaCol}>
            <Text style={s.bold}>ACEPTO</Text>
            <View style={s.linea} />
            <Text>CLIENTE</Text>
          </View>
        </View>

        <Text style={s.footer} fixed>
          {empresa.direccion}
          {empresa.telefono ? `   TEL: ${empresa.telefono}` : ""}
        </Text>
      </Page>
    </Document>
  );
}
