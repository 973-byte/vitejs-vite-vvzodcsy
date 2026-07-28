import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Kill white flash before React mounts
document.documentElement.style.background = '#040D2E'
document.body.style.background = '#040D2E'
document.body.style.margin = '0'

const root = document.getElementById('root')
if (root) root.style.background = '#040D2E'

ReactDOM.createRoot(root as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
