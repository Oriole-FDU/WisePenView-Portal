import { Suspense } from 'react';
import { RouterProvider, type ClientOnErrorFunction } from 'react-router-dom';
import logoIconAqua from '@/assets/logos/logo-icon-aqua.svg';
import styles from './App.module.less';
import router from './router';

const handleRouterError: ClientOnErrorFunction = (error, { errorInfo, location }) => {
  console.error('[route]', error, location.pathname, errorInfo);
};

function PageLoadingFallback() {
  return (
    <div className={styles.pageLoadingFallback}>
      <div className={styles.loadingMark} aria-label="WisePen 正在加载" role="status">
        <img src={logoIconAqua} alt="" aria-hidden="true" />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <RouterProvider router={router} onError={handleRouterError} />
    </Suspense>
  );
}

export default App;
