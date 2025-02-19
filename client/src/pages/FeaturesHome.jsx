import React from 'react'
import { Container, Typography, Grid, Paper, Button, Stack,Box } from '@mui/material';
import  {featuresDataInFeaturePage}  from '../utils/featuresData';
import { useNavigate } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
const FeaturesHome = () => {
  const navigate = useNavigate();
  return (
    <Box  >
    <HomeNavBar/>
    <Container
    maxWidth="xl"
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: { xs: 8, sm: 12 },
      bgcolor: 'background.default', pt: 8, pb: 12, backgroundImage: 'radial-gradient(ellipse 100% 200% at 50% 5%, hsl(210, 100%, 90%), transparent)',
    }}
  >
    <Typography
      variant="h2"
      textAlign="center"
      sx={{
        mb: 3,
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 700,
      }}
    >
      Features
    </Typography>

    <Typography
      variant="h3"
      textAlign="center"
      sx={{
        mb: 2,
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        color: 'primary.main',
        maxWidth: '800px',
      }}
    >
      Data-driven Insights for Smarter Decisions
    </Typography>

    <Typography
      variant="body1"
      textAlign="center"
      sx={{
        mb: 8,
        maxWidth: '800px',
        fontSize: 'clamp(1rem, 2vw, 1.1rem)',
        color: 'text.secondary',
      }}
    >
      Dubai Analytica helps businesses, researchers, and decision-makers collect, analyze, and act on data with precision. Our survey tools empower you with real-time insights, ensuring every decision is backed by accurate information.
    </Typography>

    <Typography
      variant="h4"
      textAlign="center"
      sx={{
        mb: 6,
        fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
        fontWeight: 600,
      }}
    >
      Survey software features to help you get work done smarter
    </Typography>
    <Grid 
      container 
      spacing={4} 
      sx={{ 
        mb: 8,
        justifyContent: 'center',
      }}
    >
      {featuresDataInFeaturePage.map((feature, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,

              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <Typography variant="h1" sx={{ mb: 2, fontSize: '2.5rem' }}>
              {feature.icon}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {feature.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {feature.description}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 4,
        borderRadius: 2,
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Why Choose Dubai Analytica?
      </Typography>
      <Stack spacing={2}>
        {[
          "Data-driven insights for faster and more accurate analysis",
          "Secure, scalable, and user-friendly survey platform",
          "Access to a global and region-specific respondent pool",
          "Ready-made templates to save time and effort"
        ].map((point, index) => (
          <Typography key={index} variant="body1">
            • {point}
          </Typography>
        ))}
      </Stack>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        sx={{
          mt: 4,
          color: 'primary.main',
          bgcolor: 'white',
          '&:hover': {
            bgcolor: 'grey.100',
          },
        }}
        onClick={() => navigate('/dashboard')}
      >
        Transform Your Data Collection Today
      </Button>
    </Box>
  </Container>
  </Box>
  )
}

export default FeaturesHome