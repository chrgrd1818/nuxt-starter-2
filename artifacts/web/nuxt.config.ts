const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3000;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

export default defineNuxtConfig({
  ssr: true,
  modules: ["@nuxt/ui"],

  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY || "",
      lang: process.env.NUXT_PUBLIC_LANG || "en",
    },
  },

  css: ["~/assets/css/main.css"],

  icon: {
    collections: ["lucide"],
  },

  compatibilityDate: "2025-01-01",

  devServer: {
    host: "0.0.0.0",
    port,
  },

  vite: {
    server: {
      allowedHosts: true,
    },
  },

  nitro: {
    devProxy: undefined,
  },
});
