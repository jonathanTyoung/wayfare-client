// index.jsx or main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import ApplicationViews from './components/ApplicationViews.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <ApplicationViews />
  </React.StrictMode>,
)
