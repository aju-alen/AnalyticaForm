import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import Radio from '@mui/material/Radio';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { uid } from 'uid';
import FormatBoldIcon from '@mui/icons-material/FormatBold';





const SelectSingleRadio = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext,onSaveIndicator,onSetLoading }) => {
  const [isBold, setIsBold] = useState(false);
  const [formData, setFormData] = useState({
    id: id,
    question: '',
    formMandate: false,
    options: [
      { id: uid(5), value: '' },
      { id: uid(5), value: '' }

    ],
    selectedValue: [{ question: '', answer: '', value: '', index: '' }],
    formType: 'SinglePointForm'
  });

  const [debouncedValue, setDebouncedValue] = useState('');
  const [boldFields, setBoldFields] = useState(new Set());

  useEffect(() => {
    
    const handler = setTimeout(() => {
      onSetLoading(false)
      setDebouncedValue(formData);
      onSaveForm(formData);
      // onSaveIndicator('Saved')
    }, 2000); // 500ms delay
    onSetLoading(true)
    // Cleanup function to cancel the timeout if value changes before delay
    return () => {
      // onSaveIndicator('Not Saaved')
      clearTimeout(handler);
    };
  }, [formData]);

  const handleAddOptions = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: uid(5), value: '' }]
    })
  }

  const handleDeleteOptions = (id) => {
    // console.log(id,'id in delete');
    const newOptions = formData.options.filter(option => option.id !== id);
    // console.log(newOptions,'newOptions');
    setFormData({ ...formData, options: newOptions });
  }

  const handleSaveForm = () => {
    console.log('save handleSaveForm');
    onSaveForm(formData);
    onHandleNext()
  }

  const handleMandateForm = () => {
    console.log('mandate handleMandateForm');
    setFormData({ ...formData, formMandate: true })
  }

  const handleRadioChange = (id) => {
    const newOptions = formData.options.map((option, idx) => {
      if (option.id === id) {

        setFormData({ ...formData, selectedValue: [{ answer: option.value, question: formData.question, index: idx + 1 }] })

      }
    })
  }

  const handleBoldToggle = (id) => {
    const newBoldFields = new Set(boldFields);
    if (newBoldFields.has(id)) {
      newBoldFields.delete(id);
    } else {
      newBoldFields.add(id);
    }
    setBoldFields(newBoldFields);
  };

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
  console.log(formData, 'formData in select one choice form');
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
  p: { xs: 1, sm: 2 },
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
  mx: 'auto',
}}>
          <Box sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            '&:hover .format-button': {
              visibility: 'visible',
            },
          }}>
            <TextField 
              fullWidth 
              multiline 
              id="standard-basic" 
              label={!disableText ? "Insert input" : ''} 
              variant='standard' 
              size='small' 
              required 
              name='question' 
              value={formData.question}
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '1.3rem',
                  fontWeight: boldFields.has('question') ? 'bold' : 'normal',
                }
              }}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              InputProps={{
                readOnly: disableText,
              }}
            />
            {!disableButtons && (
              <Button
                className="format-button"
                color="primary"
                variant="text"
                sx={{
                  position: 'absolute',
                  right: 0,
                  visibility: 'hidden',
                  transition: 'visibility 0.1s ease-in-out',
                  minWidth: '40px'
                }}
                onClick={() => handleBoldToggle('question')}
              >
                <FormatBoldIcon 
                  fontSize="small"
                  sx={{ 
                    color: boldFields.has('question') ? 'primary.main' : 'text.secondary'
                  }}
                />
              </Button>
            )}
          </Box>
          {/* <Button 
          onClick={() => setIsBold(!isBold)}
          >
            Bold
          </Button> */}

          <Stack spacing={1} sx={{
            width: { xs: '100%', sm: '80%', md: '60%' },
            marginRight: 'auto',
            mt: { xs: 2, sm: 3 },
          }} >
            {formData.options.map((option) => (
             <Stack direction="row" spacing={2} key={option.id}>
              
             <Radio
               disabled={disableForm}
               onChange={() => handleRadioChange(option.id)}
               checked={formData.selectedValue[0].answer === option.value} 
               />
               <Box
               sx={{
                 position: 'relative',
                 display: 'flex',
                 alignItems: 'center',
                 width: '100%',
                 '&:hover .delete-button': {
                   visibility: 'visible',
                 },
                 '&:hover .format-button': {
                   visibility: 'visible',
                 },
               }}
             >
               <TextField
  fullWidth
  multiline
  id="standard-basic"
  placeholder={!disableText ? "Type Your Response Here" : ''}
  variant="standard"
  name={option.text}
  value={option.value}
  sx={{
    '& .MuiInputBase-root': {
      fontSize: '0.9rem',
      fontWeight: boldFields.has(option.id) ? 'bold' : 'normal',
    },
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
    },
    // '& .MuiInput-underline:after': {
    //   borderBottom: 'none',
    // },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
  }}
  onChange={(e) => {
    const newOptions = formData.options.map((opt) => {
      if (opt.id === option.id) {
        return { ...opt, value: e.target.value };
      }
      return opt;
    });
    setFormData({ ...formData, options: newOptions });
  }}
  InputProps={{
    readOnly: disableText,
  }}
/>
               {!disableButtons && (
                 <>
                   <Button
                     className="format-button"
                     color="primary"
                     variant="text"
                     sx={{
                       position: 'absolute',
                       right: '40px',
                       visibility: 'hidden',
                       transition: 'visibility 0.1s ease-in-out',
                       minWidth: '40px'
                     }}
                     onClick={() => handleBoldToggle(option.id)}
                   >
                     <FormatBoldIcon 
                       fontSize="small"
                       sx={{ 
                         color: boldFields.has(option.id) ? 'primary.main' : 'text.secondary'
                       }}
                     />
                   </Button>
                   <Button
                     className="delete-button"
                     color="error"
                     variant="text"
                     sx={{
                       position: 'absolute',
                       right: 0,
                       visibility: 'hidden',
                       transition: 'visibility 0.1s ease-in-out',
                     }}
                     onClick={() => handleDeleteOptions(option.id)}
                   >
                     <HighlightOffIcon fontSize="small" />
                   </Button>
                 </>
               )}
             </Box>
             
           </Stack>
            ))
            }
            {!disableButtons && (
              <Button
                sx={{
                  width: { xs: '100%', sm: '30%' },
                  mt: { xs: 1, sm: 2 }
                }}
                onClick={handleAddOptions}
                variant='outlined'
                color="primary"
                size="small"
              >Add new row</Button>
            )}
          </Stack>
          <Stack 
            spacing={{ xs: 1, sm: 2 }}
            direction={{ xs: 'column', sm: 'row' }}
            sx={{
              marginTop: { xs: '0.5rem', sm: '1rem' },
              width: '100%',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
            }}
          >
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

export default SelectSingleRadio

