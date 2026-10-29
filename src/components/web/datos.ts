// Contenido de la página web pública (textos de la presentación de ImpleGas).

export const WHATSAPP_LUIS = "524773264648";

export function enlaceWhatsApp(texto: string): string {
  return `https://wa.me/${WHATSAPP_LUIS}?text=${encodeURIComponent(texto)}`;
}

/** Fotos libres de Unsplash (licencia Unsplash). */
const foto = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const FOTO_PORTADA = foto("1624397640148-949b1732bb0a", 1800);

export const SERVICIOS = [
  {
    titulo: "Instalaciones de gas LP",
    texto: "Tanques estacionarios de 100 a 5,000 L, líneas de cobre, reguladores y líneas de llenado para hogar y negocio.",
    foto: foto("1595166986545-bf6dacb22b4e"),
  },
  {
    titulo: "Instalaciones de gas natural",
    texto: "Conexión, tubería y pruebas de hermeticidad cumpliendo la normativa vigente.",
    foto: foto("1694827893591-af9b80361599"),
  },
  {
    titulo: "Calentadores solares",
    texto: "Baja presión (8 a 30 tubos) y alta presión (10 a 30 tubos). Agua caliente gratis todo el año.",
    foto: foto("1723407653103-7a9c6b579acf"),
  },
  {
    titulo: "Paneles fotovoltaicos",
    texto: "Sistemas interconectados a CFE para reducir tu recibo de luz, con trámite incluido.",
    foto: foto("1655300256335-beef51a914fe"),
  },
  {
    titulo: "Aire acondicionado",
    texto: "Minisplits estándar e inverter de 1 a 7 ton, fancoil, piso techo y chiller. Instalación y mantenimiento.",
    foto: foto("1718203862467-c33159fdc504"),
  },
  {
    titulo: "Bombas, filtros y albercas",
    texto: "Bombas, hidroneumáticos, filtros, suavizadores, ósmosis inversa y equipo para alberca.",
    foto: foto("1562016600-ece13e8ba570"),
  },
  {
    titulo: "Wall Style",
    texto: "Panel WPC, lambrín, deck, tabloide, wall cladding, vigas WPC y piso SPC con instalación.",
    foto: foto("1722109997425-40f920848aed"),
  },
  {
    titulo: "Equipo de seguridad",
    texto: "Calzado de seguridad Discovery, Goodyear, Swissbrand y Triples Pro para dama y caballero.",
    foto: foto("1613325267798-05214c4d65f1"),
  },
];

export const VALORES = [
  { icono: "🛡️", texto: "Seguridad y cumplimiento normativo" },
  { icono: "🤝", texto: "Honestidad y buena práctica" },
  { icono: "💬", texto: "Comunicación abierta y dinámica" },
  { icono: "🌱", texto: "Pasión por el crecimiento" },
];
