
import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import theme from '../utils/theme'
import { ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { FormControl } from '@mui/material'
import { axiosWithAuth } from '../utils/customAxios'
import { refreshToken } from '../utils/refreshToken'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import { backendUrl } from '../utils/backendUrl'

const logoStyle = {
  width: '240px',
  height: '120px',
  cursor: 'pointer',
  marginLeft: '114px'
};

const Footer = () => {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    message: '',
    contact: '',
  });
  const [open, setOpen] = useState(false);

  const [alertStatus, setAlertStatus] = useState('success');
  const [alertText, setAlertText] = useState('');

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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
    <Container 
      maxWidth='xl'
      sx={{ 
        // backgroundImage: 'radial-gradient(ellipse 100% 200% at 50% 5%, hsl(210, 100%, 90%), transparent)',
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        backgroundColor:'#E0ECF5',
        color: '#495057', 
      }}
    > 
    <Stack 
      direction={{ xs: 'column', md: 'row' }} 
      spacing={2} 
    >

      <Stack 
        direction="column" 
        spacing={1}
      >
        <Container maxWidth='md'>
        <img
              src="https://i.postimg.cc/hG57FFyC/Untitled-design-1-removebg-preview.png"
              style={logoStyle}
              alt="logo of sitemark"
              onClick={() => navigate('/')}

            />
        <Typography sx={{
          color: '#000',
          fontSize: '0.8rem',
          textAlign: 'justify',
          width: {xs:'80%',md:'70%'},
          marginLeft: {xs:'10px',md:'114px'}
        }}
        align=''
        >
        Dubai Analytica is revolutionising data collection with advanced online survey solutions designed for businesses, researchers, and organisations. Our survey software offers a user-friendly interface, is analytics-enabled, and strong data security, Dubai Analytica enables users to create customized surveys that gather valuable insights efficiently. With pre-built templates, diverse question types, and powerful response analysis, the platform simplifies the process of collecting and interpreting data. Whether you’re seeking customer feedback, conducting market research, or assessing employee satisfaction, Dubai Analytica helps turn survey data into actionable strategies that drive growth and enhance decision-making.
        </Typography>
        <Stack direction='row' spacing={2} sx={{
          marginTop: '40px',
          color: '#000',
          marginLeft: {xs:'10px',md:'114px'}
        }}>
        <Typography fontSize='0.8rem'>
          <Link to='dapp/privacy-policy'>Privacy Policy</Link>
        </Typography>
        <Typography fontSize='0.8rem'>
          <Link to='/terms-of-use'>Terms of Use</Link>
        </Typography>
        </Stack>
        <Typography sx={{
          color: '#000',
          fontSize: '0.8rem',
          marginLeft: {xs:'10px',md:'114px'}
        }}>
          Copyright © 2024 <Link to='/' >Dubai Analytica</Link>
        </Typography>
        </Container>

      </Stack>

      <Container maxWidth='sm' sx={{
      }}>
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
             sx={{ mt: 3,
               mb: 2,
                width: {xs: '100%',md: '30%'} }}
             >
              Send Message
            </Button>
          </FormControl>
        </Container>
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
    </ThemeProvider>
  )
}

export default Footer