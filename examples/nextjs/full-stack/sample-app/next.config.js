/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@rudderstack/rudder-sdk-node'],
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
