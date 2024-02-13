import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/globals.scss'
import './init'
import './i18n'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
