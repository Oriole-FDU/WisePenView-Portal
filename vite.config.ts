import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import packageJson from './package.json' with { type: 'json' };

const REQUIRED_CLIENT_URL_KEYS = [
  'VITE_MAIN_SITE_URL',
  'VITE_LOGIN_URL',
  'VITE_REGISTER_URL',
] as const;

function assertClientUrl(key: string, value: string, mode: string): void {
  try {
    new URL(value);
  } catch {
    throw new Error(`[vite] ${key} 必须是绝对 URL。请检查 .env.${mode}`);
  }
}

export default defineConfig(({ mode }) => {
  // 无前缀：仅构建期使用，不会注入 import.meta.env 到浏览器
  const env = loadEnv(mode, process.cwd(), '');

  for (const key of REQUIRED_CLIENT_URL_KEYS) {
    const value = env[key];
    if (!value) {
      throw new Error(`[vite] 缺少 ${key}。请检查 .env.${mode}`);
    }
    assertClientUrl(key, value, mode);
  }

  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    server: {
      port: 5173,
      host: '127.0.0.1',
      allowedHosts: ['local.wisepen.oriole.cn'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // 门户首页包含 3D 动效和中英文字体资源，允许运行时 chunk 保持适度体积。
      chunkSizeWarningLimit: 2500,
    },
  };
});
