import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import { refreshToken } from '../utils/refreshToken';
import { getUserAccess, clearUserAccess } from '../utils/userAccess';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState(getUserAccess()?.email || '');
  const [firstName, setFirstName] = useState(getUserAccess()?.firstName || '');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        await refreshToken();
        const { data } = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user`);
        setEmail(data?.email || '');
        setFirstName(data?.firstName || '');
      } catch (err) {
        if (err.response?.status === 401) {
          clearUserAccess();
          navigate('/login');
          return;
        }
        setError(err.response?.data?.message || 'Could not load your profile.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [navigate]);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: '#f1f1f1', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ color: '#333', mb: 3 }}>
            Profile
          </Typography>
          {error ? (
            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          ) : null}
          <Card>
            <CardContent sx={{ p: 3 }}>
              {firstName ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Signed in as {firstName}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Signed in with
                </Typography>
              )}
              <Typography variant="h5" sx={{ fontWeight: 700, wordBreak: 'break-all' }}>
                {email || 'Email not available'}
              </Typography>
            </CardContent>
          </Card>
          <Button onClick={() => navigate('/dashboard')} sx={{ mt: 3 }}>
            Back to dashboard
          </Button>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;
