import type { NextConfig } from "next";
const apiHost = process.env.HOST_API || "http://localhost:5000";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // images config
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "booking-api.webnextapp.com",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow localhost in development
    //unoptimized: process.env.NODE_ENV === "development" ? false : false,
    minimumCacheTTL: 60,
    // This allows private IPs like localhost
    dangerouslyAllowLocalIP: true,
  },

  // images: {
  //   domains: ["localhost:5000"],
  // },
};

export default nextConfig;
