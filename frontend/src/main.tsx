import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { API_BASE_URL } from './config/api';
import { setAssetBaseUrl } from './utils/imageUtils';

// /product_images/* is served by the backend, not this app, so point local image
// paths at the backend's origin (see config/api.ts).
setAssetBaseUrl(API_BASE_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
