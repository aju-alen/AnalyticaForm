import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
