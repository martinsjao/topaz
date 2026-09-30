import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["db"],
  serverExternalPackages: ["postgres"],
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
