import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
// https://vitejs.dev/config/
export default defineConfig({
  base: '/wordle/',
  plugins: [
    react(),
    svgr(),
    {
      name: 'inject-chat-widget',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: {
              src: 'https://ai-chat-platform-staging.up.railway.app/widget.js',
              'data-client-id': '4259bfe6-b14b-439c-aa82-2839ca612c28',
              'data-api-url': 'https://ai-chat-platform-staging.up.railway.app',
            },
            injectTo: 'body',
          },
        ];
      },
    },
  ],
  server: {
    port: 3000,
  }
})
