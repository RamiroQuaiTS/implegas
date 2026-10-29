"use client";

import { useState } from "react";
import { SERVICIOS, enlaceWhatsApp } from "./datos";

/** Formulario que arma el mensaje y abre WhatsApp con Luis Adolfo. */
export function ContactoWhatsApp() {
  const [nombre, setNombre] = useState("");
  const [servicio, setServicio] = useState("");
  const [mensaje, setMensaje] = useState("");

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const texto = [
      `Hola Luis Adolfo, soy ${nombre.trim()}.`,
      servicio && `Me interesa: ${servicio}.`,
      mensaje.trim(),
    ]
      .filter(Boolean)
      .join("\n");
    window.open(enlaceWhatsApp(texto), "_blank", "noopener,noreferrer");
  }

  const campo =
    "w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 focus:border-white focus:outline-none";

  return (
    <form onSubmit={enviar} className="space-y-3">
      <input required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" className={campo} />
      <select value={servicio} onChange={(e) => setServicio(e.target.value)} className={`${campo} [&>option]:text-gray-900`}>
        <option value="">¿Qué servicio te interesa?</option>
        {SERVICIOS.map((s) => (
          <option key={s.titulo}>{s.titulo}</option>
        ))}
        <option>Otro</option>
      </select>
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        rows={4}
        placeholder="Cuéntanos qué necesitas (opcional)"
        className={campo}
      />
      <button className="w-full rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-dark hover:bg-green-50">
        Enviar por WhatsApp
      </button>
    </form>
  );
}
