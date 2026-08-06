import '@/i18n';
import '@fontsource-variable/noto-sans-sc/wght.css';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './bootstrap/App';
import './bootstrap/index.css';
import RootErrorFallback from './views/app/error/RootErrorFallback';

const root = createRoot(document.getElementById('root')!, {
  onUncaughtError: (error, errorInfo) => {
    console.error('[react-uncaught]', error, errorInfo);
  },
  onRecoverableError: (error, errorInfo) => {
    console.error('[react-recoverable]', error, errorInfo);
  },
});

root.render(
  <ErrorBoundary
    FallbackComponent={RootErrorFallback}
    onError={(error, errorInfo) => {
      console.error('[root-boundary]', error, errorInfo);
    }}
  >
    <App />
  </ErrorBoundary>
);
