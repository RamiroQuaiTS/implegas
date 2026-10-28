import bcrypt from "bcryptjs";
import type { Base, Db, Producto } from "./types";

const NOTA = [
  "TODO TRABAJO O MATERIAL NO DESCRITO, SE COBRA POR APARTE.",
  "ESTOS PRECIOS ESTAN SUJETOS A CAMBIOS SIN PREVIO AVISO O AGOTAR EXISTENCIA.",
  "GARANTIA DE 6 MESES CON TIENDA Y DEL MES 7 EN ADELANTE CON FABRICANTE.",
  "ESTOS PRECIOS SON MAS IVA.",
  "TODA CANCELACION TIENE UN CARGO DEL 20%",
].join("\n");

// Precios de referencia en MXN. Los que vienen de tus cotizaciones de ejemplo son reales;
// el resto son estimados para arrancar y se ajustan desde Admin > Productos.
const p = (
  id: string,
  categoria: string,
  nombre: string,
  unidad: string,
  precio: number,
  extra: Partial<Producto> = {},
): Producto => ({ id, categoria, nombre, unidad, precio, activo: true, ...extra });

const productos: Producto[] = [
  // Instalación de gas
  p("gas-regulador", "Gas", "REGULADOR DE BAJA PRESION PARA GAS LP", "PZA", 420),
  p("gas-regulador-2etapas", "Gas", "REGULADOR DE 2 ETAPAS PARA TANQUE ESTACIONARIO", "PZA", 780),
  p("gas-cobre-12", "Gas", "TUBERIA DE COBRE TIPO L 1/2\"", "MT", 185),
  p("gas-cobre-38", "Gas", "TUBERIA DE COBRE FLEXIBLE 3/8\"", "MT", 140),
  p("gas-valvula-esfera", "Gas", "VALVULA DE ESFERA PARA GAS 1/2\"", "PZA", 210),
  p("gas-conexiones", "Gas", "KIT DE CONEXIONES DE COBRE (CODOS, TEES, COPLES)", "KIT", 650),
  p("gas-conector-estufa", "Gas", "CONECTOR FLEXIBLE PARA ESTUFA 1/2\"", "PZA", 230),
  p("gas-conector-boiler", "Gas", "CONECTOR FLEXIBLE PARA BOILER 1/2\"", "PZA", 230),
  p("gas-soldadura", "Gas", "SOLDADURA, FUNDENTE Y CINTA TEFLON PARA GAS", "KIT", 320),
  p("gas-tanque-300", "Gas", "TANQUE ESTACIONARIO 300 LTS", "PZA", 6900),
  p("gas-tanque-500", "Gas", "TANQUE ESTACIONARIO 500 LTS", "PZA", 9800),
  p("gas-prueba", "Gas", "PRUEBA DE HERMETICIDAD CON MANOMETRO", "SERV", 650),

  // Paneles solares (fotovoltaicos)
  p("fv-panel-550", "Paneles solares", "PANEL SOLAR MONOCRISTALINO 550 W", "PZA", 3450),
  p("fv-microinversor", "Paneles solares", "MICROINVERSOR 800 W PARA 2 PANELES", "PZA", 4900),
  p("fv-inversor-5k", "Paneles solares", "INVERSOR INTERCONEXION A RED 5 KW", "PZA", 18500),
  p("fv-estructura", "Paneles solares", "ESTRUCTURA DE ALUMINIO PARA 2 PANELES", "PZA", 2300),
  p("fv-cable", "Paneles solares", "CABLE FOTOVOLTAICO 10 AWG", "MT", 38),
  p("fv-mc4", "Paneles solares", "CONECTORES MC4 (PAR)", "PAR", 95),
  p("fv-protecciones", "Paneles solares", "CENTRO DE CARGA Y PROTECCIONES AC/DC", "KIT", 2900),
  p("fv-tuberia", "Paneles solares", "TUBERIA CONDUIT Y ACCESORIOS", "KIT", 1800),
  p("fv-tramite-cfe", "Paneles solares", "TRAMITE DE INTERCONEXION CFE", "SERV", 3500),

  // Calentador solar (de tu cotización SOLAR 20 ALTA PRESION)
  p("cs-20-tubos", "Calentador solar", "SOLAR ALTA PRESION DE 20 TUBOS 200 LTS", "PZA", 13820, {
    imagenUrl: "/seed/calentador-solar.png",
  }),
  p("cs-15-tubos", "Calentador solar", "SOLAR ALTA PRESION DE 15 TUBOS 150 LTS", "PZA", 11200, {
    imagenUrl: "/seed/calentador-solar.png",
  }),
  p("cs-boiler-calorex", "Calentador solar", "BOYLER CALOREX", "PZA", 1600),
  p("cs-tuboplus", "Calentador solar", "TUBERIA TUBOPLUS 3/4\" Y CONEXIONES", "KIT", 1350),

  // Paneles WPC (de tu cotización PANEL R4 WPC)
  p("wpc-r4a-miel", "Paneles WPC", "PANEL RANURADO WPC R4-A COLOR MIEL", "PZA", 705, {
    imagenUrl: "/seed/panel-wpc.png",
    especificaciones: "LARGO: 290 CM\nANCHO: 19.5 CM\nGROSOR: 2.25 CM",
  }),

  // Aire acondicionado (de tu cotización CENTRO MAX)
  p("ac-mantenimiento", "Aire acondicionado", "MANTENIMIENTO DE SISTEMA A/C.", "SERV", 3850),
  p("ac-turbina", "Aire acondicionado", "DESMONTAJE DE TURBINA PARA CAMBIO BALEROS", "SERV", 1400),

  // Ósmosis (de tu cotización OSMOSIS DE 50 GPD)
  p("os-50gpd", "Purificación de agua", "SISTEMA DE OSMOSIS DE 50 GPD", "PZA", 5270, {
    imagenUrl: "/seed/osmosis.png",
    especificaciones:
      "OSMOSIS INVERSA DE 50 gpd, 6 Etapas, Con Lámpara Uv y Sensor de Fugas, Display Digital",
  }),
];

