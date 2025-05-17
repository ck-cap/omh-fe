import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss' // Default configuration usually works well for v3
  ],
  css: ['@/assets/css/tailwind.css'], // Ensure our main CSS is loaded
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        }
      ],
    }
  },
  components: [
    {
      path: '~/components',
      // By default, Nuxt scans subdirectories. 
      // We want to ignore index.ts files within this scanned path.
      ignore: [
        '**/index.ts', // Ignores any index.ts file in any subdirectory of '~/components'
      ],
      pathPrefix: false, // Optional: set to false if you don't want prefixes like `Ui` for components in subfolders of `ui`
      // prefix: '' // Optional: if you want no prefix for any component from ~/components
    }
  ]
}) 