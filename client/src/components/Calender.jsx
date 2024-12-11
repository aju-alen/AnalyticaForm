import React,{ useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import { uid } from 'uid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const Calender = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext,onSaveIndicator }) => {

    const [formData, setFormData] = useState({
        id: id,
        question: '',
        formMandate: false,
        options: [
          { id: uid(5), value: '' },
          { id: uid(5), value: '' }
    
        ],
        selectedValue: [{ question: '', answer: '', value: '', index: '' }],
        formType: 'CalenderForm'
      });
      const [debouncedValue, setDebouncedValue] = useState('');
      const [value, setValue] = useState(null);
      console.log(value,'value date in calender form');


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(formData);
      onSaveForm(formData);
      // onSaveIndicator('Saved')
    }, 1000); // 500ms delay

    // Cleanup function to cancel the timeout if value changes before delay
    return () => {
      // onSaveIndicator('Not Saaved')
      clearTimeout(handler);
    };
  }, [formData]);

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
  // console.log(id,'id in select one choice form');
  console.log(formData, 'formData in Calender Form');


  return (
    
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='xl'>
      <Box sx={{
  bgcolor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexGrow: 1,
  height: "100%",
  mt: { xs: 4, md: 0 },
  width: '100%',
  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)', // Updated box shadow for a subtle effect
  borderRadius: 2, // Increased border radius for rounded corners
  p: 2, // Increased padding for inner content
  overflowX: 'auto',
  border: '2px solid #f0fbf0', // Added border for more distinction
  transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out', // Added transition effect for box shadow and transform
  position: 'relative', // Make sure the box is positioned relative for the pseudo-element
  backgroundColor:'#F4F3F6',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '0%', // Set initial left position for the line
    transform: 'translateX(-50%)',
    height: '100%',
    width: '12px', // Adjust the width of the line
    bgcolor: '#1976d2', // Change to your desired color
    opacity: 0, // Initially hidden
    transition: 'opacity 0.3s ease-in-out', // Smooth transition for the line
  },
  
  '&:hover::before': {
    opacity: 1, // Make the lines visible on hover
  },
  '&:hover': {
    boxShadow: '0px 1px rgba(0, 0, 0, 0.2)', // Updated box shadow on hover
    transform: 'scale(0.98)', // Slightly scale down the box to create an inward effect
    backgroundColor:'#F4FFF8',
  },
}}>
          <TextField fullWidth id="standard-basic" size='small' label={!disableText ? "Insert input" : ''} variant="standard" name='question' value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            InputProps={{
              readOnly: disableText,
            }}
            multiline
          />
             <LocalizationProvider dateAdapter={AdapterDayjs}>
             <DatePicker value={value} onChange={(newValue) => 
                setFormData({ ...formData, selectedValue: [{ question: formData.question, answer: newValue['$d'], value: newValue, index: '' }], question: formData.question })} 
                disabled={disableForm}

              />
    </LocalizationProvider>
           <Stack spacing={2} direction='row'>
           

           {disableButtons &&<Button
              variant='contained'
              color="success"
              onClick={handleSaveForm}>
               Next Question
            </Button>}
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
  )
}

export default Calender