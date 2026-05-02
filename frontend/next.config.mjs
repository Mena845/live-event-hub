/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "combo.staticflickr.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // En dev, proxifie /api/* vers le backend Express (port 4000)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
