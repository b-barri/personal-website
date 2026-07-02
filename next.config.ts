import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: lets phones on the same Wi-Fi load the dev server via the
  // laptop's LAN IP (Next 16 blocks cross-origin dev assets by default).
  allowedDevOrigins: ["192.168.1.*"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
