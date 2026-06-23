import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Activar tipado estricto de rutas de Next.js
  experimental: {
    typedRoutes: true,
  },

  // Headers de seguridad globales
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // Excluir rutas de API del bundle cliente
  serverExternalPackages: ["@prisma/client", "bcryptjs"],

  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ofigest.app",
      },
    ],
  },

  // Variables de entorno públicas (accesibles en el cliente)
  env: {
    NEXT_PUBLIC_APP_NAME: "OfiGest",
    NEXT_PUBLIC_APP_VERSION: "0.1.0",
  },
};

export default nextConfig;
