import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8888,
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
  },
  css: {
    preprocessorOptions: {
      scss: {
        // sass配置选项
      },
    },
  },
  base: process.env.NODE_ENV === 'production' ? './' : '/',
});