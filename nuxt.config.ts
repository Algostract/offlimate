const host = process.env.TAURI_DEV_HOST || 'localhost'
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

const nativeConfig =
  process.env.PLATFORM_ENV === 'native'
    ? {
        ssr: false,
        devServer: { host },
        ignore: ['**/src-tauri/**', '**/node_modules/**', '**/dist/**', '**/.git/**', '**/.nuxt/**', '**/.output/**'],
        vite: {
          clearScreen: false,
          envPrefix: ['VITE_', 'TAURI_'],
          server: {
            strictPort: true,
            port,
            host: host || false,
            hmr: host
              ? {
                  protocol: 'ws',
                  host,
                  port,
                }
              : undefined,
          },
        },
        nitro: {
          prerender: {
            routes: [],
          },
        },
      }
    : {}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils/module',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@regle/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],
  nitro: {
    compressPublicAssets: true,
  },
  routeRules: {
    '/': { ssr: true },
    '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/api/**': { cors: true },
  },
  runtimeConfig: {
    app: {
      version: '',
      buildTime: '',
    },
    public: {
      siteUrl: '',
      scripts: {
        googleAnalytics: {
          id: '',
        },
      },
      vapidKey: '',
    },
    private: {
      notionDbId: '',
      vapidKey: '',
      paymentUpiInfo: '',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  icon: {
    componentName: 'NuxtIcon',
    provider: 'none',
    mode: 'svg',
    customCollections: [
      {
        prefix: 'local',
        dir: './app/assets/icons',
      },
    ],
    clientBundle: {
      scan: true,
    },
  },
  image: {},
  scripts: {
    registry: {
      googleAnalytics: true,
    },
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
  site: {
    name: 'Offlimate',
    url: process.env.NUXT_PUBLIC_SITE_URL,
  },
  sitemap: {
    autoLastmod: true,
    sources: ['/api/__sitemap__/urls'],
  },
  robots: {
    disallow: ['/_nuxt/'],
  },
  pwa: {
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    includeManifestIcons: false,
    manifest: {
      name: 'Offlimate',
      short_name: 'Offlimate',
      description: 'Offline Meetup Event Booking Platform',
      theme_color: '#FF8204',
      background_color: '#FF8204',
      orientation: 'any',
      display: 'fullscreen',
      icons: [
        {
          src: '/pwa/icon-48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-maskable-48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      screenshots: [
        {
          src: '/pwa/screenshot-desktop-1.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 1',
        },
        {
          src: '/pwa/screenshot-desktop-2.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 2',
        },
        {
          src: '/pwa/screenshot-desktop-3.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 3',
        },
        {
          src: '/pwa/screenshot-mobile-1.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 1',
        },
        {
          src: '/pwa/screenshot-mobile-2.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 2',
        },
        {
          src: '/pwa/screenshot-mobile-3.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 3',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{html,css,js,jpg,jpeg,png,svg,webp,ico,mp3,wav,ogg,mp4,webm,mov,m4a,aac}'],
      runtimeCaching: [
        {
          urlPattern: /\.(?:html|js|css)$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'dynamic-assets',
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|webp|ico|mp3|wav|ogg|mp4|webm|mov|m4a|aac)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-assets',
            expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
          },
        },
      ],
      navigateFallback: '/',
      cleanupOutdatedCaches: true,
      importScripts: ['/sw-push.js'],
      maximumFileSizeToCacheInBytes: 3000000,
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
  },
  ...nativeConfig,
})
