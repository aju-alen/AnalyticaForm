import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button, Stack, useTheme, useMediaQuery } from '@mui/material';
import Divider from '@mui/material/Divider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uid } from 'uid';





const IntroductionForm = ({ onSaveForm, data, id, options, disableForm, disableText, disableButtons, onHandleNext,onSaveIndicator }) => {
  const [isBold, setIsBold] = useState(false);
  const [formData, setFormData] = useState({
    id: id,
    question: '',
    quilText: '',
    options: [
      { id: uid(5), value: '' },
      { id: uid(5), value: '' }
    ],
    selectedValue: [{ question: '', answer: '', value: '', index: '' }],
    formType: 'IntroductionForm'
  });

  const [debouncedValue, setDebouncedValue] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const toolbarSetting = disableText ? false : {
    container: isMobile && !disableText ? [
      ['bold', 'italic', 'underline'],
      ['clean']
    ] : [
      ['bold', 'italic', 'underline', 'strike'],
      ['clean']
    ]
  };
  const modules = {
    toolbar: toolbarSetting,
    clipboard: { matchVisual: false }
  };
  const formats = ['bold', 'italic', 'underline', 'strike'];

  const cleanHTMLContent = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    let cleanText = tempDiv.textContent || tempDiv.innerText || '';
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    return cleanText;
  };

  const handleQuillChange = (content) => {
    setFormData({
      ...formData,
      quilText: content,
      question: cleanHTMLContent(content)
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(formData);
      onSaveForm(formData);
      // onSaveIndicator('Saved')
    }, 2000); // 500ms delay

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

 


  useEffect(() => {
    if (options && Array.isArray(options) && options.length > 0) {
      setFormData(data);
    } else {
      setFormData((prev) => ({
        ...prev,
        id,
        quilText: data?.quilText ?? prev.quilText,
        question: data?.question ?? prev.question
      }));
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
                  Insert Survey Introduction *
                </label>
              )}
              <ReactQuill
                theme="snow"
                value={formData.quilText}
                onChange={handleQuillChange}
                readOnly={disableText}
                modules={modules}
                formats={formats}
                className="ql-container ql-snow"
                style={{
                  width: '100%',
                  border: '0px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                }}
              />
              <Divider />
            </div>
          </Box>

       
          <Stack spacing={5} direction='row' sx={{
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

            {disableButtons &&<Button
              variant='contained'
              color="success"
              onClick={handleSaveForm}>
               Start Survey
            </Button>}
           
          </Stack>
        </Box>
      </Container>
      </React.Fragment>

  )
}

export default IntroductionForm

