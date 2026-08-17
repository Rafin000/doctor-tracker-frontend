import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Emit a minimal standalone server for a small Docker runtime image.
  output: 'standalone',
  // Transpile the chart libs so Next's package-import optimizer doesn't try to
  // barrel-optimize recharts' re-exports (which breaks @mantine/charts).
  transpilePackages: ['recharts', '@mantine/charts'],
}

export default nextConfig
