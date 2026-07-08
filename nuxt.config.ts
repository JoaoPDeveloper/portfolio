export default defineNuxtConfig({
  compatibilityDate: '2025-07-07',
  nitro: {
    preset: 'vercel_static',
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      import('@tailwindcss/vite').then((m) => m.default()),
    ],
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Joao Pedro Lima Pereira - Portfolio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Full Stack Developer - Laravel, Vue, JavaScript' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: 'https://cdn-icons-png.flaticon.com/512/10456/10456439.png' },
      ],
    },
  },
});
