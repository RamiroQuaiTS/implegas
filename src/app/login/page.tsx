"use client";

import Image from "next/image";
import { useActionState } from "react";
import { iniciarSesion } from "./actions";

export default function LoginPage() {
  const [error, accion, enviando] = useActionState(iniciarSesion, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form action={accion} className="w-full max-w-sm bg-white rounded-xl shadow p-8 space-y-5">
        <div className="flex justify-center">
          <Image src="/brand/implegas.png" alt="ImpleGas" width={200} height={85} priority />
        </div>
        <h1 className="text-center text-lg font-semibold text-gray-700">Cotizador</h1>
        <label className="block">
          <span className="label">Correo</span>
          <input name="email" type="email" required autoComplete="username" className="input" />
        </label>
        <label className="block">
          <span className="label">Contraseña</span>
          <input name="password" type="password" required autoComplete="current-password" className="input" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={enviando} className="btn-primary w-full">
          {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
