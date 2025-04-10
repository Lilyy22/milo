/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drgalen.org",
        port: "", // Leave empty for standard HTTPS
        pathname: "/**", // Allow all paths under the domain
      },
    ],
  },
};

module.exports = nextConfig;
