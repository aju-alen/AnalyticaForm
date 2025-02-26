import React, { useState,useEffect } from 'react'
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { Container, FormControl, InputLabel, MenuItem, Paper, Select, Stack } from '@mui/material'
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';


const ContactUs = () => {
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState('success');
  const [alertText, setAlertText] = useState('');
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    message: '',
    contact: '',
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
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

  const formatResponseText = (text) => {
    if (!text) return '';
    
    let formattedText = text;
    
    // Replace multiple newlines with a single newline
    formattedText = formattedText.replace(/\n{2,}/g, '\n');
    
    // Convert markdown-style bold text (both ** and __ syntax)
    formattedText = formattedText
      .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
    
    // Convert markdown-style italic text (both * and _ syntax)
    formattedText = formattedText
      .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
    
    // Convert markdown-style bullet points to proper bullet points
    formattedText = formattedText.replace(/^\s*[-*+]\s/gm, '<ul><li>') + '</li></ul>';
    
    // Convert markdown-style numbered lists (1. 2. etc)
    formattedText = formattedText.replace(/^\s*\d+\.\s/gm, '<ol><li>') + '</li></ol>';
    
    // Handle code blocks and inline code
    formattedText = formattedText
      .replace(/```[\s\S]*?```/g, (match) => `<pre>${match.replace(/```/g, '')}</pre>`)
      .replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Handle URLs - make them more readable and clickable
    formattedText = formattedText.replace(/(https?:\/\/[^\s]+)/g, url => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url.replace(/^(https?:\/\/)?(www\.)?/, '')}</a>`;
    });
    
    // Handle common HTML entities
    formattedText = formattedText
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    
    // Trim whitespace from each line while preserving newlines
    formattedText = formattedText.split('\n')
      .map(line => line.trim())
      .filter(line => line) // Remove empty lines
      .join('\n');
    
    // Prettify the text (adding space between paragraphs)
    formattedText = formattedText.replace(/\n/g, '<br>\n');
    
    return formattedText;
  };
  

  const handleChatSubmit = async (message) => {
    setChatMessages((prev) => [...prev, { text: message, sender: 'user' }]);
    setIsLoading(true);
    try {
      setChatMessages((prev) => [...prev, { text: '...', sender: 'bot', isLoading: true }]);
      
      const response = await axios.post(`${backendUrl}/api/google-vertex/chat`, { message });
      
      setChatMessages((prev) => prev.filter(msg => !msg.isLoading));
      setChatMessages((prev) => [...prev, { text: formatResponseText(response.data.message.parts[0].text), sender: 'bot' }]);
    } catch (error) {
      setChatMessages((prev) => prev.filter(msg => !msg.isLoading));
      setChatMessages((prev) => [...prev, { text: 'Error: Unable to get response', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(formData);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minWidth: 100, }} className='p-20'>
        <Typography variant='h2' color='#1976d2' gutterBottom>
          Contact Us
        </Typography>
        <Divider variant='middle' sx={{
          // backgroundColor: '#1976d2',
          height: 1.5,
        }}  />
        <Container maxWidth='lg'  >
          <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant='h5' color='#1976d2' gutterBottom>
          General Inquiries
          </Typography>
          <Typography variant='p'  gutterBottom>
          United Arab Emirates: +971 (058) 265 2808
          </Typography>
          <Typography variant='p'  gutterBottom>
          Location: Dubai International Financial Centre
          </Typography>
          <Typography variant='p'  gutterBottom>
          Address: Gate Avenue, Zone D - Level 1, Al Mustaqbal St - Dubai - UAE
          </Typography>
          </Stack>
        </Container>
        <Container maxWidth='md'  >
          <Stack spacing={2} sx={{ mt: 12 }}>
           
                  {/* Blue background website help banner */}

                  {/* <Stack spacing={2} direction='row' sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  
                  <Button variant='contained' color='primary'   sx={{
                    fontWeight:'bold',
                  }}>Website Help </Button>
                  <Typography variant='p'  gutterBottom sx={{
                    fontWeight:'300',
                    fontSize: '0.9rem',
                    textDecoration:'line-through',
                    
                  }}>
                  Get in touch with our assistant for immediate help 
                  </Typography>
                  <Typography variant='p'  gutterBottom sx={{
                    fontWeight:'300',
                    fontSize: '0.9rem',
                    
                  }}>
                  (Coming Soon)
                  </Typography>
                  </Stack> */}
            
              <Typography variant='p' gutterBottom>
              To have a DA account manager contact you about any queries that you may have, please fill out the following information. We respect your privacy and will only use this information to contact you regarding your specific request and will not share this with any third party.
              </Typography>
              <Paper elevation={3} sx={{ p: 2,
                width: '100%',
               
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover' }}>
                  <Stack spacing={2}  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                     <Typography variant='h5' gutterBottom sx={{
                      fontWeight:'300',
                      fontSize: '1.3rem',
                     }}>
                    Get in Touch with a DA Representative
                    </Typography>
                    <Typography variant='p'  gutterBottom sx={{
                      fontWeight:'300',
                      fontSize: '0.8rem',
                     }}> 
                    Please fill this form, we'll contact you shortly.
                    </Typography>
                    
                 <Container maxWidth='md'>
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
             sx={{ mt: 3, mb: 2, width: '30%' }}
             >
              Send Message
            </Button>
          </FormControl>
        </Container>
                 
                  </Stack>
              </Paper>
            </Stack>
            </Container>
       
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          {isChatOpen ? (
            <Paper
              elevation={6}
              sx={{
                position: 'absolute',
                bottom: '70px',
                right: 0,
                width: '350px',
                height: '500px',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <Box sx={{
                backgroundColor: '#1976d2',
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Chat with Us
                </Typography>
                <Button
                  onClick={() => setIsChatOpen(false)}
                  sx={{ color: 'white', minWidth: 'auto', p: 0.5 }}
                >
                  ✕
                </Button>
              </Box>
              
              <Stack spacing={2} sx={{ height: 'calc(100% - 64px)' }}>
                <Box sx={{ 
                  flex: 1,
                  overflowY: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  {chatMessages.map((msg, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        mb: 1
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: msg.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                          backgroundColor: msg.sender === 'user' ? '#1976d2' : '#ffffff',
                          color: msg.sender === 'user' ? '#ffffff' : '#000000',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          wordBreak: 'break-word'
                        }}
                      >
                        {msg.isLoading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <div className="typing-indicator">
                              <span></span>
                              <span></span>
                              <span></span>
                            </div>
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              Finding answer...
                            </Typography>
                          </Box>
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: formatResponseText(msg.text) }} />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ 
                  p: 2,
                  backgroundColor: '#ffffff',
                  borderTop: '1px solid rgba(0,0,0,0.1)'
                }}>
                  <TextField
                    fullWidth
                    placeholder="Type your message..."
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      sx: {
                        borderRadius: '25px',
                        '& fieldset': {
                          borderColor: 'rgba(0,0,0,0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#1976d2 !important',
                        },
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleChatSubmit(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </Box>
              </Stack>
            </Paper>
          ) : null}
          
          <Button
            variant="contained"
            onClick={() => setIsChatOpen(!isChatOpen)}
            sx={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              minWidth: 'unset',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {isChatOpen ? '✕' : '💬'}
          </Button>
        </Box>
       
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
      
      </Box>
      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 4px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #90caf9;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </ThemeProvider>
  )
}

export default ContactUs


