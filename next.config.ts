import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled cacheComponents due to incompatibility with dynamic data fetching during build
  // cacheComponents: true,
};

export default nextConfig;
