import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
      buffer: 'buffer',
      unfetch: require.resolve('rollup-plugin-node-builtins')
    }
  },
  base: '/dice/',
  plugins: [react(), tsconfigPaths()],
  ssr: {
    noExternal: ['@apollo/client']
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    // setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  }
})
