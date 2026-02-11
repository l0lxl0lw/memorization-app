import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/memorization-app",
  images: { unoptimized: true },
};

export default nextConfig;
