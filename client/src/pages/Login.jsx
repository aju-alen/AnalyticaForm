import React,{useState} from 'react';
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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { axiosWithCredentials } from '../utils/customAxios';
import { errorHandler } from '../utils/errorHandler';
import { backendUrl } from '../utils/backendUrl';
import { Oval } from 'react-loader-spinner';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [alertColor, setAlertColor] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason !== 'clickaway') setOpen(false);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      const data = new FormData(event.currentTarget);
      const resp = await axiosWithCredentials.post(`${backendUrl}/api/auth/login`, {
        email: data.get('email'),
        password: data.get('password'),
      });
      setAlertMessage(resp.data.message);
      setAlertColor('success');
      handleClick();
      localStorage.setItem('userAccessToken', JSON.stringify(resp.data));
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      errorHandler(error, setAlertMessage, setAlertColor, handleClick);
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const resp = await axiosWithCredentials.post(`${backendUrl}/api/auth/google-login`, { token });
      setAlertMessage(resp.data.message);
      setAlertColor('success');
      handleClick();
      localStorage.setItem('userAccessToken', JSON.stringify(resp.data));
      navigate('/dashboard');
    } catch (error) {
      errorHandler(error, setAlertMessage, setAlertColor, handleClick);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Login</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus/>
            <Grid container spacing={2}  sx={{
              position: 'relative',
            }} >
            <Grid item xs={12}>
            <TextField margin="normal" required fullWidth name="password" label="Password" type={showPassword? "text":"password"} id="password" autoComplete="current-password" />
            </Grid>  
            <Grid item xs={1} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 20,
                top: 25,
              }}>
                <Button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </Button>
                </Grid>
            </Grid>
            <FormControlLabel control={<Checkbox value="remember" color="primary" />
          
          }
            
            label="Remember me" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ?  <Oval
                visible={true}
                height="30"
                width="20"
                color="#fff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />: 'Login'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forget-password" variant="body2">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">{"Don't have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alertColor} variant="filled" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
