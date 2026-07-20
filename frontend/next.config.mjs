import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  turbopack: {
    // Correctly steps up to the monorepo root directory
    root: path.join(__dirname, '..'), 
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
