import { useState } from 'react';
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
import axios from 'axios';
import { backendUrl } from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const defaultTheme = createTheme();

export default function Register() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('');

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
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

  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      const registerForm = {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        email: data.get('email'),
        password: data.get('password'),
        receiveMarketingEmails: checked
      };

      console.log(registerForm);
      const resp = await axios.post(`${backendUrl}/api/auth/register`, registerForm);
      console.log(resp.data.message);
      handleClick();
      setAlertMessage(resp.data.message);
      setAlertColor('success');
      setTimeout(() => {
        // navigate('/login')

      }, 3000);


    } catch (err) {
      console.log(err.response.data.message);
      handleClick();
      setAlertMessage(err.response.data.message);
      setAlertColor('error');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <HomeNavBar />
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
       
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Checkbox 
                   name ="receiveMarketingEmails" 
                   checked={checked}
                    color="primary"
                    onChange={handleChange}
                    />
                    <label > I want to receive inspiration, marketing promotions and updates via email.</label>
              
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
           
            Sign Up
          </Button>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              justifyContent: 'center',
              
            }}
            >
          {/* <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_LOGIN_CLIENT_ID}>
                <div >
                  
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                  />
                </div>
              </GoogleOAuthProvider> */}
              </Box>
          <Grid  container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    </ThemeProvider>
  );
}