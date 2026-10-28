"use client";

import { useEffect, useState } from "react";
import type { ClienteCotizacion } from "@/lib/types";

interface Props {
  pdfUrl: string;
  sharePath: string;
  archivo: string;
  cliente: ClienteCotizacion;
  folio: number;
  titulo: string;
}

/** Celular a formato internacional para wa.me (México por defecto). */
function telefonoWa(cel: string): string {
  const d = cel.replace(/\D/g, "");
  if (d.length === 10) return "52" + d;
  return d;
}

export function Compartir({ pdfUrl, sharePath, archivo, cliente, folio, titulo }: Props) {
  const [link, setLink] = useState(sharePath);
  const [puedeCompartirArchivo, setPuedeCompartirArchivo] = useState(false);
  const [estado, setEstado] = useState<string | null>(null);

  useEffect(() => {
    setLink(window.location.origin + sharePath);
    const prueba = new File([new Blob()], "x.pdf", { type: "application/pdf" });
    setPuedeCompartirArchivo(typeof navigator.canShare === "function" && navigator.canShare({ files: [prueba] }));
  }, [sharePath]);

  const folioTxt = String(folio).padStart(4, "0");
  const mensaje = `Hola ${cliente.nombre}, le comparto la cotización ${folioTxt}${titulo ? ` de ${titulo.toLowerCase()}` : ""} de ImpleGas:\n${link}`;
  const wa = `https://wa.me/${telefonoWa(cliente.cel)}?text=${encodeURIComponent(mensaje)}`;
  const mail = `mailto:${cliente.email.toLowerCase()}?subject=${encodeURIComponent(`Cotización ${folioTxt} ImpleGas`)}&body=${encodeURIComponent(mensaje)}`;

  async function compartirArchivo() {
    setEstado("Preparando PDF…");
    try {
      const blob = await (await fetch(pdfUrl)).blob();
      const file = new File([blob], archivo, { type: "application/pdf" });
      await navigator.share({ files: [file], title: archivo, text: mensaje });
      setEstado(null);
    } catch (e) {
      setEstado(e instanceof DOMException && e.name === "AbortError" ? null : "No se pudo compartir el archivo.");
    }
  }

  async function copiar() {
    await navigator.clipboard.writeText(link);
    setEstado("Enlace copiado.");
    setTimeout(() => setEstado(null), 2000);
  }

  return (
    <div className="card flex flex-wrap items-center gap-2">
      <a href={`${pdfUrl}&descargar=1`} className="btn-primary">
        ⬇ Descargar PDF
      </a>
      {puedeCompartirArchivo && (
        <button onClick={compartirArchivo} className="btn">
          📎 Compartir PDF (WhatsApp, correo…)
        </button>
      )}
      <a href={wa} target="_blank" rel="noopener noreferrer" className="btn">
        <span className="text-green-600">●</span> WhatsApp{cliente.cel ? "" : " (sin número)"}
      </a>
      <a href={mail} className="btn">
        ✉ Correo{cliente.email ? "" : " (sin correo)"}
      </a>
      <button onClick={copiar} className="btn">
        🔗 Copiar enlace
      </button>
      {estado && <span className="text-sm text-gray-500">{estado}</span>}
      <p className="basis-full text-xs text-gray-500">
        WhatsApp y Correo envían un enlace al PDF. En el celular, “Compartir PDF” adjunta el archivo directamente.
      </p>
    </div>
  );
}
