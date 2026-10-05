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
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Joao Pedro Lima Pereira - Portfolio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Full Stack Developer - Laravel, Vue, JavaScript' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: 'https://img.icons8.com/?size=100&id=nqg2tDAxO1LG&format=png&color=000000' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap' },
      ],
      script: [
        {
          innerHTML: `(function(){var d=document.documentElement;var t=localStorage.getItem('appearance')||'system';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){d.classList.add('dark')}else{d.classList.remove('dark')}})();`,
          type: 'text/javascript',
        },
      ],
    },
  },
});
