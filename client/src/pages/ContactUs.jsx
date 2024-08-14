import React, { useState,useEffect } from 'react'
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { Container, FormControl, InputLabel, MenuItem, Paper, Select, Stack } from '@mui/material'
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';

const ContactUs = () => {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState('success');
  const [alertText, setAlertText] = useState('');
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    message: '',
    contact: '',
  });
  useEffect(() => {

    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/66bae8bb0cca4f8a7a7538b5/1i551q806';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
  }, []);
  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }
  const handleSubmitContact = async () => {
    try {
      await refreshToken();
      const surveyResp = await axiosWithAuth.post(`${backendUrl}/api/send-email/contact-us`, formData);
      setOpen(true);
      setAlertStatus('success');
      setAlertText('Message Sent Successfully');
    } catch (error) {
      console.log(error);
      setOpen(true);
      setAlertStatus('error');
      setAlertText('Message Sent Failed, Try again later');
    }
  }

  console.log(formData);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minWidth: 100, }} className='p-20'>
        <Typography variant='h2' color='#1976d2' gutterBottom>
          Contact Us
        </Typography>
        <Divider variant='middle' sx={{
          // backgroundColor: '#1976d2',
          height: 1.5,
        }}  />
        <Container maxWidth='lg'  >
          <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant='h5' color='#1976d2' gutterBottom>
          General Inquiries
          </Typography>
          <Typography variant='p'  gutterBottom>
          United Arab Emirates: +971 58 265 2808
          </Typography>
          <Typography variant='p'  gutterBottom>
          Location: Dubai International Financial Centre
          </Typography>
          <Typography variant='p'  gutterBottom>
          Address: Gate Avenue, Zone D - Level 1 Al Mustaqbal St - Dubai - UAE
          </Typography>
          </Stack>
        </Container>
        <Container maxWidth='md'  >
          <Stack spacing={2} sx={{ mt: 12 }}>
            <Paper elevation={3} sx={{ p: 2,
                width: '100%',
                backgroundImage:'radial-gradient(ellipse 100% 200% at 50% 5%, hsl(210, 100%, 90%), transparent)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover' }}>
                  <Stack spacing={2} direction='row' sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  
                  <Button variant='contained' color='primary'   sx={{
                    fontWeight:'bold',
                  }}>AI Help </Button>
                  <Typography variant='p'  gutterBottom sx={{
                    fontWeight:'300',
                    fontSize: '0.9rem',
                    textDecoration:'line-through',
                    
                  }}>
                  Get in touch with our AI assistant for immediate help 
                  </Typography>
                  <Typography variant='p'  gutterBottom sx={{
                    fontWeight:'300',
                    fontSize: '0.9rem',
                    
                  }}>
                  (Coming Soon)
                  </Typography>
                  </Stack>
              </Paper>
              <Typography variant='p' gutterBottom>
              To have a DA account manager contact you about any queries that you may have, please fill out the following information. We respect your privacy and will only use this information to contact you regarding your specific request and will not share this with any third party.
              </Typography>
              <Paper elevation={3} sx={{ p: 2,
                width: '100%',
               
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover' }}>
                  <Stack spacing={2}  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                     <Typography variant='h5' gutterBottom sx={{
                      fontWeight:'300',
                      fontSize: '1.3rem',
                     }}>
                    Get in Touch with a DA Representative
                    </Typography>
                    <Typography variant='p'  gutterBottom sx={{
                      fontWeight:'300',
                      fontSize: '0.8rem',
                     }}> 
                    Please fill this form, we'll contact you shortly.
                    </Typography>
                    
                 <Container maxWidth='md'>
          <FormControl fullWidth>
            <div className="mt-5">
              <TextField fullWidth
                id="outlined-basic"
                label="Given Name"
                variant="standard"
                name='username'
                value={formData.username}
                onChange={handleFormChange} />
            </div>
            <div className="mt-5">
              <TextField fullWidth
                id="outlined-basic"
                label="Email Address"
                variant="standard"
                name='email'
                value={formData.email}
                onChange={handleFormChange} />
            </div>
            <div className="mt-5">
              <TextField fullWidth
                id="outlined-basic"
                label="Your Message"
                variant='filled'
                name='message'
                value={formData.message}
                multiline
                rows={4}
                onChange={handleFormChange} />
            </div>
            <div className="mt-5">
              <TextField fullWidth
                id="outlined-basic"
                label="Contact Number"
                variant="standard"
                name='contact'
                value={formData.contact}
                onChange={handleFormChange} />
            </div>

            <Button 
             variant="contained"
             onClick={handleSubmitContact}
             sx={{ mt: 3, mb: 2, width: '30%' }}
             >
              Send Message
            </Button>
          </FormControl>
        </Container>
                 
                  </Stack>
              </Paper>
            </Stack>
            </Container>
       
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={alertStatus}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertText}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

export default ContactUs


