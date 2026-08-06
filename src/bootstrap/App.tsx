import { Suspense } from 'react';
import { RouterProvider, type ClientOnErrorFunction } from 'react-router-dom';
import styles from './App.module.less';
import router from './router';

const handleRouterError: ClientOnErrorFunction = (error, { errorInfo, location }) => {
  console.error('[route]', error, location.pathname, errorInfo);
};

function PageLoadingFallback() {
  return (
    <div className={styles.pageLoadingFallback}>
      <span>Loading...</span>
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
