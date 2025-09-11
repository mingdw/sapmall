/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 standalone 输出以优化 Docker 构建
  output: 'standalone',
  // 启用压缩
  compress: true,
  // 优化图片
  images: {
    domains: ['localhost', 'api.sapphiremall.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 优化打包 - 简化配置以减少内存使用
  experimental: {
    // 暂时禁用 optimizeCss 以减少内存消耗
    // optimizeCss: true,
    optimizePackageImports: ['antd', 'lucide-react', '@ant-design/icons'],
    // 启用 SWC 压缩
    swcMinify: true,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Sapphire Mall',
    NEXT_PUBLIC_APP_VERSION: '0.1.0',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer, dev }) => {
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
    
    // 简化 webpack 配置以减少内存使用
    // 禁用复杂的代码分割和缓存策略
    if (dev) {
      config.cache = false;
    }
    
    return config;
  },
};

module.exports = nextConfig; 