import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    serverActions: { bodySizeLimit: "4mb" },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // Incluye los logos e imágenes de /public en las funciones que generan el PDF en Vercel.
  outputFileTracingIncludes: {
    "/api/cotizaciones/[id]/pdf": ["./public/brand/**", "./public/seed/**"],
    "/c/[token]": ["./public/brand/**", "./public/seed/**"],
  },
};

export default nextConfig;
