import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosWithAuth } from '../utils/customAxios'
import { backendUrl } from '../utils/backendUrl'
import { refreshToken } from '../utils/refreshToken'
import { clearUserAccess } from '../utils/userAccess'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

const Usersurveyanalytics = () => {
  const { surveyId } = useParams()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        await refreshToken()
        const response = await axiosWithAuth.get(`${backendUrl}/api/survey/question-analytics/${surveyId}`)
        setAnalytics(response.data)
      } catch (err) {
        if (err.response?.status === 401) {
          clearUserAccess()
          navigate('/login')
          return
        }
        setError(err.response?.data?.message || 'Could not load analytics.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [surveyId, navigate])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
      <Typography variant="h4" sx={{ mb: 1 }}>{analytics?.surveyTitle || 'Survey analytics'}</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap' }}>
        <Chip label={`${analytics?.totalResponses ?? 0} complete responses`} color="primary" />
        <Chip label={`${analytics?.surveyViews ?? 0} views`} />
        <Chip label={`${analytics?.completionRate ?? 0}% completion`} />
      </Stack>
      {(analytics?.questions || []).length === 0 && (
        <Typography color="text.secondary">No questions to summarize yet.</Typography>
      )}
      <Stack spacing={2}>
        {(analytics?.questions || []).map((question) => (
          <Paper key={question.id} sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={600}>{question.question}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {question.formType} · {question.answered} of {question.total} answered
            </Typography>
            {(question.options || []).length === 0 ? (
              <Typography variant="body2" color="text.secondary">No answers yet.</Typography>
            ) : (
              <Stack spacing={1.25}>
                {question.options.map((option) => (
                  <Box key={`${question.id}-${option.label}`}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">{option.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.count} ({option.percent}%)
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, Number(option.percent) || 0)}
                      sx={{ height: 8, borderRadius: 1, mt: 0.5 }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        ))}
      </Stack>
    </Container>
  )
}

export default Usersurveyanalytics
