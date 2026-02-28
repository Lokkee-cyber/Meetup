import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PaymentMethod from './PaymentMethod'
import Pay from './Pay'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/payment-method" element={<PaymentMethod />} />
        <Route path="/pay/:method" element={<Pay />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
