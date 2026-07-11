import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve admin and content dirs from public (handled automatically)
  async rewrites() {
    return [
      // Admin panel
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
      {
        source: "/admin/:path*",
        destination: "/admin/:path*",
      },
    ];
  },
};

export default nextConfig;
