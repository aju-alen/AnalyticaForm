import React, { useState,useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { Container, FormControl, InputLabel, MenuItem, Paper, Select, Stack, IconButton } from '@mui/material'
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
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
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

  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      setChatMessages([
        {
          text: "👋 Hello! I'm DA Assistant, your AI helper. How can I assist you today? I can help you with:",
          sender: 'bot'
        },
        {
          text: "• Information about DA's services\n• General inquiries\n• Technical support\n• Scheduling meetings\n• Documentation help",
          sender: 'bot'
        }
      ]);
    }
  }, [isChatOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  console.log(formData);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // Add this array of suggested questions
  const suggestedQuestions = [
    "What services does DA offer?",
    "How can I schedule a consultation?",
    "What are your business hours?",
    "Where are you located?",
    "How can I get technical support?"
  ];

  // Add this function to handle quick question selection
  const handleQuickQuestion = (question) => {
    handleChatSubmit(question);
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
                width: '400px',
                height: '650px',
                borderRadius: '20px',
                overflow: 'hidden',
                bgcolor: '#f8f9fa',
                animation: 'slideUp 0.3s ease-out',
                '@keyframes slideUp': {
                  from: { transform: 'translateY(100%)', opacity: 0 },
                  to: { transform: 'translateY(0)', opacity: 1 }
                },
                boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
              }}
            >
              <Box sx={{
                backgroundColor: '#1976d2',
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    component="img"
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=seiko"
                    alt="AI Avatar"
                    sx={{ 
                      width: 45, 
                      height: 45, 
                      borderRadius: '50%', 
                      backgroundColor: 'white', 
                      p: 0.5,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ 
                      color: 'white', 
                      fontSize: '1.1rem', 
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      DA Assistant
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          backgroundColor: '#4caf50',
                          borderRadius: '50%',
                          boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.3)',
                          animation: 'pulse 2s infinite'
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        Online | Ready to help
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setIsChatOpen(false)}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  <Typography sx={{ fontSize: '1.2rem' }}>✕</Typography>
                </IconButton>
              </Box>
              
              <Box sx={{ 
                flex: 1,
                height: 'calc(100% - 140px)',
                overflowY: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#bdbdbd',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#9e9e9e',
                }
              }}>
                {chatMessages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1,
                      gap: 1,
                      animation: 'fadeIn 0.3s ease-out',
                      '@keyframes fadeIn': {
                        from: { opacity: 0, transform: 'translateY(10px)' },
                        to: { opacity: 1, transform: 'translateY(0)' }
                      }
                    }}
                  >
                    {msg.sender === 'bot' && (
                      <Box
                        component="img"
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=seiko"
                        alt="AI Avatar"
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          alignSelf: 'flex-end',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        maxWidth: '75%',
                        p: 2,
                        borderRadius: msg.sender === 'user' 
                          ? '20px 20px 5px 20px' 
                          : '20px 20px 20px 5px',
                        backgroundColor: msg.sender === 'user' 
                          ? 'primary.main' 
                          : 'white',
                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        position: 'relative',
                        '&::before': msg.sender === 'bot' ? {
                          content: '""',
                          position: 'absolute',
                          left: -8,
                          bottom: 8,
                          borderStyle: 'solid',
                          borderWidth: '8px 8px 0 0',
                          borderColor: 'transparent white transparent transparent'
                        } : {}
                      }}
                    >
                      {msg.isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </Box>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: formatResponseText(msg.text) }} />
                      )}
                    </Box>
                  </Box>
                ))}
                {chatMessages.length <= 2 && (
                  <Box sx={{ 
                    mt: 2,
                    animation: 'fadeIn 0.5s ease-out'
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary', 
                        ml: 1, 
                        mb: 1.5, 
                        display: 'block',
                        fontWeight: 500
                      }}
                    >
                      Suggested Questions:
                    </Typography>
                    <Stack spacing={1}>
                      {suggestedQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          size="small"
                          onClick={() => handleQuickQuestion(question)}
                          sx={{
                            textTransform: 'none',
                            justifyContent: 'flex-start',
                            borderRadius: '12px',
                            px: 2.5,
                            py: 1,
                            borderColor: 'rgba(25, 118, 210, 0.2)',
                            backgroundColor: 'white',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'rgba(25, 118, 210, 0.04)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                            }
                          }}
                        >
                          {question}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>
              
              <Box sx={{ 
                p: 2,
                backgroundColor: 'white',
                borderTop: '1px solid rgba(0,0,0,0.08)'
              }}>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (inputMessage.trim()) {
                    handleChatSubmit(inputMessage);
                    setInputMessage('');
                  }
                }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your message..."
                      variant="outlined"
                      size="small"
                      InputProps={{
                        sx: {
                          borderRadius: '25px',
                          backgroundColor: '#f8f9fa',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                          '&.Mui-focused fieldset': {
                            borderWidth: '1px',
                          },
                          transition: 'all 0.2s ease'
                        }
                      }}
                    />
                    <Button 
                      type="submit"
                      variant="contained"
                      disabled={!inputMessage.trim() || isLoading}
                      sx={{
                        minWidth: 'unset',
                        px: 3,
                        borderRadius: '20px',
                        boxShadow: 'none',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      Send
                    </Button>
                  </Box>
                </form>
              </Box>
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
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
          100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
        
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 4px;
        }
        
        .typing-indicator span {
          width: 6px;
          height: 6px;
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


