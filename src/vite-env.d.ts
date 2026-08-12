/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  // 首页地址
  readonly VITE_MAIN_SITE_URL: string;
  // 登录地址
  readonly VITE_LOGIN_URL: string;
  // 注册地址
  readonly VITE_REGISTER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
