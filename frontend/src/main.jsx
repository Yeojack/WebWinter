// src/main.jsx

import { StrictMode } from 'react';
import { toaster, ToasterProvider } from './components/common/toaster';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './provider/auth-provider';

import App from '@/App.jsx';

import '@/styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToasterProvider>
          <App />
        </ToasterProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
