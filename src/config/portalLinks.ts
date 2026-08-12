export const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL;

export const LOGIN_URL = import.meta.env.VITE_LOGIN_URL;

export const REGISTER_URL = import.meta.env.VITE_REGISTER_URL;

export const GITHUB_URL = 'https://github.com/Oriole-FDU/WisePen';

export function openPortalLink(url: string): void {
  window.location.assign(url);
}
