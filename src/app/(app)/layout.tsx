import Image from "next/image";
import Link from "next/link";
import { requireSesion } from "@/lib/auth";
import { cerrarSesion } from "../login/actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sesion = await requireSesion();
  const links = [
    { href: "/", label: "Cotizaciones" },
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
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/">
            <Image src="/brand/implegas.png" alt="ImpleGas" width={110} height={47} />
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-100">
                {l.label}
              </Link>
            ))}
          </nav>
          <form action={cerrarSesion} className="ml-auto flex items-center gap-3 text-sm text-gray-500">
            <span>{sesion.nombre}</span>
            <button className="btn">Salir</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
