# Cotización: Sitio web y sistema de cotizaciones ImpleGas

Oct 30, 2026 · @Ramiro Tello

Para: **Ing. Luis Adolfo Ornelas Torres**, ImpleGas (Implementos para Gas), León, Gto.

Propuesta para dejar en producción la **página web de ImpleGas** y el **sistema de cotizaciones con panel de administración** que ya probaste en versión demo. Hay dos formas de contratarlo: **Opción A, pago único de $22,000 MXN** (tú eres dueño de todo) u **Opción B, $1,900 MXN al mes** (hospedaje, dominio y soporte incluidos).

## Qué incluye

Ambas opciones incluyen lo mismo: todo lo que ya está funcionando en la demo, en tu propio dominio.

**Página web pública**

- Diseño con la imagen de ImpleGas, adaptado a celular y computadora.
- Secciones: portada, quiénes somos, misión y valores, servicios, catálogo, contacto y ubicación con mapa.
- Catálogo sin precios conectado al sistema: lo que cambias en el panel se refleja en la web.
- Botones y formulario que abren WhatsApp directo contigo.

**Sistema de cotizaciones y panel de administración**

- Acceso con usuario y contraseña, con perfiles de administrador y vendedor.
- Cotizaciones a partir de bases (gas, calentador solar, aire acondicionado, etc.) con productos y mano de obra editables.
- PDF con el formato actual de ImpleGas, listo para enviar por WhatsApp o correo.
- Catálogo de productos con fotos, carga y descarga por Excel.
- Catálogo de clientes que se llena solo al cotizar.
- Configuración de datos de la empresa, notas, IVA y vigencia.

## Servicios externos necesarios

Para funcionar en internet el sistema usa tres servicios, que en total cuestan unos **$410 MXN al mes**. Precios aproximados, con el dólar a $18.50.

| Servicio | Para qué sirve | Costo aproximado |
| --- | --- | --- |
| Dominio .com.mx (ej. implegas.com.mx) | La dirección de la página | $450 MXN al año (unos $40 al mes) |
| Vercel Pro | Hospedaje de la web y el sistema; el plan gratis no permite uso comercial | US$20 al mes (unos $370 MXN) |
| Upstash Redis | Base de datos (productos, clientes, cotizaciones) | $0, el plan gratis alcanza de sobra para este volumen |
| Vercel Blob | Fotos de productos, clientes y logos | Incluido en Vercel Pro |

La base de datos no requiere pago: el plan gratis permite 500 mil operaciones al mes y el sistema usa unas cuantas por cotización. Si algún día creciera mucho, el costo extra sería de centavos.

## Opción A: pago único, eres dueño de todo

**$22,000 MXN en un solo pago.** El sistema, el código y todas las cuentas quedan a tu nombre.

| Concepto | Precio |
| --- | --- |
| Diseño y desarrollo de la página web | $7,000 MXN |
| Sistema de cotizaciones y panel de administración | $15,000 MXN |
| **Total** | **$22,000 MXN** |

Incluye:

- Configuración del dominio y traspaso de las cuentas (dominio, Vercel, base de datos y código) a tu nombre.
- Una sesión de capacitación para ti y tu equipo.
- 30 días de garantía: cualquier falla del sistema se corrige sin costo.

Después pagas directo los servicios externos (unos $410 MXN al mes). Cambios o funciones nuevas: $350 MXN por hora, o una póliza opcional de soporte de $500 MXN al mes (hasta 2 horas de cambios).

## Opción B: mensualidad todo incluido

**$1,900 MXN al mes, sin pago inicial, con un plazo mínimo de 12 meses.** No te preocupas por nada técnico.

Incluye:

- Hospedaje en Vercel Pro, base de datos y fotos.
- El dominio (registrado a tu nombre).
- Corrección de cualquier falla, sin límite.
- Hasta 2 horas al mes de cambios (productos nuevos, ajustes al PDF o a la web, etc.).
- Respaldo mensual de tus datos.

El código y las cuentas técnicas quedan a mi nombre; **tus datos son tuyos** y te los entrego en Excel cuando los pidas. Al cumplir los 12 meses puedes comprar el sistema por $8,000 MXN y pasar a la Opción A.

## Comparativo

El primer año la Opción B cuesta menos; a partir del segundo año conviene la Opción A.

|  | Opción A: pago único | Opción B: mensualidad |
| --- | --- | --- |
| Pago inicial | $22,000 MXN | $0 |
| Costo mensual | Unos $410 MXN (servicios externos) | $1,900 MXN |
| Total al año 1 | Unos $26,900 MXN | $22,800 MXN |
| Total acumulado a 2 años | Unos $31,800 MXN | $45,600 MXN |
| Dueño del sistema | Tú | Yo, con opción de compra |
| Soporte y cambios | Por hora o póliza opcional | Incluidos (hasta 2 h al mes) |

En la Opción A el total no incluye cambios posteriores, que se cobran aparte.

## Condiciones y siguientes pasos

- Precios en pesos mexicanos; si requieres factura se agrega el IVA.
- Opción A: 50% de anticipo y 50% al entregar con el dominio funcionando.
- Opción B: la mensualidad se paga por adelantado los primeros 5 días de cada mes. Después del plazo mínimo se cancela con 30 días de aviso.
- Los costos de servicios externos pueden cambiar con el tipo de cambio.
- Esta cotización tiene vigencia de 30 días.

Para arrancar:

1. Elegir la opción A o B.
2. Confirmar el nombre del dominio (por ejemplo implegas.com.mx, sujeto a disponibilidad).
3. Borrar las cotizaciones de prueba y crear los usuarios definitivos.
4. Publicar en el dominio: unos 3 días hábiles después del anticipo o del primer pago.
