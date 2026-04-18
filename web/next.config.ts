import type { NextConfig } from "next";

const isStatic = process.env.IS_STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  output: isStatic ? 'export' : undefined,
  images: {
    unoptimized: isStatic,
  },
};

export default nextConfig;
