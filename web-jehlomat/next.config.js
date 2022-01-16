const withImages = require("next-images")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withImages(nextConfig)
