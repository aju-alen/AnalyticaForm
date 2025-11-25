import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import { refreshToken } from '../utils/refreshToken';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimelineIcon from '@mui/icons-material/Timeline';

dayjs.extend(relativeTime);

const filters = [
  { id: 'all', label: 'All responses' },
  { id: 'identified', label: 'With email' },
  { id: 'anonymous', label: 'Anonymous only' },
  { id: 'recent', label: 'Last 7 days' },
];

const defaultStats = {
  totalResponses: 0,
  avgTimeSpent: '0m 0s',
  uniqueParticipants: 0,
  recentSubmissions: 0,
  lastResponseAt: '—',
};

const normalizeAnswer = (selectedValue) => {
  if (!selectedValue) return '—';
  if (Array.isArray(selectedValue)) {
    const answers = selectedValue
      .map((entry) => {
        if (entry === null || entry === undefined) return '';
        if (typeof entry === 'string') return entry;
        if (typeof entry === 'number') return entry.toString();
        if (typeof entry === 'object') {
          return entry.answer ?? entry.value ?? entry.label ?? entry.rowQuestion ?? entry.question ?? '';
        }
        return '';
      })
      .filter(Boolean);
    return answers.length ? answers.join(', ') : '—';
  }

  if (typeof selectedValue === 'object') {
    return (
      selectedValue.answer ??
      selectedValue.value ??
      selectedValue.label ??
      selectedValue.rowQuestion ??
      selectedValue.question ??
      '—'
    );
  }

  return selectedValue;
};

const buildShareSummary = (survey, responses, stats) => {
  const lines = [
    `Survey: ${survey?.surveyTitle ?? 'Untitled survey'}`,
    `Total responses: ${stats.totalResponses}`,
    `Average time spent: ${stats.avgTimeSpent}`,
    `Unique participants: ${stats.uniqueParticipants}`,
    `Recent submissions: ${stats.recentSubmissions}`,
    '',
    'Latest participants:',
  ];

  responses.slice(0, 5).forEach((resp, index) => {
    lines.push(
      `${index + 1}. ${resp.userName || 'Anonymous'} · ${resp.userEmail || 'No email'} · ${dayjs(resp.createdAt).format(
        'MMM D, YYYY h:mm A',
      )} · ${resp.userTimeSpent || 'N/A'}`,
    );
  });

  if (responses.length > 5) {
    lines.push(`…and ${responses.length - 5} more responses`);
  }

  return lines.join('\n');
};

