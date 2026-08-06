import LandingNavbar from '@/layouts/Home/_components/LandingNavbar';
import { useTranslation } from 'react-i18next';
import styles from './style.module.less';

function AppError() {
  const { t } = useTranslation('errors');

  return (
    <div className={styles.root}>
      <div className={styles.navShell}>
        <LandingNavbar />
      </div>
      <main className={styles.main}>
        <section className={styles.result}>
          <h1>{t('page.appUnavailable')}</h1>
          <p>{t('page.reloadDescription')}</p>
          <div className={styles.actionGroup}>
            <button type="button" onClick={() => window.location.reload()}>
              {t('page.reload')}
            </button>
            <button type="button" onClick={() => window.location.assign('/')}>
              {t('page.backHome')}
            </button>
          </div>
        </section>
      </main>
      <footer className={styles.footerMini}>{t('page.footer')}</footer>
    </div>
  );
}

export default AppError;
