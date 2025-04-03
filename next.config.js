const { resolve } = require("path");


/** @type {import("next").NextConfig} */
const nextConfig = {
    output : "standalone",
    reactStrictMode: false,
    webpack: (config) => {
        config.resolve.alias["@"] = resolve(__dirname, "/src/app");
        return config;
    },
    async headers() {
        return [
            {
                source : "/:path*",
                headers: [
                    {
                        key  : "Strict-Transport-Security",
                        value: "max-age=53072000; includeSubDomains; preload"
                    }
                ]
            }
        ];
    }
};

module.exports = nextConfig;
