import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './utils/deviceAdapter';

// 12. OWASP Anti-Clickjacking Defense (Complementing X-Frame-Options: SAMEORIGIN & CSP frame-ancestors 'self')
if (typeof window !== 'undefined' && window.self !== window.top) {
  try {
    window.top!.location = window.self.location;
  } catch {
    /* Cross-origin framing strictly blocked by HTTP response headers */
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
