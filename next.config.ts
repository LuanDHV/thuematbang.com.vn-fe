import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Give server actions enough headroom for a 2MB file plus multipart overhead.
      bodySizeLimit: "3mb",
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
        hostname: "ui-avatars.com",
      },
    ],
  },
};

export default nextConfig;
