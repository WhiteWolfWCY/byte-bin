/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "agile-iguana-270.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
