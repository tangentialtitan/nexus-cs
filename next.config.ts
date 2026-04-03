import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'https://nexus-cse.vercel.app',
        'localhost:3000',
      ],
    },
  },
}

export default nextConfig