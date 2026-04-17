import { Route, Routes } from 'react-router-dom'
import './App.css'
import PaymentSummaryBeforePayment from './pages/PaymentSummaryBeforePayment.jsx'
import FullPaymentSummaryBeforePayment from './pages/FullPaymentSummaryBeforePayment.jsx'

function NotFoundPage() {
  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="body">
          The page you requested does not exist. Please check the URL and try
          again.
        </p>
      </section>
    </main>
  )
}

function App() {
  return (
    <Routes>
      
      <Route
        path="/interim-report/:responseId"
        element={<PaymentSummaryBeforePayment />}
      />
      <Route
        path="/full-payment-summary/:responseId"
        element={<FullPaymentSummaryBeforePayment />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
