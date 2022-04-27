/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  standalone: true,
  env: {
    CHAIN_ID: process.env.CHAIN_ID,
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ["raw.githubusercontent.com"],
  },
};

module.exports = nextConfig;
