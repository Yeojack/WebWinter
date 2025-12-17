import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    // 경로 별칭 설정
    alias: {
      // @ 를 사용하면 src 폴더 경로로 매핑
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000, // front서버 포트 설정
    proxy: {
      // '/chart' 로 시작하는 요청으로 자동으로 백엔드 서버로 전달
      // ex: fetch('/chart/health) -> http://localhost:4000/chart/health 로 요청됨
      '/chart': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/table': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/upload': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
