import React, { useState, useEffect } from 'react'
import { uid } from 'uid'
import { TextField, CssBaseline, Container, Box, Stack, Radio, Button } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ClearIcon from '@mui/icons-material/Clear';




const EmailAddress = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {
    const [formData, setFormData] = useState({
        id: id,
        question: '',
        formMandate: false,
        options: [
            { question: '', id: uid(5), value: '' },

        ],
        selectedValue: [{ question: '', answer: '', value: '', index: '' }],
        formType: 'EmailAddressForm'
    });

    const [debouncedValue, setDebouncedValue] = useState('');

    const handleAddOptions = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { question: '', id: uid(5), value: '' }],
            selectedValue: [...formData.options, { question: '', answer: '', value: '', index: '' }]
        })
    }



    const handleDeleteOptions = (id) => {
        // console.log(id,'id in delete');
        const newOptions = formData.options.filter(option => option.id !== id);
        const newSelectedValue = formData.selectedValue.filter(option => option.index !== id);
        // console.log(newOptions,'newOptions');
        setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue });
    }

    const handleSaveForm = () => {
        console.log('save handleSaveForm');
        onSaveForm(formData);
        onHandleNext()
    }

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
    console.log(formData, 'formData in comment box form');
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

                        {formData.options.map((option, idx) => {
                            console.log(JSON.stringify(option), 'option.question');

                            return (
                                <div className='w-full'>
                                    <Stack spacing={0} direction='row'>
                                    <Box
               sx={{
                 position: 'relative',
                 display: 'flex',
                 alignItems: 'center',
                 width: '95%',
                 '&:hover .delete-button': {
                   visibility: 'visible',
                 },
               }}
             >
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            label={!disableText ? "Enter Email Address" : ''}
                                            variant="standard"
                                            name='question'
                                            value={option.question}
                                            onChange={(e) => setFormData({
                                                ...formData, options: formData.options.map((item, index) => {
                                                    if (option.id === item.id) {
                                                        return { ...item, question: e.target.value }
                                                    }
                                                    return item
                                                })
                                                ,
                                                selectedValue: formData.options.map((item, index) => {
                                                    if (option.id === item.id) {
                                                        return { ...item, question: e.target.value }
                                                    }
                                                    return item
                                                })
                                            })}
                                            InputProps={{
                                                readOnly: disableText,
                                            }}
                                        />
{!disableButtons && (
                 <Button
                   className="delete-button"
                   color="error"
                   variant="text"
                   sx={{
                     position: 'absolute',
                     left: '100%',
                     visibility: 'hidden',
                     transition: 'visibility 0.1s ease-in-out',

                   }}
                   onClick={() => handleDeleteOptions(option.id)}
                 >
                   <HighlightOffIcon fontSize="small" />
                 </Button>
               )}
               </Box>

                                    </Stack>

                                    <Container
                                        maxWidth='sm'
                                    >
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            placeholder={!disableText ? "Comments" : ''}
                                            variant='filled'
                                            name='question'
                                            value={option.value}
                                            onChange={(e) => setFormData({
                                                ...formData, options: formData.options.map((item, index) => {
                                                    console.log(item, 'item in inner map');
                                                    if (option.id === item.id) {
                                                        return { ...item, value: e.target.value,answer:e.target.value }
                                                    }
                                                    return item
                                                })
                                                ,
                                                selectedValue: formData.options.map((item, index) => {
                                                    console.log(item, 'item in inner map');
                                                    if (option.id === item.id) {
                                                        console.log('when ID is same in inner map');
                                                        return { ...item, answer: e.target.value, index: e.target.value }
                                                    }
                                                    return item
                                                })
                                            })}
                                            InputProps={{
                                                readOnly: !disableText,
                                            }}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                  fontSize: '0.8rem',
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
                                            maxRows={1}
                                            maxWidth='sm'
                                        
                                        />
                                    </Container>
                                </div>
                            )

                        })}
                          {!disableButtons && (
              <Button
                sx={{
                  width: '20%',
                  marginTop: '10px',
                }}
                onClick={handleAddOptions}
                variant='outlined'
                color="primary"
                size="small"
              >Add new row</Button>
            )}
                        <Stack spacing={2} direction='row'  sx={{
                            marginTop: '1rem',
                        }}>
                            {/* {!disableButtons && (
                                <Button
                                    onClick={handleAddOptions}
                                    variant='outlined'
                                    color="primary"
                                    size="small"
                                >Add new row</Button>
                            )} */}

{disableButtons &&  <Button
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

export default EmailAddress
