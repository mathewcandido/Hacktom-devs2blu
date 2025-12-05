/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me', 'images.unsplash.com'],
  },
  // Standalone output para otimizar Docker
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: __dirname,
  },
  // Ensure public assets are copied in standalone mode
  async generateBuildId() {
    return 'build-' + new Date().getTime()
  }
}

module.exports = nextConfig