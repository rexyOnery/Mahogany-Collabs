/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  turbopack: {
    root: '.'
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
