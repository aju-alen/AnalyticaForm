import { useEffect, useState } from 'react';
import { backendUrl } from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';

const Subscription = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isEligibleForRefund, setIsEligibleForRefund] = useState(false);
  const [daysSinceStart, setDaysSinceStart] = useState(null);
  const [refundStatus, setRefundStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('');
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  const fetchSubscriptionDetails = async () => {
    try {
      await refreshToken();
      const userId = JSON.parse(localStorage.getItem('dubaiAnalytica-userAccess')).id;
      const response = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user-subscription-details/${userId}`);
      
      setSubscriptionData(response.data.subscription);
      setIsEligibleForRefund(response.data.isEligibleForRefund);
      setDaysSinceStart(response.data.daysSinceStart);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching subscription details:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('dubaiAnalytica-userAccess');
        navigate('/login');
      } else {
        setSubscriptionData(null);
        setIsLoading(false);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, currency = 'aed') => {
    if (!amount) return 'N/A';
    const amountInDollars = (amount / 100).toFixed(2);
    const currencySymbol = currency.toUpperCase() === 'AED' ? 'AED' : currency.toUpperCase();
    return `${currencySymbol} ${amountInDollars}`;
  };

  const handleRefundRequest = async () => {
    if (!isEligibleForRefund) {
      setAlertMessage('You are not eligible for a refund. Refunds are only available within 7 days of subscription.');
      setAlertColor('warning');
      setOpen(true);
      return;
    }

    if (window.confirm('Are you sure you want to request a refund? Your membership will be revoked immediately.')) {
      setIsProcessing(true);
      try {
        await refreshToken();
        const response = await axiosWithAuth.post(`${backendUrl}/api/stripe/request-subscription-refund`);
        
        setRefundStatus('success');
        setAlertMessage('Refund request processed successfully. Your membership has been revoked.');
        setAlertColor('success');
        setOpen(true);
        
        // Refresh subscription details
        setTimeout(() => {
          fetchSubscriptionDetails();
        }, 2000);
      } catch (err) {
        console.error('Error processing refund:', err);
        setRefundStatus('error');
        const errorMessage = err.response?.data?.message || 'An error occurred while processing your refund request.';
        setAlertMessage(errorMessage);
        setAlertColor('error');
        setOpen(true);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box component="section" sx={{ p: { md: 3 }, pt: { xs: 2 }, backgroundColor: '#f1f1f1', minHeight: '100vh' }}>
        <Box sx={{ mb: 3, px: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ color: '#333', mb: 2 }}>
            Subscription Management
          </Typography>
        </Box>

        {!subscriptionData ? (
          <Card sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No Active Subscription
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                You don't have an active subscription. Upgrade to a premium plan to access all features.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/pricing')}
              >
                View Pricing Plans
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ color: '#333' }}>
                    Subscription Details
                  </Typography>
                  <Chip
                    label={subscriptionData.isSubscribed ? 'Active' : 'Inactive'}
                    color={subscriptionData.isSubscribed ? 'success' : 'default'}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Subscription Start Date</TableCell>
                        <TableCell>{formatDate(subscriptionData.subscriptionPeriodStart)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Subscription End Date</TableCell>
                        <TableCell>{formatDate(subscriptionData.subscriptionPeriodEnd)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                        <TableCell>{formatAmount(subscriptionData.subscriptionAmmount)}</TableCell>
                      </TableRow>
                     
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Subscription Email</TableCell>
                        <TableCell>{subscriptionData.subscriptionEmail}</TableCell>
                      </TableRow>
                      {daysSinceStart !== null && (
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Days Since Subscription</TableCell>
                          <TableCell>
                            <Chip
                              label={`${daysSinceStart} days`}
                              color={daysSinceStart <= 7 ? 'warning' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {subscriptionData.isSubscribed && (
                  <Box sx={{ mt: 3 }}>
                    {isEligibleForRefund ? (
                      <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          You are eligible for a refund. You can request a full refund within 7 days of your subscription start date.
                          {daysSinceStart !== null && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              You have {7 - daysSinceStart} day(s) remaining to request a refund.
                            </Typography>
                          )}
                        </Alert>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={handleRefundRequest}
                          disabled={isProcessing}
                          sx={{ mt: 2 }}
                        >
                          {isProcessing ? (
                            <>
                              <CircularProgress size={20} sx={{ mr: 1 }} />
                              Processing...
                            </>
                          ) : (
                            'Request Refund'
                          )}
                        </Button>
                      </Box>
                    ) : (
                      <Alert severity="warning">
                        Refund requests are only available within 7 days of subscription start date.
                        {daysSinceStart !== null && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Your subscription started {daysSinceStart} days ago. The refund window has expired.
                          </Typography>
                        )}
                      </Alert>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alertColor} variant="filled" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default Subscription;

