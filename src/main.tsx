import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './utils/deviceAdapter';

import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/ErrorBoundary';

// 12. OWASP Anti-Clickjacking Defense (Complementing X-Frame-Options: SAMEORIGIN & CSP frame-ancestors 'self')
if (import.meta.env.PROD && typeof window !== 'undefined' && window.self !== window.top) {
  try {
    window.top!.location.href = window.self.location.href;
  } catch {
    /* Cross-origin framing strictly blocked by HTTP response headers */
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff', borderRadius: '12px' } }} />
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
