import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bundleAnalyzer from '@next/bundle-analyzer'

const __dirname = dirname(fileURLToPath(import.meta.url))


const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  transpilePackages: ['next-roots'],
  turbopack: {
    root: path.resolve(__dirname, '.'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
})

export default nextConfig
