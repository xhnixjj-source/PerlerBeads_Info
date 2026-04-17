/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/admin-auth", destination: "/admin/login", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
