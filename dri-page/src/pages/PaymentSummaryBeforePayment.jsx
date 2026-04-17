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

const scoreCategories = [
  { label: 'Research Knowledge & Foundations', score: '75%' },
  { label: 'Writing Progress & Structure', score: '50%' },
  { label: 'Supervisor Communication', score: '75%' },
  { label: 'Time Management & Productivity', score: '50%' },
]

export default function PaymentSummaryBeforePayment() {
  const { responseId: responseIdParam } = useParams()
  const [searchParams] = useSearchParams()
  const responseIdFromQuery = searchParams.get('responseId')
  const responseId = responseIdParam || responseIdFromQuery
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)
  const [status, setStatus] = useState({
    paid: false,
    interimScore: null,
    bandPositionLabel: null,
    categoryScores: null,
    continueUrl: null,
    emailId: null,
  })

  console.log(status, 'status');
  

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL_DRI || 'http://localhost:3001'

  useEffect(() => {
    let cancelled = false

    async function loadStatus() {
      if (!responseId) {
        setStatus((prev) => ({ ...prev, paid: false }))
        setIsLoadingStatus(false)
        return
      }

      setIsLoadingStatus(true)

      try {
        const res = await fetch(
          `${apiBaseUrl}/api/stripe/dri/interim/status/${encodeURIComponent(String(responseId))}`,
        )
        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          throw new Error(data?.message || 'Failed to load payment status')
        }

        if (!cancelled) {
          setStatus({
            paid: Boolean(data?.paid),
            interimScore: data?.interimScore ?? null,
            bandPositionLabel: data?.bandPositionLabel ?? null,
            categoryScores: data?.categoryScores ?? null,
            continueUrl: data?.continueUrl ?? null,
            emailId: data?.emailId ?? null,
          })
        }
      } catch (err) {
        console.error('[DRI status] load failed:', err?.message || err)
        if (!cancelled) {
          setStatus((prev) => ({ ...prev, paid: false }))
        }
      } finally {
        if (!cancelled) setIsLoadingStatus(false)
      }
    }

    loadStatus()
    return () => {
      cancelled = true
    }
  }, [apiBaseUrl, responseId])

  async function handleUnlockClick() {
    if (!responseId) return
    if (isProcessing) return
    setIsProcessing(true)

    try {
      const res = await fetch(`${apiBaseUrl}/api/stripe/dri/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseId }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to create Stripe checkout session')
      }

      if (data?.sessionUrl) {
        window.location.assign(data.sessionUrl)
        return
      }

      throw new Error('Unexpected response from server: missing sessionUrl')
    } catch (err) {
      console.error('[DRI unlock] checkout error:', err?.message || err)
      alert(err?.message || 'Could not start payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleDownloadPdfClick() {
    if (!responseId) return

    try {
      const res = await fetch(
        `${apiBaseUrl}/api/dri/interim/pdf/${encodeURIComponent(String(responseId))}`,
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || 'Failed to download interim report PDF')
      }

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.toLowerCase().includes('application/pdf')) {
        const messageText = await res.text().catch(() => '')
        throw new Error(
          messageText || 'Server did not return a valid PDF document',
        )
      }

      const pdfBlob = await res.blob()
      const fileUrl = URL.createObjectURL(pdfBlob)
      const anchor = document.createElement('a')
      anchor.href = fileUrl
      anchor.download = `dri-interim-report-${responseId}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(fileUrl)
    } catch (err) {
      console.error('[DRI PDF] download failed:', err?.message || err)
      alert(err?.message || 'Could not download interim report PDF.')
    }
  }

  const continueSurveyHref = status.continueUrl
    ? status.continueUrl
    : responseId
      ? `${apiBaseUrl}/user-survey/${encodeURIComponent(String(import.meta.env.VITE_DEFENCE_READINESS_SURVEY_ID || ''))}?responseId=${encodeURIComponent(String(responseId))}&continueDri=1`
      : '#'

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Interim DRI Snapshot</p>
        {isLoadingStatus ? (
          <h1>Checking your payment status...</h1>
        ) : status.paid ? (
          <>
            <h1>Your interim DRI score is ready (unlocked)</h1>
            <p className="body">
              Your interim score and band are now available. Continue the full DRI assessment to unlock the next step.
            </p>

            <div className="score-panel" aria-hidden="false">
              <div className="score-panel-header">
                <span className="pill">Unlocked</span>
                <span className="response-id">Response: {responseId}</span>
              </div>

              <div className="overall-score">
                <div className="overall-score-value">
                  {typeof status.interimScore === 'number'
                    ? `${status.interimScore.toFixed(1)}%`
                    : '—'}
                </div>
                <div className="overall-band">
                  <span className="overall-band-pill">
                    {status.bandPositionLabel
                      ? typeof status.interimScore === 'number'
                        ? `${status.bandPositionLabel} (${status.interimScore.toFixed(1)}%)`
                        : status.bandPositionLabel
                      : 'Band —'}
                  </span>
                </div>
              </div>

              <div className="score-grid">
                {categoryNames.map((name, idx) => {
                  const key = `cat${idx + 1}`
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
              <button
                type="button"
                className="button primary"
                onClick={handleDownloadPdfClick}
              >
                Download your interim report (PDF)
              </button>
              <a
                className="button ghost"
                href={status.continueUrl ?? '#'}
                aria-disabled={!status.continueUrl}
                onClick={(e) => {
                  if (!status.continueUrl) e.preventDefault()
                }}
              >
                Continue full DRI (Questions 11-50)
                <span className="lock-tag">Open form</span>
              </a>
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
            <h1>Your interim DRI score is ready (locked)</h1>
            <p className="body">
              Your first 10 answers were analyzed. Unlock your interim score and
              full report instantly for AED 39.
            </p>

            <div className="score-panel locked" aria-hidden="true">
              <div className="score-panel-header">
                <span className="pill">Preview</span>
                <span className="response-id">Response: {responseId}</span>
              </div>
              <div className="score-grid">
                {scoreCategories.map((item) => (
                  <div key={item.label} className="score-item">
                    <p>{item.label}</p>
                    <span>{item.score}</span>
                  </div>
                ))}
              </div>
              <div className="blur-overlay">
                <p>Unlock to reveal exact interim score + report</p>
              </div>
            </div>

            <div className="actions">
              <button
                type="button"
                className="button primary"
                onClick={handleUnlockClick}
                disabled={!responseId || isProcessing}
              >
                {isProcessing
                  ? 'Redirecting to secure payment...'
                  : 'Unlock Interim Service AED 39 Only.'}
              </button>

              <a
                className="button ghost"
                href={continueSurveyHref}
                aria-disabled={!responseId}
                onClick={(e) => {
                  if (!responseId) e.preventDefault()
                }}
              >
                Continue full DRI (Questions 11-50)
                <span className="lock-tag">Locked until interim unlock</span>
              </a>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