const ResponseDashboard = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ recipient: '', note: '' });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResponses: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [stats, setStats] = useState(defaultStats);

  const fetchResponsesPage = async (pageNumber = 1, { useGlobalLoader = false } = {}) => {
    if (useGlobalLoader) {
      setIsLoading(true);
    } else {
      setPageLoading(true);
    }
    setError('');
    try {
      await refreshToken();
      const { data } = await axiosWithAuth.get(
        `${backendUrl}/api/survey/get-user-response-paginated/${surveyId}?page=${pageNumber}`,
      );

      setSurvey((prev) => ({
        ...(prev || {}),
        surveyTitle: data.surveyTitle ?? prev?.surveyTitle,
        surveyStatus: data.surveyStatus ?? prev?.surveyStatus,
      }));

      const sanitizedResponses = Array.isArray(data.responses)
        ? data.responses.map((resp) => ({
            ...resp,
            userResponse: Array.isArray(resp.userResponse)
              ? resp.userResponse
              : typeof resp.userResponse === 'string'
              ? JSON.parse(resp.userResponse || '[]')
              : [],
          }))
        : [];

      setResponses(sanitizedResponses);
      setFilteredResponses(sanitizedResponses);
      setPagination(
        data.pagination || {
          page: pageNumber,
          limit: 10,
          totalPages: 1,
          totalResponses: sanitizedResponses.length,
          hasNext: false,
          hasPrev: false,
        },
      );
      const apiStats = data.stats || {};
      setStats({
        totalResponses: apiStats.totalResponses ?? sanitizedResponses.length,
        avgTimeSpent: apiStats.avgTimeSpent ?? defaultStats.avgTimeSpent,
        uniqueParticipants: apiStats.uniqueParticipants ?? sanitizedResponses.length,
        recentSubmissions: apiStats.recentSubmissions ?? 0,
        lastResponseAt: apiStats.lastResponseAt ? dayjs(apiStats.lastResponseAt).fromNow() : defaultStats.lastResponseAt,
      });
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        localStorage.removeItem('dubaiAnalytica-userAccess');
        navigate('/login');
        return;
      }
      setError('Unable to load survey responses. Please try again.');
    } finally {
      if (useGlobalLoader) {
        setIsLoading(false);
      } else {
        setPageLoading(false);
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setError('');
      try {
        await refreshToken();
        const user = JSON.parse(localStorage.getItem('dubaiAnalytica-userAccess'));
        let subscribed = false;
        if (user?.id) {
          try {
            const memberRes = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user-promember/${user.id}`);
            const now = Math.floor(Date.now() / 1000);
            if (memberRes?.data?.subscriptionPeriodEnd && memberRes.data.subscriptionPeriodEnd > now) {
              subscribed = true;
            }
          } catch (memberErr) {
            console.warn('Unable to fetch subscription details', memberErr);
          }
        }
        setIsSubscribed(subscribed);
        if (!subscribed) {
          setAccessDenied(true);
          setIsLoading(false);
          return;
        }
        setAccessDenied(false);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401) {
          localStorage.removeItem('dubaiAnalytica-userAccess');
          navigate('/login');
          return;
        }
        setError('Unable to determine subscription status.');
        setIsLoading(false);
        return;
      }

      await fetchResponsesPage(1, { useGlobalLoader: true });
    };

    initialize();
  }, [surveyId, navigate]);

  useEffect(() => {
    const lowerSearch = searchTerm.trim().toLowerCase();
    const filtered = responses.filter((resp) => {
      const matchesSearch =
        !lowerSearch ||
        resp.userName?.toLowerCase().includes(lowerSearch) ||
        resp.userEmail?.toLowerCase().includes(lowerSearch) ||
        resp.userResponse?.some(
          (answer) =>
            answer?.question?.toLowerCase().includes(lowerSearch) ||
            normalizeAnswer(answer?.selectedValue).toLowerCase().includes(lowerSearch),
        );

      if (!matchesSearch) return false;

      switch (activeFilter) {
        case 'identified':
          return resp.userEmail && resp.userEmail !== 'Anonymous';
        case 'anonymous':
          return !resp.userEmail || resp.userEmail === 'Anonymous';
        case 'recent':
          return dayjs(resp.createdAt).isAfter(dayjs().subtract(7, 'day'));
        default:
          return true;
      }
    });

    setFilteredResponses(filtered);
  }, [responses, searchTerm, activeFilter]);

  const handleSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleExport = async (type) => {
    if (!stats.totalResponses) {
      handleSnackbar('No responses available to export.', 'warning');
      return;
    }

    try {
      setExporting(type);
      await refreshToken();
      const allResponsesRes = await axiosWithAuth.get(
        `${backendUrl}/api/survey/get-all-user-response/${surveyId}/${isSubscribed}`,
      );
      const allResponses = Array.isArray(allResponsesRes.data) ? allResponsesRes.data : [];

      if (!allResponses.length) {
        handleSnackbar('No responses available to export.', 'warning');
        setExporting(null);
        return;
      }

      const endpoint = type === 'answers' ? 'export-to-excel' : 'export-to-excel-index';
      const response = await axiosWithAuth.post(`${backendUrl}/api/excel/${endpoint}`, allResponses, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${survey?.surveyTitle || 'survey'}-${type}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      handleSnackbar('Export ready! Check your downloads folder.', 'success');
    } catch (err) {
      console.error(err);
      handleSnackbar('Unable to export responses right now.', 'error');
    } finally {
      setExporting(null);
    }
  };

  const handleCopySummary = async () => {
    try {
      const summary = buildShareSummary(survey, responses, stats);
      await navigator.clipboard.writeText(summary);
      handleSnackbar('Summary copied to clipboard.', 'success');
    } catch (err) {
      console.error(err);
      handleSnackbar('Unable to copy summary. Please try again.', 'error');
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.recipient) {
      handleSnackbar('Please add a recipient email first.', 'warning');
      return;
    }

    try {
      setPageLoading(true);
      await refreshToken();
      
      // Call the backend endpoint to generate Excel and send email
      const response = await axiosWithAuth.post(
        `${backendUrl}/api/send-email/send-survey-excel`,
        {
          surveyId: surveyId,
          recipientEmail: emailForm.recipient,
          note: emailForm.note || '',
          isSubscribed: isSubscribed,
        }
      );

      setEmailDialogOpen(false);
      setEmailForm({ recipient: '', note: '' });
      handleSnackbar('Email sent successfully with Excel attachment!', 'success');
    } catch (err) {
      console.error('Error sending email:', err);
      if (err?.response?.status === 401) {
        localStorage.removeItem('dubaiAnalytica-userAccess');
        navigate('/login');
      } else {
        const errorMessage = err?.response?.data?.message 
          ? String(err.response.data.message)
          : err?.message 
          ? String(err.message)
          : 'Failed to send email. Please try again.';
        handleSnackbar(errorMessage, 'error');
      }
    } finally {
      setPageLoading(false);
    }
  };

  const handlePageChange = (_, value) => {
    if (accessDenied) return;
    if (value === pagination.page) return;
    fetchResponsesPage(value);
  };

  const renderResponseAnswers = (response) => {
    if (!Array.isArray(response.userResponse) || !response.userResponse.length) {
      return <Typography color="text.secondary">Participant skipped questions.</Typography>;
    }

    return response.userResponse.map((answer, idx) => (
      <Box key={`${response.id}-answer-${idx}`} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" color="text.secondary">
          {answer.question || `Question ${idx + 1}`}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {normalizeAnswer(answer.selectedValue)}
        </Typography>
      </Box>
    ));
  };

  const emptyState = !stats.totalResponses && !isLoading;
  const visibleRangeStart =
    pagination.totalResponses > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const visibleRangeEnd =
    pagination.totalResponses > 0
      ? Math.min(pagination.page * pagination.limit, pagination.totalResponses)
      : 0;

  if (accessDenied) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ bgcolor: '#f4f7fb', minHeight: '100vh', py: 6 }}>
          <Container maxWidth="sm">
            <Paper elevation={0} sx={{ p: 5, borderRadius: 4, textAlign: 'center' }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Upgrade Required
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Response analytics are available to Dubai Analytica Pro members. Upgrade to unlock detailed dashboards,
                exports, and advanced sharing options.
              </Typography>
              <Stack spacing={2}>
                <Button variant="contained" size="large" onClick={() => navigate('/pricing')}>
                  See Pricing Plans
                </Button>
                <Button variant="text" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
              </Stack>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: '#f4f7fb', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Response Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {survey?.surveyTitle || 'Loading survey…'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip label={`Survey ID: ${surveyId}`} variant="outlined" />
              <Chip color={isSubscribed ? 'success' : 'warning'} label={isSubscribed ? 'Premium' : 'Free plan'} />
              <Chip color="primary" label={`${responses.length} responses`} />
            </Stack>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: 'primary.main', color: '#fff' }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <BarChartIcon />
                      <Box>
                        <Typography variant="body2" color="primary.100">
                          Total responses
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {stats.totalResponses}
                        </Typography>
                        <Typography variant="caption" color="primary.100">
                          Last response {stats.lastResponseAt}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <AccessTimeIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Avg. time spent
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {stats.avgTimeSpent}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <PeopleAltIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Unique participants
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {stats.uniqueParticipants}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <TimelineIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last 24h submissions
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {stats.recentSubmissions}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems={{ md: 'center' }} justifyContent="space-between">
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<RefreshIcon />}
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FileDownloadOutlinedIcon />}
                      onClick={() => handleExport('answers')}
                      disabled={exporting === 'index'}
                    >
                      {exporting === 'answers' ? 'Preparing…' : 'Download answers'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<FileDownloadOutlinedIcon />}
                      onClick={() => handleExport('index')}
                      disabled={exporting === 'answers'}
                    >
                      {exporting === 'index' ? 'Preparing…' : 'Download index'}
                    </Button>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Copy summary to clipboard">
                      <span>
                        <IconButton color="primary" onClick={handleCopySummary} disabled={!responses.length}>
                          <ContentCopyIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Share summary via email">
                      <span>
                        <IconButton
                          color="primary"
                          onClick={() => setEmailDialogOpen(true)}
                          disabled={!responses.length}
                        >
                          <EmailOutlinedIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Share summary via your email client">
                      <span>
                        <IconButton color="primary" onClick={handleCopySummary} disabled={!responses.length}>
                          <ShareIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Paper>

              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                  <TextField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by participant, email, or answer"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <FilterListIcon color="action" />
                    {filters.map((filter) => (
                      <Chip
                        key={filter.id}
                        label={filter.label}
                        color={activeFilter === filter.id ? 'primary' : 'default'}
                        onClick={() => setActiveFilter(filter.id)}
                        variant={activeFilter === filter.id ? 'filled' : 'outlined'}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Paper>

              {emptyState ? (
                <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    No responses yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Share your survey to start collecting responses. This dashboard updates in real-time as data arrives.
                  </Typography>
                  <Button variant="contained" onClick={() => navigate('/dashboard')}>
                    Go back to Dashboard
                  </Button>
                </Paper>
              ) : (
                <Stack spacing={2}>
                  {pageLoading && (
                    <Box display="flex" justifyContent="center" my={2}>
                      <CircularProgress size={32} />
                    </Box>
                  )}
                  {filteredResponses.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="subtitle1">
                        No responses match your current filters. Try adjusting them.
                      </Typography>
                    </Paper>
                  ) : (
                    filteredResponses.map((response, index) => (
                      <Accordion key={response.id} defaultExpanded={index === 0} sx={{ borderRadius: 3 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            alignItems={{ md: 'center' }}
                            width="100%"
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar>
                                {(response.userName || 'Anonymous')
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle1">
                                  {response.userName || 'Anonymous participant'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {response.userEmail && response.userEmail !== 'Anonymous'
                                    ? response.userEmail
                                    : 'No email provided'}
                                </Typography>
                              </Box>
                            </Stack>
                            <Stack
                              direction={{ xs: 'column', md: 'row' }}
                              spacing={2}
                              alignItems={{ md: 'center' }}
                              justifyContent="space-between"
                              flex={1}
                            >
                              <Chip label={response.userTimeSpent || 'Time N/A'} variant="outlined" />
                              <Chip
                                label={dayjs(response.createdAt).format('MMM D, YYYY h:mm A')}
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={response.ipAddress || 'IP hidden'}
                                variant="outlined"
                                sx={{ display: { xs: 'none', md: 'inline-flex' } }}
                              />
                            </Stack>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Participant info
                                </Typography>
                                <Stack spacing={1}>
                                  <Typography variant="body2">
                                    Email: {response.userEmail && response.userEmail !== 'Anonymous' ? response.userEmail : '—'}
                                  </Typography>
                                  <Typography variant="body2">
                                    IP Address: {response.ipAddress || 'Hidden'}
                                  </Typography>
                                  <Typography variant="body2">
                                    Introduction shown: {response.introduction ? 'Yes' : 'No'}
                                  </Typography>
                                </Stack>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} md={8}>
                              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Answers
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {renderResponseAnswers(response)}
                              </Paper>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  )}
                  {pagination.totalPages > 1 && (
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={2}
                      mt={2}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Showing {visibleRangeStart}-{visibleRangeEnd} of {pagination.totalResponses} responses
                      </Typography>
                      <Pagination
                        count={pagination.totalPages}
                        page={pagination.page}
                        color="primary"
                        onChange={handlePageChange}
                        showFirstButton
                        showLastButton
                      />
                    </Box>
                  )}
                </Stack>
              )}
            </>
          )}
        </Container>
      </Box>

      <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share responses via email</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Recipient email"
            type="email"
            fullWidth
            value={emailForm.recipient}
            onChange={(e) => setEmailForm((prev) => ({ ...prev, recipient: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Add a personal note (optional)"
            multiline
            minRows={3}
            fullWidth
            value={emailForm.note}
            onChange={(e) => setEmailForm((prev) => ({ ...prev, note: e.target.value }))}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            We will open your default email client with a pre-filled summary. Attachments are not added automatically.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
          <Button startIcon={<EmailOutlinedIcon />} variant="contained" onClick={handleSendEmail}>
            Compose email
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ResponseDashboard;