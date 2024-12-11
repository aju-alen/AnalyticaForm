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
import { useNavigate, useParams } from 'react-router-dom';
import { backendUrl } from '../utils/backendUrl';

import axios from 'axios';
import { Oval } from 'react-loader-spinner';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function ResetPassword() {
  const navigate = useNavigate();
  const {resetToken} = useParams()
  console.log(resetToken,'resetToken');
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertColor, setAlertColor] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    password: '',
    retypePassword: '',
  })

  const handleClick = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason !== 'clickaway') setOpen(false);
  };

  
  const handleSubmit = async (event) => {
    try{
      event.preventDefault();
      setLoading(true);
      const resp = await axios.post(`${backendUrl}/api/auth//reset/${resetToken}`, formData);
      setLoading(false);
      setAlertMessage(resp.data.message);
      setAlertColor('success');
      handleClick();
      navigate('/login');
    }
    catch(err){
      console.log(err);
      setLoading(false);
    }
    
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type="password"
              id="password"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Re-type Password"
              value={formData.retypePassword}
              onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
              type="password"
              id="password"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ?(
                 <Oval
                 visible={true}
                 height="30"
                 width="20"
                 color="#fff"
                 ariaLabel="oval-loading"
                 wrapperStyle={{}}
                 wrapperClass=""
                 />
              ): "Reset Password"}
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
            <Grid container>
              
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Remember Password?"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          {open && (
          <Alert onClose={handleClose} severity={alertColor} variant="filled" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}