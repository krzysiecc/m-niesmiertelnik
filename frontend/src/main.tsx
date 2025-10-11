
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './styles/index.css'

import { ThemeProvider } from './context/ThemeProvider.tsx'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider> {/* Wrap the App */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)