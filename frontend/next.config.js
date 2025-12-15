/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'fibo-orchestra.onrender.com'],
  },
  // Force cache invalidation
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
}

module.exports = nextConfig
