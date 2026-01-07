import React, { useState, useEffect } from 'react'
import { uid } from 'uid'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { Button, Stack, useTheme, useMediaQuery } from '@mui/material'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Divider from '@mui/material/Divider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const SelectDropdownMenu = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext }) => {

  console.log(disableForm, disableText, disableButtons, 'disableForm, disableText, disableButtons in select one choice form');
  const [formData, setFormData] = useState({
    id: id,
    question: '',
    quilText: '',
    formMandate: false,
    options: [
      { id: uid(5), value: '' },
      { id: uid(5), value: '' }

    ],
    selectedValue: [{ question: '', answer: '', value: '', index: '' }],
    formType: 'SelectDropDownForm'
  });

  const [debouncedValue, setDebouncedValue] = useState('');
  const [age, setAge] = React.useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  
  const toolbarSetting = disableText ? false : {
    container: isMobile && !disableText ? [
      // Mobile toolbar configuration
      ['bold', 'italic', 'underline'],
      ['clean']
      ] :  [
        // Desktop toolbar configuration
        ['bold', 'italic', 'underline', 'strike'],
        ['clean']
      ]
  }
  // Customize toolbar options based on screen size
  const modules = {
    toolbar: toolbarSetting,
    clipboard: {
      matchVisual: false
    }
  };

  // Allowed formats
  const formats = [
    'bold', 'italic', 'underline', 'strike',
  ];

  // Helper function to clean HTML content
  const cleanHTMLContent = (htmlString) => {
    if (!htmlString) return '';
    
    // Create a temporary div
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Get text content and clean up whitespace
    let cleanText = tempDiv.textContent || tempDiv.innerText || '';
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    
    return cleanText;
  };

  // Update the ReactQuill onChange handler
  const handleQuillChange = (content) => {
    setFormData({
      ...formData,
      quilText: content, // Store the HTML formatted text
      question: cleanHTMLContent(content) // Store the clean text
    });
  };
  
  const handleChange = (event) => {
    const selectedIndex = formData.options.findIndex(
      (option) => option.value === event.target.value
    );
  
    setAge(event.target.value);
    setFormData({
      ...formData,
      selectedValue: [
        {
          question: formData.question,
          answer: event.target.value,
          value: '',
          index: selectedIndex + 1, // Adding 1 to make it 1-based index
        },
      ],
    });
  };

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

  // const handleMandateForm = () => {
  //   console.log('mandate handleMandateForm');
  //   setFormData({ ...formData, formMandate: true })
  // }

  useEffect(() => {
    if (options) {
      setFormData(data);
    } else {
      setFormData({ 
        ...formData, 
        id,
        quilText: data?.quilText || '',
        question: data?.question || ''
      });
    }
  }, [data]);
  // console.log(id,'id in select one choice form');
  console.log(formData, 'formData in select one choice form');


  return (

    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
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
          backgroundColor: '#F4F3F6',
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
            backgroundColor: '#F4FFF8',
          },
        }}>
                         <div style={{ marginBottom: '20px', width: '100%' }}>
              {!disableText && (
                <label style={{ 
                  fontSize: '0.75rem', 
                  color: 'rgba(0, 0, 0, 0.6)', 
                  marginBottom: '8px',
                  display: 'block' 
                }}>
                  Insert input *
                </label>
              )}
              <ReactQuill
                theme="snow"
                value={formData.quilText}
                onChange={handleQuillChange}
                readOnly={disableText}
                modules={modules}
                formats={formats}
                className={`ql-container ql-snow`}
                style={{
                  width: '100%',
                  border: '0px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                }}
              />
              <Divider />
            </div>

          <Stack spacing={1} sx={{
           width: { xs: '100%', md: '20%' },
            marginRight: 'auto',
          }}>
            {disableForm && formData.options.map((option) => (
              <Stack direction="row" spacing={2} key={option.id}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    '&:hover .delete-button': {
                      visibility: 'visible',
                    },
                  }}
                >

                  <TextField
                    fullWidth
                    id="standard-basic"
                    placeholder={!disableText ? "Type Your Response Here" : ''}
                    variant="standard"
                    name={option.text}
                    value={option.value}
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
                    onChange={(e) => {
                      const newOptions = formData.options.map((opt) => {
                        if (opt.id === option.id) {
                          return { ...opt, value: e.target.value }
                        }
                        return opt
                      })
                      setFormData({ ...formData, options: newOptions })
                    }}
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

            ))
            }
            {!disableButtons && (
              <Button
                sx={{
                  width: '70%',
                }}
                onClick={handleAddOptions}
                variant='outlined'
                color="primary"
                size="small"
              >Add new row</Button>
            )}
          </Stack>
          {disableButtons && (
            <FormControl fullWidth sx={{ mt: 4 }}>
              <InputLabel id="demo-simple-select-label">Select an option</InputLabel>
              <Select
                 labelId="demo-simple-select-label"
                 id="demo-simple-select"
                 value={age}
                 variant="filled"
                 label="Age"
                 onChange={handleChange}
                 sx={{ width: 'auto' }} // or specify a value like '300px'
              >
                {formData.options.map((option,idx) => (
                  <MenuItem
                    key={option.id}
                    value={option.value}
                    sx={{
                      width: '100%',
                    }}
                  >
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Stack spacing={2} direction='row' sx={{
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

            {disableButtons && <Button
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

export default SelectDropdownMenu