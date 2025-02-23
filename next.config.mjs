import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    DB_FILE_NAME: process.env.DB_FILE_NAME,
  },
  experimental: {
    turbo: { minify: false },
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/dates",
      "@mantine/form",
      "@mantine/modals",
      "@mantine/notifications",
      "@mantine/nprogress",
    ],
  },
  sassOptions: {
    implementation: "sass-embedded",
    additionalData: `@use "${path
      .join(process.cwd(), "_mantine")
      .replaceAll("\\", "/")}" as mantine;`,
  },
  webpack: (config) => {
    config.externals.push("bun:sqlite");
    config.module.rules.push({
      test: /\.node/,
      use: "node-loader",
    });

    return config;
  },
};

export default nextConfig;
