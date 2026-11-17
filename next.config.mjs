/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  experimental: {
    serverActions: {
      bodySizeLimit: "8gb",
    },
  },
  images: {
    loader: "custom",
    loaderFile: "./my-loader.ts",
  },
};

export default nextConfig;
