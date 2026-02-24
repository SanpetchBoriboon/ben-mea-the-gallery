/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/wedding-day-5a5a1.firebasestorage.app/**',
      },
    ],
  },
};

module.exports = nextConfig;
