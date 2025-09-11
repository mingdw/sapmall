/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 standalone 输出以优化 Docker 构建
  output: 'standalone',
  // 启用压缩
  compress: true,
  // 简化图片配置
  images: {
    domains: ['localhost', 'api.sapphiremall.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 最小化实验性功能以减少内存使用
  experimental: {
    swcMinify: true,
  },
  // 禁用 TypeScript 类型检查以减少内存使用
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 ESLint 检查以减少内存使用
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Sapphire Mall',
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
  },
  // 简化的 webpack 配置
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
    }
    
    // 禁用缓存以减少内存使用
    config.cache = false;
    
    return config;
  },
};

module.exports = nextConfig;
