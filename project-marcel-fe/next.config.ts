import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '167.71.60.209',
      },
      {
        protocol: 'http',
        hostname: '44.201.166.164',
      },
      {
        protocol: 'https',
        hostname: '44.201.166.164',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
      {
        protocol: 'http',
        hostname: 'media.licdn.com',
      },
      {
        protocol: 'https',
        hostname: 'i3.ytimg.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'backend',
      },
      {
        protocol: 'http',
        hostname: '172.*',
      },
    ],
  },
};

export default nextConfig;
