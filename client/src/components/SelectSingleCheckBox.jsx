import React, { useEffect,memo, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { uid } from 'uid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';




const SelectSingleCheckBox = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext, onSetLoading }) => {
  const [formData, setFormData] = React.useState({
    id: id,
    question: '',
    quilText: '',
    options: [
      { id: uid(5), value: '', rowQuestion: '' },
      { id: uid(5), value: '', rowQuestion: '' }

    ],
    selectedValue: [],
    formType: 'SingleCheckForm'
  });

  const [debouncedValue, setDebouncedValue] = React.useState('');
  const [boldFields, setBoldFields] = useState(new Set());

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
      onSetLoading(false)
      setDebouncedValue(formData);
      onSaveForm(formData);
    }, 1000); // 500ms delay
    onSetLoading(true)
    // Cleanup function to cancel the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [formData]);

  const handleAddOptions = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { id: uid(5), value: '', rowQuestion: '' }]
    })
  }

  const handleDeleteOptions = (id) => {
    // console.log(id,'id in delete');
    const newOptions = formData.options.filter(option => option.id !== id);
    // console.log(newOptions,'newOptions');
    setFormData({ ...formData, options: newOptions });
  }

  const handleCheckboxChange = (id) => {
    const newOptions = formData.options.map((option, idx) => {
      if (option.id === id) {
        if (formData.selectedValue.map((item) => item.id).includes(option.id)) {
          const newSelectedValue = formData.selectedValue.filter((item) => item.id !== option.id);
          console.log(newSelectedValue, 'newSelectedValue in checkbox');
          setFormData({ ...formData, selectedValue: newSelectedValue })
        } else {
          setFormData({ ...formData, selectedValue: [...formData.selectedValue, { ...option, question: formData.question, answer: option.value, index: idx + 1 }] })

        }
      }
    })
  };

  const handleMandateForm = () => {
    console.log('mandate handleMandateForm');
    setFormData({ ...formData, formMandate: true })
  }

  const handleSaveForm = () => {
    console.log('save handleSaveForm');
    onSaveForm(formData);
    onHandleNext()
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
          <Box sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            '&:hover .format-button': {
                visibility: 'visible',
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
          </Box>
           <Stack spacing={1} sx={{
            width: { xs: '100%', md: '20%' },
            marginRight: 'auto',
          }} >
            {formData.options.map((opt) => {
              console.log(formData.selectedValue.includes(opt.id), 'selectedValue');
              return (
                <Stack direction="row" spacing={2} key={opt.id}>
                   <Checkbox
                    disabled={disableForm}
                    checked={formData.selectedValue.map((item) => item.id).includes(opt.id)}
                    onChange={() => handleCheckboxChange(opt.id)}

                  />
                   <Box
               sx={{
                 position: 'relative',
                 display: 'flex',
                 alignItems: 'center',
                 width: '100%',
                 '&:hover .format-button': {
                   visibility: 'visible',
                 },
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
                    multiline
                    value={opt.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        options: formData.options.map((item) =>
                          item.id === opt.id
                            ? { ...item, value: e.target.value, rowQuestion: e.target.value }
                            : item
                        ),
                      })
                    }
                    InputProps={{
                      readOnly: disableText,
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: '0.9rem',
                        fontWeight: boldFields.has(opt.id) ? 'bold' : 'normal',
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
                  />
                  {!disableButtons && (
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
                      onClick={() => handleBoldToggle(opt.id)}
                    >
                      <FormatBoldIcon 
                        fontSize="small"
                        sx={{ 
                          color: boldFields.has(opt.id) ? 'primary.main' : 'text.secondary'
                        }}
                      />
                    </Button>
                  )}
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
                      onClick={() => handleDeleteOptions(opt.id)}
                    >
                      <HighlightOffIcon fontSize="small" />
                    </Button>
                  )}
               </Box>
                </Stack>
              )
            })}
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

export default SelectSingleCheckBox