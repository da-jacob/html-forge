import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import en from 'javascript-time-ago/locale/en'
import TimeAgo from 'javascript-time-ago'
TimeAgo.addDefaultLocale(en);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
