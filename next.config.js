/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverActions: true,
  // },
  experimental: {
    typedRoutes: true,
  },
  // compiler: {
  //   removeConsole: true,
  // },
};

module.exports = nextConfig;
