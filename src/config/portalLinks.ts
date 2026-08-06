export const MAIN_SITE_URL = import.meta.env.VITE_MAIN_SITE_URL;

export const DOWNLOAD_URL = import.meta.env.VITE_DOWNLOAD_URL;

export function openPortalLink(url: string): void {
  window.location.assign(url);
}
