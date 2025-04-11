/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
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
