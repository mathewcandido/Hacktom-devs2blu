/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me', 'images.unsplash.com'],
  },
  // Standalone output para otimizar Docker
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: __dirname,
  }
}

module.exports = nextConfig