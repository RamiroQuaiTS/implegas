# ImpleGas · Cotizador

App web para crear cotizaciones en PDF (con el mismo formato de las cotizaciones de ImpleGas) a partir de un catálogo de productos, y compartirlas por WhatsApp o correo.

- **Login** con usuarios admin y vendedor.
- **Bases de cotización** (gas, paneles solares, calentador solar, paneles WPC, A/C, ósmosis…): al elegir una, se precargan los productos más comunes y la mano de obra, y todo se puede editar.
- **Catálogos**: productos (con imagen y especificaciones), clientes (con imagen), bases, datos de la empresa y usuarios, configurables desde el panel de admin.
- **PDF** tamaño carta, igual al formato actual, con enlace público para mandarlo al cliente.

## Correr en tu computadora

```bash
npm install
npm run dev
```

Abre http://localhost:3000 y entra con `admin@implegas.mx` / `admin123` (solo en local; cámbiala en Admin › Usuarios).
En local los datos se guardan en `data/db.json` y las imágenes en `data/uploads/` (esa carpeta no se sube a git).

## Publicar en Vercel

1. En [vercel.com/new](https://vercel.com/new) importa el repositorio `RamiroQuaiTS/implegas` (framework: Next.js, sin cambiar nada más).
2. Antes de desplegar, en **Environment Variables** agrega:
   - `AUTH_SECRET`: una cadena larga al azar (por ejemplo, la salida de `openssl rand -base64 32`).
   - `ADMIN_EMAIL`: el correo del administrador.
   - `ADMIN_PASSWORD`: la contraseña inicial del administrador.
3. Despliega. Después, en el proyecto de Vercel ve a **Storage** y:
   - **Upstash for Redis** (Marketplace, plan gratis) › Create › conéctalo al proyecto. Esto agrega `KV_REST_API_URL` y `KV_REST_API_TOKEN`.
   - **Blob** › Create › conéctalo al proyecto. Esto agrega `BLOB_READ_WRITE_TOKEN`.
4. Vuelve a desplegar (Deployments › ⋯ › Redeploy) para que tome las variables nuevas.

La primera vez que alguien abre la app se crea la base con el catálogo inicial y el usuario admin.

## Cómo se guardan los datos

Toda la información (empresa, usuarios, productos, clientes, bases y cotizaciones) es un solo documento JSON (`src/lib/types.ts`).
En Vercel vive en Upstash Redis y las imágenes en Vercel Blob; en local, en `data/`. El catálogo inicial está en `src/lib/seed.ts`.
Si más adelante se necesita algo más robusto (muchos usuarios a la vez, reportes), se puede migrar a Postgres/Supabase cambiando solo `src/lib/db.ts`.
