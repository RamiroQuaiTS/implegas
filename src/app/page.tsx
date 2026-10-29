/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { CatalogoWeb } from "@/components/web/CatalogoWeb";
import { ContactoWhatsApp } from "@/components/web/ContactoWhatsApp";
import { FOTO_PORTADA, SERVICIOS, VALORES, enlaceWhatsApp } from "@/components/web/datos";
import { getDb } from "@/lib/db";

// La página se regenera cada 5 minutos para reflejar los cambios del catálogo sin consultar la base en cada visita.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "ImpleGas · Gas, calentadores solares y energía renovable en León",
  description:
    "Más de 40 años en instalaciones de gas LP y natural. Calentadores solares, paneles fotovoltaicos, aire acondicionado y más en León, Guanajuato.",
};

const DEGRADADO = "bg-gradient-to-br from-[#00B050] to-[#92D050]";

const MENU = [
  { href: "#nosotros", label: "Nosotros" },
  { href: "#servicios", label: "Servicios" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#contacto", label: "Contacto" },
];

export default async function Inicio() {
  const db = await getDb();
  const productos = db.productos
    .filter((p) => p.activo)
    .sort((a, b) => a.categoria.localeCompare(b.categoria) || a.nombre.localeCompare(b.nombre))
    .map(({ id, nombre, categoria, imagenUrl }) => ({ id, nombre, categoria, imagenUrl }));
  const { direccion, telefono } = db.empresa;
  const mapa = `https://www.google.com/maps?q=${encodeURIComponent(`${direccion}, León, Guanajuato`)}&output=embed`;
  const waGeneral = enlaceWhatsApp("Hola Luis Adolfo, me gustaría solicitar una cotización.");

  return (
    <div className="bg-white text-gray-800">
      {/* Encabezado */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-2">
          <a href="#inicio">
            <img src="/web/implegas-logo.png" alt="ImpleGas · Energía renovable" className="h-10 w-auto md:h-12" />
          </a>
          <nav className="ml-auto hidden gap-6 text-sm font-medium text-gray-600 md:flex">
            {MENU.map((m) => (
              <a key={m.href} href={m.href} className="hover:text-brand">
                {m.label}
              </a>
            ))}
          </nav>
          <a
            href={waGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark md:ml-0"
          >
            Cotizar
          </a>
        </div>
        <nav className="flex justify-around border-t border-gray-100 py-2 text-xs font-medium text-gray-600 md:hidden">
          {MENU.map((m) => (
            <a key={m.href} href={m.href}>
              {m.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Portada */}
      <section id="inicio" className="relative isolate overflow-hidden">
        <img src={FOTO_PORTADA} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1f2a22]/90 via-[#1f2a22]/70 to-[#00B050]/30" />
        <div className="mx-auto max-w-6xl px-4 py-24 md:py-36">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#92D050]">Energía renovable</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight text-white md:text-6xl">
            Más de 40 años instalando confianza
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Instalaciones de gas LP y natural, calentadores solares, paneles fotovoltaicos y más en León, Guanajuato.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-brand px-7 py-3 font-semibold text-white shadow-lg hover:bg-brand-dark"
            >
              Cotiza por WhatsApp
            </a>
            <a href="#servicios" className="rounded-full border border-white/70 px-7 py-3 font-semibold text-white hover:bg-white/10">
              Ver servicios
            </a>
          </div>
          <div className="mt-12 grid max-w-lg grid-cols-2 gap-6 text-white">
            <div>
              <div className="text-4xl font-bold">+40</div>
              <div className="text-sm text-white/75">años en instalaciones de gas</div>
            </div>
            <div>
              <div className="text-4xl font-bold">+10</div>
              <div className="text-sm text-white/75">años en energía solar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold">¿Quiénes somos?</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              <b>Implementos para Gas</b> es una empresa con más de 40 años en servicio de instalaciones de gas LP y gas
              natural, y 10 años en calentadores solares y paneles fotovoltaicos.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Nuestro desafío es brindar seguridad, tranquilidad, responsabilidad y excelencia en el servicio, porque la
              satisfacción del cliente es nuestra razón de ser.
            </p>
          </div>
          <div className={`rounded-2xl ${DEGRADADO} p-8 text-white shadow-lg`}>
            <h3 className="text-xl font-bold">Misión</h3>
            <p className="mt-3 leading-relaxed text-white/90">
              Contribuir con la preservación del medio ambiente manteniendo la mayor calidad, buscando siempre soluciones y
              entregando todo nuestro esfuerzo a la calidad y confiabilidad del producto final, con responsabilidad y rapidez.
            </p>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {VALORES.map((v) => (
            <div key={v.texto} className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm">
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${DEGRADADO} shadow-md`}>
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {v.trazos.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </div>
              <div className="mt-3 text-sm font-semibold text-gray-700">{v.texto}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="scroll-mt-24 bg-[#2F3430] py-20 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">Nuestros trabajos</h2>
          <p className="mt-2 text-white/70">Suministro, instalación y mantenimiento con garantía.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICIOS.map((s) => (
              <div key={s.titulo} className="flex flex-col overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
                <img src={s.foto} alt={s.titulo} loading="lazy" className="h-40 w-full object-cover" />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-bold text-[#92D050]">{s.titulo}</h3>
                  <p className="mt-2 flex-1 text-sm text-white/75">{s.texto}</p>
                  <a
                    href={enlaceWhatsApp(`Hola Luis Adolfo, me interesa cotizar: ${s.titulo}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-sm font-semibold text-white hover:text-[#92D050]"
                  >
                    Cotizar →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="scroll-mt-24 bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold">Catálogo</h2>
          <p className="mt-2 mb-8 text-gray-600">Elige un producto y te enviamos tu cotización sin compromiso.</p>
          <CatalogoWeb productos={productos} />
        </div>
      </section>

      {/* Contacto con Luis Adolfo */}
      <section id="contacto" className={`scroll-mt-24 ${DEGRADADO} py-20 text-white`}>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Escríbele a Luis Adolfo</h2>
            <p className="mt-3 text-white/90">
              Platica directamente con el dueño, <b>Ing. Luis Adolfo Ornelas Torres</b>. Te responde por WhatsApp con tu
              cotización.
            </p>
            <a
              href={waGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/15 px-5 py-3 font-semibold ring-1 ring-white/40 hover:bg-white/25"
            >
              <img src="/brand/whatsapp.png" alt="" className="h-6 w-6" />
              +52 1 477 326 4648
            </a>
          </div>
          <div className="rounded-2xl bg-[#1f2a22]/30 p-6 ring-1 ring-white/20">
            <ContactoWhatsApp />
          </div>
        </div>
      </section>

      {/* Ubicación */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold">¿Dónde estamos?</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_2fr]">
          <div className="space-y-4 text-gray-600">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand">Ubicación</div>
              <p className="mt-1">{direccion}</p>
              <p>León, Guanajuato</p>
            </div>
            {telefono && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-brand">Teléfono</div>
                <a href={`tel:${telefono}`} className="mt-1 block hover:text-brand">
                  {telefono}
                </a>
              </div>
            )}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand">Gerente general</div>
              <p className="mt-1">Luis Adolfo Ornelas Torres</p>
            </div>
          </div>
          <iframe
            src={mapa}
            title="Mapa de ubicación de ImpleGas"
            loading="lazy"
            className="h-80 w-full rounded-xl border-0 shadow"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* Pie */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-4 py-8 text-sm text-gray-500">
          <img src="/web/implegas-logo.png" alt="ImpleGas" className="h-10 w-auto" />
          <img src="/web/prana.png" alt="PRANA" className="h-14 w-auto" />
          <p className="flex-1 min-w-48">© {new Date().getFullYear()} Implementos para Gas · León, Guanajuato</p>
          <Link href="/login" className="text-xs text-gray-400 hover:text-gray-600">
            Acceso
          </Link>
        </div>
      </footer>

      {/* Botón flotante de WhatsApp */}
      <a
        href={waGeneral}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl hover:scale-105 transition"
      >
        <img src="/brand/whatsapp.png" alt="" className="h-9 w-9" />
      </a>
    </div>
  );
}
