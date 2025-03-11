import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Stack, useTheme, useMediaQuery } from '@mui/material';
import { uid } from 'uid';
import Rating from '@mui/material/Rating';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';




const StarRating = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSaveIndicator }) => {
    const [formData, setFormData] = useState({
        id: id,
        question: '',
        quilText:'',
        formMandate: false,
        options: [
            { id: '1pgr9', value: '', question: '' },


        ],
        selectedValue: [{ id: '1pgr9', question: '', answer: '', value: '', index: '' }],
        formType: 'StarRatingForm'
    });

    const [debouncedValue, setDebouncedValue] = useState('');

    const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Customize toolbar options based on screen size
  const modules = {
    toolbar: {
      container: isMobile ? [
        // Mobile toolbar configuration
        ['bold', 'italic', 'underline'],
        ['clean']
      ] : [
        // Desktop toolbar configuration
        ['bold', 'italic', 'underline', 'strike'],
        ['clean']
      ],
    },
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
        const id = uid(5)
        setFormData({
            ...formData,
            options: [...formData.options, { id, value: '' }],
            selectedValue: [...formData.selectedValue, { id, question: '', answer: '', value: '', index: '' }]
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
                        p: { xs: 1, sm: 2 }, // Responsive padding
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
                style={{
                  width: '100%',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                }}
              />
            </div>

                        <Stack spacing={{ xs: 2, md: 4 }} sx={{
                            width: { xs: '100%', sm: '80%', md: '60%' },
                            mx: 'auto' // Center the stack
                        }} >
                            {formData.options.map((option) => (
                                <Stack 
                                    direction={{ xs: "column", sm: "row" }} 
                                    spacing={{ xs: 1, sm: 2 }} 
                                    key={option.id}
                                >
                                    <Box sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'flex-start', sm: 'center' },
                                        width: '100%',
                                        gap: { xs: 1, sm: 2 },
                                        '&:hover .delete-button': {
                                            visibility: 'visible',
                                        },
                                    }}>
                                        <TextField
                                            fullWidth
                                            id="standard-basic"
                                            placeholder={!disableText ? "Type Your Response Here" : ''}
                                            variant="standard"
                                            multiline
                                            name={option.text}
                                            value={option.question}
                                            onChange={(e) => {
                                                const newOptions = formData.options.map((opt) => {
                                                    if (opt.id === option.id) {
                                                        return { ...opt, question: e.target.value }
                                                    }
                                                    return opt
                                                })
                                                const newSelectedValue = formData.selectedValue.map((opt) => {
                                                    if (opt.id === option.id) {
                                                        return { ...opt, question: e.target.value }
                                                    }
                                                    return opt
                                                })
                                                setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue })
                                            }}
                                            InputProps={{
                                                readOnly: disableText,
                                            }}
                                            sx={{
                                                width: '100%',
                                                '& .MuiInputBase-root': {
                                                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                                },
                                                '& .MuiInput-underline:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                    borderBottom: 'none',
                                                },
                                            }}
                                        />

                                        <Rating
                                            name="simple-controlled"
                                            value={option.value}
                                            size={window.innerWidth < 600 ? 'medium' : 'large'}
                                            onChange={(event, newValue) => {
                                                const newOptions = formData.options.map((opt) => {
                                                    if (opt.id === option.id) {
                                                        return { ...opt, value: newValue }
                                                    }
                                                    return opt
                                                })
                                                const newSelectedValue = formData.selectedValue.map((opt) => {
                                                    if (opt.id === option.id) {
                                                        return { ...opt, answer: newValue,index:newValue }
                                                    }
                                                    return opt
                                                })
                                                setFormData({ ...formData, options: newOptions, selectedValue: newSelectedValue })
                                            }}
                                            disabled={disableForm}
                                        />




                                        {!disableButtons && (
                                            <Button
                                                className="delete-button"
                                                color="error"
                                                variant="text"
                                                sx={{
                                                    position: { xs: 'static', sm: 'absolute' },
                                                    left: { sm: '100%' },
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
                                        width: { xs: '100%', sm: '40%' },
                                        mt: { xs: 2, sm: 3 }
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
                                width: { xs: '100%', sm: 'auto' }
                            }}
                        >
                            {disableButtons && <Button
                                variant='contained'
                                color="success"
                                onClick={handleSaveForm}>
                                Next Question
                            </Button>}
                        </Stack>
                    </Box>
                </Container>
            </React.Fragment>
        

    )
}

export default StarRating