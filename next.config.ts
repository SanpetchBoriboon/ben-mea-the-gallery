import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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

export default nextConfig;
