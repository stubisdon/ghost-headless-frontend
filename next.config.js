/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['catsky.club'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'catsky.club',
      },
    ],
  },
}

module.exports = nextConfig

