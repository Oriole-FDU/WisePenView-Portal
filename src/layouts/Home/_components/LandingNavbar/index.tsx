import { MAIN_SITE_URL, openPortalLink } from '@/config/portalLinks';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styles from './style.module.less';

/** 滚动到门户区块（SPA 内 .root 为滚动容器，需 scrollIntoView 而非 #hash） */
function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <span className={styles.brandMark} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
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
        <button
          type="button"
          className={clsx(styles.authBtn, styles.registerBtn)}
          onClick={() => openPortalLink(MAIN_SITE_URL)}
        >
          {t('home.nav.register')}
        </button>
        <button
          type="button"
          className={clsx(styles.authBtn, styles.loginBtn)}
          onClick={() => openPortalLink(MAIN_SITE_URL)}
        >
          {t('home.nav.login')}
        </button>
      </div>
    </div>
  );
}

export default LandingNavbar;
