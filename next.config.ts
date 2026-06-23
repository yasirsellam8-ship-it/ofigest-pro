import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Esto apaga el inspector de código estricto en Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Esto ignora los avisos de tipos en Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;