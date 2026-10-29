import Image from "next/image";
import Link from "next/link";
import { requireSesion } from "@/lib/auth";
import { cerrarSesion } from "../login/actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sesion = await requireSesion();
  const links = [
    { href: "/cotizador", label: "Cotizaciones" },
    { href: "/clientes", label: "Clientes" },
    ...(sesion.rol === "admin"
      ? [
          { href: "/admin/productos", label: "Productos" },
          { href: "/admin/bases", label: "Bases" },
          { href: "/admin/empresa", label: "Empresa" },
          { href: "/admin/usuarios", label: "Usuarios" },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200">
        {/* En celular: logo y salir arriba, menú en una sola línea deslizable debajo. */}
        <div className="mx-auto max-w-6xl px-4 py-2 md:py-3 flex flex-wrap items-center gap-x-6 gap-y-1">
          <Link href="/cotizador">
            <Image src="/brand/implegas.png" alt="ImpleGas" width={110} height={47} className="w-20 md:w-[110px] h-auto" />
          </Link>
          <form action={cerrarSesion} className="ml-auto md:order-last flex items-center gap-3 text-sm text-gray-500">
            <span className="hidden sm:inline">{sesion.nombre}</span>
            <button className="btn px-3 py-1.5">Salir</button>
          </form>
          <nav className="-mx-4 px-4 md:mx-0 md:px-0 w-full md:w-auto flex gap-1 text-sm overflow-x-auto whitespace-nowrap">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-100">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-4 md:py-6">{children}</main>
    </div>
  );
}
