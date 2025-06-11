import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@neondatabase/serverless'],
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`,
  },
  images: {
    domains: ['localhost'],
  },
  // Optimize for Vercel
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
