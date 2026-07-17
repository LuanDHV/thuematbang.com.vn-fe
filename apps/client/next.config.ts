import type { NextConfig } from "next";

const workspaceRoot =
  process.env.NEXT_WORKSPACE_ROOT ?? process.cwd() + "/../..";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
  },
  transpilePackages: ["@thuematbang/contracts"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  experimental: {
    serverActions: {
      // Image uploads now bypass Server Actions, so keep the body guard tight.
      bodySizeLimit: "2mb",
    },
  },
  images: {
    qualities: [75, 80, 85, 90],
    // Allow Next.js Image component to optimize images from Cloudinary
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
    ],
  },
};

export default nextConfig;
