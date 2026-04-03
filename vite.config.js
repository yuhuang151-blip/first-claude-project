import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'watch-server',
      configureServer(server) {
        server.watcher.add('./server')
        server.watcher.on('change', (path) => {
          if (path.includes('server')) {
            server.ws.send({ type: 'full-reload' })
          }
        })
      },
    },
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
