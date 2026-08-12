import { LOGIN_URL, MAIN_SITE_URL, REGISTER_URL, openPortalLink } from '@/config/portalLinks';
import logoIconAqua from '@/assets/logos/logo-icon-aqua.svg';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './style.module.less';

/** 滚动到门户区块（SPA 内 .root 为滚动容器，需 scrollIntoView 而非 #hash） */
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function IconGitHub() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .08 1.52 1.03 1.52 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.26-.45-1.29.1-2.68 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.39.2 2.42.1 2.68.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.67.92.67 1.86v2.75c0 .26.18.57.69.47A10 10 0 0 0 12 2z" />
    </svg>
  );
}

function LandingNavbar() {
  const { t } = useTranslation('shell');

  const anchors = [
    { id: 'ai', label: t('home.nav.features') },
    { id: 'knowledge', label: t('home.nav.knowledge') },
    { id: 'team', label: t('home.nav.team') },
    { id: 'scenes', label: t('home.nav.scenes') },
    { id: 'faq', label: t('home.nav.faq') },
  ];

  return (
    <div className={styles.bar}>
      <div className={styles.brand}>
        <img className={styles.brandMark} src={logoIconAqua} alt="" aria-hidden="true" />
        <span className={styles.brandText}>WisePen</span>
      </div>

      <nav className={styles.navLinks} aria-label={t('home.navAria')}>
        {anchors.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.navLink}
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.navAuth}>
        <a
          className={clsx(styles.authBtn, styles.githubBtn)}
          href="https://github.com/Oriole-FDU/WisePen"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <IconGitHub />
          <span>{t('home.footer.github')}</span>
        </a>
        <button
          type="button"
          className={clsx(styles.authBtn, styles.homeBtn)}
          onClick={() => openPortalLink(MAIN_SITE_URL)}
        >
          {t('home.nav.home')}
        </button>
        <button
          type="button"
          className={clsx(styles.authBtn, styles.registerBtn)}
          onClick={() => openPortalLink(REGISTER_URL)}
        >
          {t('home.nav.register')}
        </button>
        <button
          type="button"
          className={clsx(styles.authBtn, styles.loginBtn)}
          onClick={() => openPortalLink(LOGIN_URL)}
        >
          {t('home.nav.login')}
        </button>
      </div>
    </div>
  );
}

export default LandingNavbar;
