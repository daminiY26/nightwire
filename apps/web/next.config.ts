import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@nightwire/ui", "@nightwire/types", "@nightwire/config"],
};

export default nextConfig;
