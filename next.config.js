/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'via.placeholder.com', 
      'randomuser.me', 
      'source.unsplash.com', 
      'images.unsplash.com',
      'unsplash.com',
      'picsum.photos',
      'loremflickr.com',
      'placekitten.com'
    ],
    unoptimized: true,
  },
}

module.exports = nextConfig 