const bases: Base[] = [
  {
    id: "base-gas",
    nombre: "Instalación de gas",
    area: "",
    items: [
      { productoId: "gas-regulador", cantidad: 1 },
      { productoId: "gas-cobre-12", cantidad: 10 },
      { productoId: "gas-valvula-esfera", cantidad: 2 },
      { productoId: "gas-conexiones", cantidad: 1 },
      { productoId: "gas-conector-estufa", cantidad: 1 },
      { productoId: "gas-conector-boiler", cantidad: 1 },
      { productoId: "gas-soldadura", cantidad: 1 },
    ],
    manoObra: [
      { descripcion: "MANO DE OBRA INSTALACION DE LINEA DE GAS", precio: 2500 },
      { descripcion: "PRUEBA DE HERMETICIDAD", precio: 650 },
    ],
    incluye: "TUBERIA DE COBRE, VALVULAS DE ESFERA, CONEXIONES, CONECTORES, PRUEBA DE HERMETICIDAD Y MANO DE OBRA.",
    garantia: "01 AÑO EN INSTALACIÓN.",
    aviso: "",
  },
  {
    id: "base-paneles-solares",
    nombre: "Instalación de paneles solares",
    area: "",
    items: [
      { productoId: "fv-panel-550", cantidad: 6 },
      { productoId: "fv-microinversor", cantidad: 3 },
      { productoId: "fv-estructura", cantidad: 3 },
      { productoId: "fv-cable", cantidad: 30 },
      { productoId: "fv-mc4", cantidad: 6 },
      { productoId: "fv-protecciones", cantidad: 1 },
      { productoId: "fv-tuberia", cantidad: 1 },
    ],
    manoObra: [
      { descripcion: "INSTALACION DE PANELES SOLARES", precio: 6000 },
      { descripcion: "TRAMITE DE INTERCONEXION CFE", precio: 3500 },
    ],
    incluye: "PANELES, MICROINVERSORES, ESTRUCTURA, CABLEADO, PROTECCIONES, TUBERIA Y MANO DE OBRA.",
    garantia: "25 AÑOS EN PANELES (FABRICANTE)\n10 AÑOS EN MICROINVERSORES (FABRICANTE)\n01 AÑO EN INSTALACIÓN.",
    aviso: "",
  },
  {
    id: "base-calentador-solar",
    nombre: "Calentador solar",
    logoUrl: "/seed/calentador-solar.png",
    area: "",
    items: [
      { productoId: "cs-20-tubos", cantidad: 1 },
      { productoId: "cs-boiler-calorex", cantidad: 1 },
    ],
    manoObra: [],
    incluye: "TUBERIA TUBOPLUS 3/4, VALVULAS DE ESFERA, VALVULA CHECK, CODOS, TEES, CONECTORES Y MANO DE OBRA.",
    garantia: "07 AÑOS EN TERMOTANQUE\n01 AÑO EN INSTALACIÓN.",
    aviso: "",
  },
  {
    id: "base-wpc",
    nombre: "Paneles WPC (muro)",
    logoUrl: "/seed/wall-style.png",
    area: "AREA DE MURO",
    items: [{ productoId: "wpc-r4a-miel", cantidad: 14 }],
    manoObra: [{ descripcion: "INSTALACION EN MTS2", precio: 2600 }],
    incluye: "MATERIAL COTIZADO, PIJAS, TAQUETES, GRAPAS, SILICON Y MANO DE OBRA.",
    garantia: "",
    aviso: "",
  },
  {
    id: "base-aire",
    nombre: "Mantenimiento de aire acondicionado",
    logoUrl: "/seed/aire-acondicionado.png",
    area: "",
    items: [
      { productoId: "ac-mantenimiento", cantidad: 1 },
      { productoId: "ac-turbina", cantidad: 1 },
    ],
    manoObra: [],
    incluye:
      "MANTENIMIENTO DE EQUIPO, DESMONTAJE DE TURBINAS, CAMBIO DE BALEROS, LIMPIEZA DE EVAPORADORA, LIMPIEZA DE CONDENSADORA, CHEQUEO DE PRESIONES DE GAS, CHEQUEO DE DESAGUE, CHEQUEO DE INYECCIONES DE FLUJO DE AIRE.",
    garantia: "",
    aviso: "",
  },
  {
    id: "base-osmosis",
    nombre: "Ósmosis inversa",
    logoUrl: "/seed/clean-water.png",
    area: "",
    items: [{ productoId: "os-50gpd", cantidad: 1 }],
    manoObra: [{ descripcion: "INSTALACION DE EQUIPO DE OSMOSIS", precio: 1480 }],
    incluye: "SISTEMA DE OSMOSIS 50 gpd, ADAPTACION, PIJAS, TAQUETES, GRAPAS, SILICON Y MANO DE OBRA.",
    garantia: "",
    aviso: "SE TIENE QUE TENER UN TOMA CORRIENTE LUZ CERCANO PARA SU CORRECTO FUNCIONAMIENTO.",
  },
];

