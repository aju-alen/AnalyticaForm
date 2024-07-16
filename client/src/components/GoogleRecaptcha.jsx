import React,{ useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { uid } from 'uid';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import ReCAPTCHA from 'react-google-recaptcha';



const GoogleRecaptcha = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext,onSaveIndicator }) => {
    const [formData, setFormData] = useState({
        id: id,
        question: '',
        formMandate: false,
        options: [
          { id: uid(5), value: '' },
          { id: uid(5), value: '' }
    
        ],
        selectedValue: [{ question: '', answer: '', value: '', index: '' }],
        formType: 'GoogleRecaptchaForm'
      });

      const [recaptchaValue, setRecaptchaValue] = useState(null);

      const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
        onVerify(value); // Call the parent component's verification function
      };

      const handleSaveForm = () => {
        console.log('save handleSaveForm');
        onSaveForm(formData);
        onHandleNext()
      }

      useEffect(() => {
        // console.log(data,'data in select one choice form');
        if (options) {
          setFormData(data)
        }
        else {
          setFormData({ ...formData, id })
        }
      }, [data])
      // console.log(id,'id in select one choice form');
      console.log(formData, 'google Recaptcha in select one choice form');
  return (
    <ThemeProvider theme={theme}>
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{
           bgcolor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexGrow: 1,
  height: "100%",
  mt: { xs: 4, md: 8 },
  width: '100%',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)', // Updated box shadow for a subtle effect
  borderRadius: 8, // Increased border radius for rounded corners
  p: 3, // Increased padding for inner content
  overflowX: 'auto',
  border: '2px solid #f0f0f0', // Added border for more distinction
  transition: 'box-shadow 0.3s ease-in-out', // Added transition effect for box shadow
  '&:hover': {
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.3)', // Updated box shadow on hover
  },
        }} >
           <ReCAPTCHA
        sitekey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY} // Replace with your site key
        onChange={handleRecaptchaChange}
      />
        </Box>
        </Container>
        </React.Fragment>
        </ThemeProvider>

  )
}

export default GoogleRecaptcha