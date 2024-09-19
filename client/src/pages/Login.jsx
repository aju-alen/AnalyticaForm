import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../utils/backendUrl';
import { jwtDecode } from 'jwt-decode';
import { axiosWithCredentials } from '../utils/customAxios';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const clientId = import.meta.env.VITE_GOOGLE_LOGIN_CLIENT_ID;

export default function Login() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const handleSubmit = async (event) => {

    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const resp = await axiosWithCredentials.post(`${backendUrl}/api/auth/login`, {
        email: data.get('email'),
        password: data.get('password'),
      });
      console.log(resp.data);
      handleClick();
      setAlertMessage(resp.data.message);
      setAlertColor('success');

      localStorage.setItem('userAccessToken', JSON.stringify({ email: resp.data.email, id: resp.data.id, firstName: resp.data.firstName, isAdmin: resp.data.isAdmin, token: resp.data.accessToken, isSuperAdmin: resp.data.isSuperAdmin }));
      navigate('/dashboard');
    }
    catch (err) {
      console.log(err.response.data.message, 'error text');
      handleClick();
      setAlertMessage(err.response.data.message);
      setAlertColor('error');
    }

  };

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log('Google token:', token);

    const resp = await axios.post(`${backendUrl}/api/auth/google-login`, { token });

    console.log('Google login response:', resp.data);

    handleClick();
      setAlertMessage(resp.data.message);
      setAlertColor('success');

      localStorage.setItem('userAccessToken', JSON.stringify({ email: resp.data.email, id: resp.data.userId, firstName: resp.data.firstName, isAdmin: resp.data.isAdmin, token: resp.data.accessToken, isSuperAdmin: resp.data.isSuperAdmin }));
      navigate('/dashboard');

    // You can send the token to your backend server for further processing
    // e.g., axios.post('/api/auth/google', { token });
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Box
              sx={{
                mt: 1,
                display: 'flex',
                justifyContent: 'center',
              }}

            >
             {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_LOGIN_CLIENT_ID}>
                <div>
                  <h1>Google Login</h1>
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                  />
                </div>
              </GoogleOAuthProvider> */}
            </Box>
            <Grid container>
              <Grid item xs>
                <Link href="/forget-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={alertColor}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>

    </ThemeProvider>
  );
}