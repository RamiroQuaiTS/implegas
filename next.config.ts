import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // Incluye en las funciones del PDF los logos de /public y las fuentes de pdfkit, que se cargan dinámicamente.
  outputFileTracingIncludes: {
    "/api/cotizaciones/[id]/pdf": ["./public/brand/**", "./public/seed/**", "./node_modules/pdfkit/js/**"],
    "/c/[token]": ["./public/brand/**", "./public/seed/**", "./node_modules/pdfkit/js/**"],
  },
};

export default nextConfig;
