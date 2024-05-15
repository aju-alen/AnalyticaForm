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



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function ForgetPassword() {
  
  const handleSubmit = async (event) => {

    try{
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const resp = await axios.post(`${backendUrl}/api/auth/forget-password`, {
        email: data.get('email'),
      });
      console.log(resp.data);
    }
    catch(err){
      console.log(err);
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
            >
              Login
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
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}