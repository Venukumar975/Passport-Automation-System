import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import '../styles/variables.css'
import '../styles/applications.css'
import '../styles/login.css'
import '../styles/newapplication.css'
import '../styles/docsheader.css'
import '../styles/progressbar.css';
import '../styles/uploaddocs.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
