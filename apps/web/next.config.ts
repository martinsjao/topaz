import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	// Avisa o Turbopack que a raiz do monorepo está duas pastas para trás
	turbopack: {
		root: path.join(__dirname, "../.."),
	},
};

export default nextConfig;
