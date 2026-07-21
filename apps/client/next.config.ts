import type { NextConfig } from "next";

const workspaceRoot =
  process.env.NEXT_WORKSPACE_ROOT ?? process.cwd() + "/../..";

const isProduction = process.env.NODE_ENV === "production";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none';",
  },
];

if (isProduction) {
  securityHeaders.unshift({
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  });
}

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: workspaceRoot,
  turbopack: {
    root: workspaceRoot,
    resolveAlias: {
      "@thuematbang/contracts": "../../packages/contracts/dist/index.js",
    },
  },
  transpilePackages: ["@thuematbang/contracts"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  experimental: {
    serverActions: {
      // Image uploads now bypass Server Actions, so keep the body guard tight.
      bodySizeLimit: "2mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
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
