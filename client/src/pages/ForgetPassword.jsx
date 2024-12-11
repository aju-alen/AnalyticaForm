import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../utils/backendUrl';
import { Oval } from 'react-loader-spinner';
import Alert from '@mui/material/Alert';

const defaultTheme = createTheme();

export default function ForgetPassword() {
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason !== 'clickaway') setOpen(false);
  };

  
  const handleSubmit = async (event) => {

    try{
      event.preventDefault();
      setLoading(true);
      const data = new FormData(event.currentTarget);
      const resp = await axios.post(`${backendUrl}/api/auth/forget-password`, {
        email: data.get('email'),
      });
      setLoading(false);
      setAlertMessage(resp.data.message);
      setAlertColor('success');
      handleClick();
    }
    catch(err){
      console.log(err);
      setLoading(false);
      setAlertMessage(err.response.data.message);
      setAlertColor('error');
      handleClick();

    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent:'center',
          }}
        >
        
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password?
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
          
           
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading?(
                 <Oval
                 visible={true}
                 height="30"
                 width="20"
                 color="#fff"
                 ariaLabel="oval-loading"
                 wrapperStyle={{}}
                 wrapperClass=""
                 />
              ):"Login"}
            </Button>
            <Box 
              sx={{ mt: 1 ,
              display: 'flex',
              justifyContent: 'center',}}
             
            >
            {/* <GoogleLogin
              onSuccess={credentialResponse => {
                const decoded = jwtDecode(JSON.stringify(credentialResponse))
                console.log(decoded);
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            /> */}
            </Box>
              <Grid item xs sx={{
                textAlign:'center'
              }}>
                <Link href="/login" variant="body2">
                  Remember Password?
                </Link>
              </Grid>
              {open && (
          <Alert onClose={handleClose} severity={alertColor} variant="filled" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        )}
          </Box>
          
        </Box>
      </Container>
    </ThemeProvider>
  );
}