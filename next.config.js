const { env } = require("./src/server/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'cdn.discordapp.com',
      'instagram.fphx1-1.fna.fbcdn.net',
      'instagram.fphx1-2.fna.fbcdn.net',
    ],
  },
};

module.exports = nextConfig;
