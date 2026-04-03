import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'https://nexus-cs-psi.vercel.app',
      ],
    },
  },
}

export default nextConfig