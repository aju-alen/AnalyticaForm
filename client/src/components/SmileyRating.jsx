import React, { useState, useEffect } from 'react'
import { uid } from 'uid'
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material/styles';


const iconMapping = {
  SentimentVeryDissatisfiedIcon: <SentimentVeryDissatisfiedIcon
    fontSize='large'
    color='error'
    sx={{ fontSize: 190, ":hover": { backgroundColor: '#99FFDF' },  borderRadius: 3, p: 1 }}
    
  />,

  SentimentDissatisfiedIcon: <SentimentDissatisfiedIcon fontSize='large'
    color='warning'
    sx={{ fontSize: 190, ":hover": { backgroundColor: '#99FFDF' }, borderRadius: 3, p: 1 }}
  />,

  SentimentSatisfiedIcon: <SentimentSatisfiedIcon fontSize='large'
    sx={{ fontSize: 190, color: '#FFFF2B', ":hover": { backgroundColor: '#99FFDF' }, borderRadius: 3, p: 1 }} />,

  SentimentSatisfiedAltIcon: <SentimentSatisfiedAltIcon fontSize='large'
    sx={{ fontSize: 190, color: 'yellowgreen', ":hover": { backgroundColor: '#99FFDF' }, borderRadius: 3, p: 1 }}
  />,

  SentimentVerySatisfiedIcon: <SentimentVerySatisfiedIcon fontSize='large'
    color='success'
    sx={{ fontSize: 190, ":hover": { backgroundColor: '#99FFDF' }, borderRadius: 3, p: 1 }}
  />,
};



const SmileyRating = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {

  
const [value, setValue] = React.useState(false);
  const [formData, setFormData] = useState({
    id: id,
    question: '',
    formMandate: false,
    options: [
      { id: uid(5), value: '1',icon:"VD", label: 'Very Dissatisfied' },

      { id: uid(5), value: '2',icon:"DD", label: 'Dissatisfied' },

      { id: uid(5), value: '3',icon:"NN", label: 'Neutral' },

      { id: uid(5), value: '4',icon:"SS", label: 'Satisfied' },
      { id: uid(5), value: '5',icon:"VS", label: 'Very Satisfied' },

    ],
    selectedValue: [{ question: '', answer: '', value: '', index: '' }],
    formType: 'SmileyRatingForm'
  });
  const [debouncedValue, setDebouncedValue] = useState('');

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedValue(formData);
  //     onSaveForm(formData);
  //     // onSaveIndicator('Saved')
  //   }, 1000); // 500ms delay

  //   // Cleanup function to cancel the timeout if value changes before delay
  //   return () => {
  //     // onSaveIndicator('Not Saaved')
  //     clearTimeout(handler);
  //   };
  // }, [formData]);

  const handleSaveForm = () => {
    console.log('save handleSaveForm');
    onSaveForm(formData);
    onHandleNext()
  }

  // const handleMandateForm = () => {
  //   console.log('mandate handleMandateForm');
  //   setFormData({ ...formData, formMandate: true })
  // }

  useEffect(() => {
    // console.log(data,'data in select one choice form');
    if (options) {
      setFormData(data)
    }
    else {
      setFormData({ ...formData, id })
    }
  }, [data])
  // console.log(id,'id in smiley rating');
  console.log(formData, 'formData in smiley rating');

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
            <TextField fullWidth id="standard-basic" label={!disableText ? "Insert input" : ''} variant="standard" name='question' value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              InputProps={{
                readOnly: disableText,
              }}
            />
         

             <Stack spacing={2} direction='row'>
{formData.options.map((option) => (
                <Stack  spacing={2} key={option.id}>
                  <Button 
                  onClick={() => {
                    setFormData({ ...formData, selectedValue: [{ question: formData.question, answer: option.label, value: option.label }] })
                    setValue(true)
                }
                }
                  disabled={!disableText}
                  >
                    { option.icon === 'VD' ? iconMapping.SentimentVeryDissatisfiedIcon : option.icon === 'DD' ? iconMapping.SentimentDissatisfiedIcon : option.icon === 'NN' ? iconMapping.SentimentSatisfiedIcon : option.icon === 'SS' ? iconMapping.SentimentSatisfiedAltIcon : iconMapping.SentimentVerySatisfiedIcon}
                 </Button>
                  <TextField fullWidth id="standard-basic"  variant="standard" name='question' value={option.label} onChange={(e) => setFormData({ ...formData, options: formData.options.map((item) => item.id === option.id ? { ...item, label: e.target.value } : item) })}
                    InputProps={{
                      readOnly: disableText,
                    }}
                  />
                  </Stack>
                ))}
            </Stack>
            <Stack spacing={2} direction='row'>
              <Button
                variant='contained'
                color="success"
                onClick={handleSaveForm}>
                {!disableButtons ? 'Save This Form' : 'Next Question'}
              </Button>
              {/* {!disableButtons && <Button
              variant='contained'
              color="primary"
              onClick={handleMandateForm}>
               Mandate This Form
            </Button>} */}
            </Stack>
          </Box>
        </Container>
      </React.Fragment>
    </ThemeProvider>


  );
}

export default SmileyRating