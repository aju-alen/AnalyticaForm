import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box>
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: '#ff6b6b' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#999' }}>
          It seems the page you are trying to reach is not available. You can go back to the homepage.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGoBack}
          sx={{
            backgroundColor: '#ff6b6b',
            '&:hover': {
              backgroundColor: '#ff4a4a',
            },
            padding: '10px 20px',
          }}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default Error;
