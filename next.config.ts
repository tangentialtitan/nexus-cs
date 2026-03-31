import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'improved-potato-jj65p7g75jjq35rqj-3000.app.github.dev',
        'localhost:3000',
      ],
    },
  },
}

export default nextConfig