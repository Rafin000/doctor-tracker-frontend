import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Emit a minimal standalone server for a small Docker runtime image.
  output: 'standalone',
}

export default nextConfig
