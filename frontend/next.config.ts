import type { NextConfig } from "next";

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
        pathname: "/upload/images/**",
      },
    ],
  },


  // images: {
  //   domains: ["localhost:5000"],
  // },
};

export default nextConfig;
