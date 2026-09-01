import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { BarChart } from '@mui/x-charts/BarChart';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import { refreshToken } from '../utils/refreshToken';
import { clearUserAccess, getUserAccess, isUserSuperAdmin } from '../utils/userAccess';
import { FORM_TYPE_LABELS } from '../questionTypes/registry';
import ResponseDashboard from './ResponseDashboard';

async function userHasPremiumAccess() {
  if (isUserSuperAdmin()) return true;
  const user = getUserAccess();
  if (!user?.id) return false;
  const memberRes = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user-promember/${user.id}`);
  const now = Math.floor(Date.now() / 1000);
  return Boolean(memberRes?.data?.subscriptionPeriodEnd && memberRes.data.subscriptionPeriodEnd > now);
}

function OverviewPanel({ analytics, isPremium, onExport, exporting }) {
  const questions = analytics?.questions || [];
  const exportButton = (
    <Button
      variant="outlined"
      startIcon={<FileDownloadOutlinedIcon />}
      onClick={onExport}
      disabled={!isPremium || exporting}
    >
      {exporting ? 'Exporting…' : 'Question summary Excel'}
    </Button>
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="flex-end">
        {isPremium ? exportButton : (
          <Tooltip title="Premium">
            <span>{exportButton}</span>
          </Tooltip>
        )}
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {[
          { label: 'Responses', value: analytics?.totalResponses ?? 0 },
          { label: 'Views', value: analytics?.surveyViews ?? 0 },
          { label: 'Completion', value: `${analytics?.completionRate ?? 0}%` },
        ].map((item) => (
          <Paper key={item.label} elevation={0} sx={{ p: 2.5, flex: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">{item.label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>{item.value}</Typography>
          </Paper>
        ))}
      </Stack>

      {questions.length === 0 ? (
        <Typography color="text.secondary">No questions to summarize yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {questions.map((question) => (
            <Paper key={question.id} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>{question.question}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {FORM_TYPE_LABELS[question.formType] || question.formType} · {question.answered} of {question.total} answered
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
      )}
    </Stack>
  );
}

function PremiumGate({ title, body, onUpgrade }) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
      <LockOutlinedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', mb: 3 }}>
        {body}
      </Typography>
      <Button variant="contained" size="large" onClick={onUpgrade}>
        See Premium plans
      </Button>
    </Paper>
  );
}

function TrendsPanel({ trends }) {
  const byDay = trends?.responsesByDay || [];
  const dropOff = trends?.dropOff || [];

  return (
    <Stack spacing={3}>
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Responses per day</Typography>
        {byDay.length === 0 ? (
          <Typography color="text.secondary">No complete responses yet.</Typography>
        ) : (
          <BarChart
            height={280}
            xAxis={[{ scaleType: 'band', data: byDay.map((row) => row.date) }]}
            series={[{ data: byDay.map((row) => row.count), label: 'Responses' }]}
          />
        )}
      </Paper>
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Drop-off by question</Typography>
        {dropOff.length === 0 ? (
          <Typography color="text.secondary">No questions to chart yet.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {dropOff.map((row) => (
              <Box key={row.id}>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                  <Typography variant="body2">{row.question}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {row.answered} of {row.total} ({row.percent}%)
                    {row.dropOffFromPrevious > 0 ? ` · −${row.dropOffFromPrevious}` : ''}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Number(row.percent) || 0)}
                  sx={{ height: 8, borderRadius: 1, mt: 0.5 }}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}

const SurveyAnalytics = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = ['responses', 'trends'].includes(searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'overview';
  const [tab, setTab] = useState(requestedTab);
  const [analytics, setAnalytics] = useState(null);
  const [trends, setTrends] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setTab(requestedTab);
  }, [requestedTab]);

  useEffect(() => {
    const load = async () => {
      try {
        await refreshToken();
        const [premium, response] = await Promise.all([
          userHasPremiumAccess(),
          axiosWithAuth.get(`${backendUrl}/api/survey/question-analytics/${surveyId}`),
        ]);
        setIsPremium(premium);
        setAnalytics(response.data);
        if (premium) {
          try {
            const trendRes = await axiosWithAuth.get(`${backendUrl}/api/survey/trend-analytics/${surveyId}`);
            setTrends(trendRes.data);
          } catch {
            setTrends(null);
          }
        }
      } catch (err) {
        if (err.response?.status === 401) {
          clearUserAccess();
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || 'Could not load analytics.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [surveyId, navigate]);

  const handleTabChange = (_event, next) => {
    setTab(next);
    if (next === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: next });
    }
  };

  const handleExportSummary = async () => {
    if (!isPremium || exporting) return;
    setExporting(true);
    try {
      await refreshToken();
      const response = await axiosWithAuth.post(
        `${backendUrl}/api/excel/export-question-summary/${surveyId}`,
        {},
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = response.headers?.['content-disposition'] || '';
      const named = disposition.match(/filename="?([^"]+)"?/);
      a.download = named?.[1] || 'question-summary.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (err.response?.status === 401) {
        clearUserAccess();
        navigate('/login');
      }
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>Back to dashboard</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f4f7fb', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} mb={2}>
          <Box>
            <Button onClick={() => navigate('/dashboard')} sx={{ mb: 1, px: 0 }}>
              Back to dashboard
            </Button>
            <Typography variant="h4" fontWeight={700}>
              {analytics?.surveyTitle || 'Survey analytics'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              One place for survey results. Overview is included on Free. Responses, trends, and question-summary Excel are Premium.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip color={isPremium ? 'success' : 'warning'} label={isPremium ? 'Premium' : 'Free plan'} />
            <Button variant="text" onClick={() => navigate('/user-analytics')}>All surveys</Button>
          </Stack>
        </Stack>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="overview" label="Overview" />
          <Tab
            value="responses"
            label={isPremium ? 'Responses' : 'Responses (Premium)'}
          />
          <Tab
            value="trends"
            label={isPremium ? 'Trends' : 'Trends (Premium)'}
          />
        </Tabs>

        {tab === 'overview' && (
          <OverviewPanel
            analytics={analytics}
            isPremium={isPremium}
            onExport={handleExportSummary}
            exporting={exporting}
          />
        )}
        {tab === 'responses' && (
          isPremium
            ? <ResponseDashboard embedded />
            : (
              <PremiumGate
                title="Individual responses are on Premium"
                body="Free analytics shows totals and how each question was answered. Premium unlocks each respondent’s answers, time spent, filters, search, and advanced export."
                onUpgrade={() => navigate('/pricing')}
              />
            )
        )}
        {tab === 'trends' && (
          isPremium
            ? <TrendsPanel trends={trends} />
            : (
              <PremiumGate
                title="Trends and drop-off are on Premium"
                body="See responses per day and where people stop answering. Upgrade to unlock time-series and drop-off charts."
                onUpgrade={() => navigate('/pricing')}
              />
            )
        )}
      </Container>
    </Box>
  );
};

export default SurveyAnalytics;
