// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/google-fonts',
  ],

  css: ['~/assets/css/main.css'],

  googleFonts: {
    families: {
      'Noto Sans JP': [300, 400, 700, 900],
      'Great Vibes': [400],
      'Taprom': [400],
      'League Gothic': [400],
    },
    display: 'swap',
  },

  app: {
    head: {
      title: 'ファンタジージョブ診断',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
      meta: [
        { name: 'description', content: '11の質問に答えて、あなたの職場でのRPGジョブを診断しよう' },
        { property: 'og:site_name', content: 'ファンタジージョブ診断' },
        { property: 'og:title', content: 'ファンタジージョブ診断' },
        { property: 'og:description', content: 'あなたがファンタジーの世界に生まれ変わったら、どんな職業になるのでしょうか？あなたが今のチームの中でどんな役割を担い、どんな強みを持っているかをゲームの中の世界のジョブ（職業）に例えて診断します。' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://rpg-job-diagnosis.vercel.app/' },
        { property: 'og:image', content: 'https://rpg-job-diagnosis.vercel.app/ogp/ogp-top.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ファンタジージョブ診断' },
        { name: 'twitter:description', content: 'あなたがファンタジーの世界に生まれ変わったら、どんな職業になるのでしょうか？あなたが今のチームの中でどんな役割を担い、どんな強みを持っているかをゲームの中の世界のジョブ（職業）に例えて診断します。' },
        { name: 'twitter:image', content: 'https://rpg-job-diagnosis.vercel.app/ogp/ogp-top.png' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabaseKey: '',
    },
  },
})
