/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Exclude API routes from build (since backend will be developed separately)
  pageExtensions: ['page.tsx', 'page.ts', 'tsx', 'ts'].filter(ext => {
    // Skip API routes during build
    return !ext.includes('api');
  }),

  // Webpack configuration for bioinformatics libraries
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle .node files for native modules
    config.module.rules.push({
      test: /\.node$/,
      use: 'raw-loader',
    });

    // Optimize bundle for large genomic data processing
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Separate vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Separate bioinformatics algorithms
          algorithms: {
            test: /[\\/]lib[\\/]algorithms[\\/]/,
            name: 'algorithms',
            chunks: 'all',
            priority: 20,
          },
          // Separate data processing utilities
          utils: {
            test: /[\\/]lib[\\/]utils[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 15,
          },
        },
      },
    };

    // Add fallbacks for Node.js modules in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      buffer: false,
    };

    // Exclude API directory from compilation
    config.module.rules.push({
      test: /app\/api\/.*\.(ts|tsx|js|jsx)$/,
      use: 'ignore-loader',
    });

    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // CORS headers for API routes
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? '*' : 'https://snpify.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          // API-specific headers
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          },
          {
            key: 'Content-Type',
            value: 'application/json'
          },
        ],
      },
      {
        source: '/public/:path*',
        headers: [
          // Static assets caching
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/analyze',
        destination: '/analysis',
        permanent: true,
      },
    ];
  },

  // Rewrites for API versioning
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Build-time configuration
  generateBuildId: async () => {
    // Generate unique build ID for deployment tracking
    return `snpify-${Date.now()}`;
  },

  // Output configuration
  output: 'standalone',

  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // Trailing slash configuration
  trailingSlash: false,

  // React Strict Mode
  reactStrictMode: true,

  // Modularize imports for better tree shaking
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
};

module.exports = nextConfig;
