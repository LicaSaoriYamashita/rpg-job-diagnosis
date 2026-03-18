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
      title: '職場RPGジョブ診断',
      meta: [
        { name: 'description', content: '11の質問に答えて、あなたの職場でのRPGジョブを診断しよう' },
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
