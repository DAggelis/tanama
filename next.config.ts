/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // @ts-ignore
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-ignore
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
