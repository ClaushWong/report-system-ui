/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withLess = require("next-with-less");

const nextConfig = {
    reactStrictMode: true,
    swcMinify: false,
    serverRuntimeConfig: {
        NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
        NEXT_PUBLIC_API_TIMEOUT_MS: process.env.NEXT_PUBLIC_API_TIMEOUT_MS,
    },
    future: { webpack5: true },
};

module.exports = withPlugins(
    [
        withLess({
            lessLoaderOptions: {
                lessOptions: {
                    javascriptEnabled: true,
                    localIdentName: "[path]___[local]___[hash:base64:5]",
                },
            },
        }),
    ],
    nextConfig
);
