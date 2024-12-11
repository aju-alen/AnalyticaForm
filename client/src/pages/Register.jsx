import { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import { backendUrl } from '../utils/backendUrl';
import { Oval } from 'react-loader-spinner'

const defaultTheme = createTheme();

export default function Register() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);

  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertColor, setAlertColor] = useState('');
  const [loading, setLoading] = useState(false);

  // Form errors
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

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
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');

    // Validation logic
    const errors = {
      firstName: firstName ? '' : 'First name is required.',
      lastName: lastName ? '' : 'Last name is required.',
      email: email && /\S+@\S+\.\S+/.test(email) ? '' : 'A valid email is required.',
      password: password && password.length >= 6 ? '' : 'Password must be at least 6 characters.',
    };
    setFormErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some((error) => error)) {
      handleClick();
      setAlertMessage('Please fix the errors in the form.');
      setAlertColor('error');
      return;
    }

    try {
      setLoading(true);
      const registerForm = {
        firstName,
        lastName,
        email,
        password,
        receiveMarketingEmails: checked,
      };

      const resp = await axios.post(`${backendUrl}/api/auth/register`, registerForm);
      setLoading(false);
      handleClick();
      setAlertMessage(resp.data.message);
      setAlertColor('success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setLoading(false);
      handleClick();
      setAlertMessage(err.response?.data?.message || 'An error occurred.');
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
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
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
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
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
                  error={!!formErrors.email}
                  helperText={formErrors.email}
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
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? (
                <Oval
                visible={true}
                height="30"
                width="20"
                color="#fff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
              ) : 'Sign Up'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {open && (
          <Alert onClose={handleClose} severity={alertColor} variant="filled" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        )}
      </Container>
    </ThemeProvider>
  );
}
