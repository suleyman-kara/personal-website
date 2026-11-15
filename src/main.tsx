import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './fun.css'
import App from './App.tsx'
import { consoleHello } from './fun'

consoleHello()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
