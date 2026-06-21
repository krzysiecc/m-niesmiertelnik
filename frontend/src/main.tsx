
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './styles/index.css'
import './i18n'; // Initialize internationalization (PL/EN)

import { ThemeProvider } from './context/ThemeProvider.tsx'; // Import the provider
import { AuthProvider } from './context/AuthContext.tsx'; // Import the AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider> {/* Wrap the App */}
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
