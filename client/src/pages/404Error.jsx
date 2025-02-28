import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Error = () => {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="xl" 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30vh',
          background: 'linear-gradient(120deg, #2196f3, #1565c0)',
          transform: 'skewY(-6deg)',
          transformOrigin: 'top left',
        }}
      />
      
      <Box
        sx={{
          zIndex: 1,
          textAlign: 'center',
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 4, sm: 6, md: 8 },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(8px)',
          maxWidth: '600px',
        }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            background: 'linear-gradient(120deg, #2196f3, #1565c0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2,
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 3,
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 500,
            color: '#1565c0',
          }}
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: '#546e7a',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.6,
          }}
        >
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </Typography>

        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{
            background: 'linear-gradient(120deg, #2196f3, #1565c0)',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 2,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
            },
          }}
        >
          Return to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default Error;
