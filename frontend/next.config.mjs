/** @type {import('next').NextConfig} */
const nextConfig = {
 // output: "standalone",
  reactStrictMode: true,
  // Extends the compilation window if static parsing bottlenecks
  staticPageGenerationTimeout: 180, 

  images: {
    unoptimized: true
  }
};

export default nextConfig;
