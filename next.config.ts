import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/focus-room",
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
