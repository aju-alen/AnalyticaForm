import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const categoryNames = [
  'Research Knowledge & Foundations',
  'Writing Progress & Structure',
  'Supervisor Communication',
  'Time Management & Productivity',
  'Stress, Motivation & Mental Well-being',
  'Data, Methodology & Analysis Readiness',
  'Writing Habits & Systems',
  'Project Planning & Milestones',
  'Academic Environment & Support',
  'Defense Readiness & Final Stretch',
]

export default function FullPaymentSummaryBeforePayment() {
  const { responseId: responseIdParam } = useParams()
  const [searchParams] = useSearchParams()
  const responseId = responseIdParam || searchParams.get('responseId')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  const [status, setStatus] = useState({
    paid: false,
    fullScore: null,
    bandPositionLabel: null,
    categoryScores: null,
  })

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL_DRI || 'http://localhost:3001'

  useEffect(() => {
    let cancelled = false
    async function loadStatus() {
      if (!responseId) {
        setIsLoadingStatus(false)
        return
      }
      setIsLoadingStatus(true)
      try {
        const res = await fetch(
          `${apiBaseUrl}/api/stripe/dri/full/status/${encodeURIComponent(String(responseId))}`,
        )
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.message || 'Failed to load full payment status')
        if (!cancelled) {
          setStatus({
            paid: Boolean(data?.paid),
            fullScore: data?.fullScore ?? null,
            bandPositionLabel: data?.bandPositionLabel ?? null,
            categoryScores: data?.categoryScores ?? null,
          })
        }
      } catch (err) {
        console.error('[DRI full status] load failed:', err?.message || err)
      } finally {
        if (!cancelled) setIsLoadingStatus(false)
      }
    }
    loadStatus()
    return () => {
      cancelled = true
    }
  }, [apiBaseUrl, responseId])

  async function handleUnlockFullClick() {
    if (!responseId || isProcessing) return
    setIsProcessing(true)
    try {
      const res = await fetch(`${apiBaseUrl}/api/stripe/dri/full/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || 'Failed to create full checkout session')
      if (data?.sessionUrl) {
        window.location.assign(data.sessionUrl)
        return
      }
      throw new Error('Unexpected response from server: missing sessionUrl')
    } catch (err) {
      console.error('[DRI full unlock] checkout error:', err?.message || err)
      alert(err?.message || 'Could not start payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleDownloadFullPdfClick() {
    if (!responseId) return
    try {
      const res = await fetch(`${apiBaseUrl}/api/dri/full/pdf/${encodeURIComponent(String(responseId))}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || 'Failed to download full report PDF')
      }
      const pdfBlob = await res.blob()
      const fileUrl = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = fileUrl
      a.download = `dri-full-report-${responseId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(fileUrl)
    } catch (err) {
      console.error('[DRI full PDF] download failed:', err?.message || err)
      alert(err?.message || 'Could not download full report PDF.')
    }
  }

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Full DRI Snapshot</p>
        {isLoadingStatus ? (
          <h1>Checking your full report payment status...</h1>
        ) : status.paid ? (
          <>
            <h1>Your full DRI report is ready (unlocked)</h1>
            <p className="body">Your complete 50-question report is now available.</p>
            <div className="score-panel" aria-hidden="false">
              <div className="score-panel-header">
                <span className="pill">Unlocked</span>
                <span className="response-id">Response: {responseId}</span>
              </div>
              <div className="overall-score">
                <div className="overall-score-value">
                  {typeof status.fullScore === 'number' ? status.fullScore.toFixed(1) : '—'}
                </div>
                <div className="overall-band">
                  <span className="overall-band-pill">{status.bandPositionLabel ?? 'Band —'}</span>
                </div>
              </div>
              <div className="score-grid">
                {categoryNames.map((name, idx) => {
                  const key = `fullCat${idx + 1}`
                  const value = status.categoryScores?.[key]
                  return (
                    <div key={name} className="score-item">
                      <p>{name}</p>
                      <span>{typeof value === 'number' ? `${value.toFixed(1)}%` : '—'}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="actions">
              <button type="button" className="button primary" onClick={handleDownloadFullPdfClick}>
                Download your full report (PDF)
              </button>
            </div>
            <div className="actions" style={{ marginTop: '0.75rem' }}>
              <p className="body" style={{ marginBottom: '0.5rem' }}>
                <strong>Want help improving your score?</strong>
              </p>
              <a
                className="button ghost"
                href="mailto:support@phdsuccess.ae?subject=Support%20request%20for%20DRI"
              >
                Contact Support (Free)
              </a>
              <a
                className="button primary"
                href="https://scheduler.phdsuccess.ae/"
                target="_blank"
                rel="noreferrer"
              >
                Book a session with Dr. Michael (Google Meet scheduling)
              </a>
            </div>
          </>
        ) : (
          <>
            <h1>Your full DRI report is ready (locked)</h1>
            <p className="body">
              Your 50 answers were analyzed. Unlock your full DRI report instantly for AED 385.
            </p>
            <div className="score-panel locked" aria-hidden="true">
              <div className="score-panel-header">
                <span className="pill">Preview</span>
                <span className="response-id">Response: {responseId}</span>
              </div>
              <div className="score-grid">
                {categoryNames.map((name) => (
                  <div key={name} className="score-item">
                    <p>{name}</p>
                    <span>{`fullCat${categoryNames.indexOf(name) + 1}: •••`}</span>
                  </div>
                ))}
              </div>
              <div className="blur-overlay">
                <p>Unlock to reveal full DRI insights + complete report</p>
              </div>
            </div>
            <div className="actions">
              <button
                type="button"
                className="button primary"
                onClick={handleUnlockFullClick}
                disabled={!responseId || isProcessing}
              >
                {isProcessing ? 'Redirecting to secure payment...' : 'Unlock Full DRI AED 385'}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