export function crearSemilla(): Db {
  const password = process.env.ADMIN_PASSWORD ?? (process.env.VERCEL ? "" : "admin123");
  if (!password) {
    throw new Error("Define ADMIN_PASSWORD en las variables de entorno para crear el usuario administrador.");
  }
  return {
    version: 1,
    empresa: {
      nombre: "LUIS ADOLFO ORNELAS TORRES",
      rfc: "OETL 850415 JG4",
      direccion: "AV. BARRIO DE GUADALUPE #128 COL: BARRIO DE GUADALUPE",
      telefono: "4773264648",
      whatsapp: "477 326 4648",
      firmante: "ING. LUIS ADOLFO ORNELAS TORRES.",
      atencion: "LUIS ORNELAS TORRES.",
      logoUrl: "/brand/implegas-pdf.png",
      nota: NOTA,
      ivaPct: 16,
      vigenciaDias: 15,
    },
    usuarios: [
      {
        id: "admin",
        nombre: "Administrador",
        email: (process.env.ADMIN_EMAIL ?? "admin@implegas.mx").toLowerCase(),
        passwordHash: bcrypt.hashSync(password, 10),
        rol: "admin",
      },
    ],
    productos,
    clientes: [],
    bases,
    cotizaciones: [],
    siguienteFolio: 1,
  };
}
