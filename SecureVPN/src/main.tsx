import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initNativeEvents } from './utils/nativeEvents';

initNativeEvents();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
