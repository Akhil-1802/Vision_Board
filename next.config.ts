// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // any domain
      },
      {
        protocol: "http",
        hostname: "**", // optionally include http sources
      },
    ],
  },
};

export default nextConfig;
