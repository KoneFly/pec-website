// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// GitHub Pages 子路径部署：https://konefly.github.io/pec-website/
export default defineConfig({
  site: 'https://konefly.github.io',
  base: '/pec-website',
  integrations: [tailwind({ applyBaseStyles: false })],
  server: {
    port: 4321,
    host: true, // 局域网内可访问，方便手机调试
  },
  vite: {
    server: {
      proxy: {
        // 开发时代理 /api 到本地后端
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  },
});
