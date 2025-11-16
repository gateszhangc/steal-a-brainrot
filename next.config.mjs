import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // 完全禁用所有校验
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 禁用所有警告
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'steal-brainrot.io'
      },
      {
        protocol: 'https',
        hostname: 'stealabrainrot.quest'
      }
    ]
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './')
    };
    // 禁用所有警告
    config.stats = 'errors-only';
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  }
};

export default nextConfig;
