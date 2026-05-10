import type { NextConfig } from "next";

const nextConfig = {
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} as NextConfig; // <--- Το βάζουμε εδώ στο τέλος

export default nextConfig;
