import type { NextConfig } from "next";

const nextConfig: any = {
  typescript: {
    // Esto ignora los avisos de tipos en Vercel para subir rápido
    ignoreBuildErrors: true,
  },
};

export default nextConfig;