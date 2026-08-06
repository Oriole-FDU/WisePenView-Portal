/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  // 主站地址
  readonly VITE_MAIN_SITE_URL: string;
  // 客户端下载链接
  readonly VITE_DOWNLOAD_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
