import React,{useEffect} from 'react';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import { Helmet } from 'react-helmet-async';
import { keyframes } from '@mui/system';
import SEO from './SEO';
import first from '../assets/first.gif';
import contactFinal from '../assets/contactFinal.gif';
import functions from '../assets/functions.gif';
import { motion, AnimatePresence } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import featuresData from '../utils/featuresData';
import ReactWhatsapp from 'react-whatsapp';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const buttonPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;
const shinePaper = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const slideAnimation = keyframes`
  0% {
    transform: translateX(30%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const images = [
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner1.jpg', // Replace with your image URLs
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner2.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner3.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner4.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner5.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner6.jpg',
  'https://dubai-analytica.s3.ap-south-1.amazonaws.com/da-market/analytica-banner7.jpg',
];

const Hero = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    return (
      <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        id="hero"
        sx={{
          width: '100%',
          backgroundImage: 'radial-gradient(ellipse 100% 200% at 50% 5%, hsl(210, 100%, 90%), transparent)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        <Box 
          sx={{
            position: 'sticky',
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'row' },
            alignItems: 'center',
            zIndex: 8,
            gap: { xs: 2, sm: 2 },
            top: 0,
            background: 'linear-gradient(to right, rgba(255,255,255,0.98), rgba(240,249,255,0.98))',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            py: { xs: 1.25, sm: 1.75, md: 2 },
            px: { xs: 1.5, sm: 2, md: 4 },
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
              whiteSpace: 'nowrap',
              animation: {
                xs: `${slideAnimation} 25s linear infinite`,
                sm: 'none'
              },
            }}
          >
            <Typography 
              sx={{
                display: 'inline',
                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem' },
                fontWeight: 500,
                color: 'text.primary',
                lineHeight: 1.6,
                whiteSpace: 'nowrap',
                '& span': {
                  background: 'linear-gradient(120deg, #2196f3, #1565c0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                },
              }}
            >
              <span>Need help collecting data?</span> Simply click any of the sliding images. Filter your market or target sample, and
            </Typography>
            <Button 
              variant="contained"
              color="success"
              sx={{
                whiteSpace: 'nowrap',
                textTransform: 'none',
                width: { xs: 'auto', sm: 'auto' },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                py: { xs: 0.75, sm: 1, md: 1.2 },
                px: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: 3,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #2e7d32, #43a047)',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #43a047, #4caf50)',
                  boxShadow: '0 6px 16px rgba(46, 125, 50, 0.3)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'all 0.5s ease',
                },
                '&:hover::after': {
                  left: '100%',
                },
              }}
              onClick={() => navigate('/market')}
            >
              Easily Purchase Responses
            </Button>
          </Box>
        </Box>
        {/* Slider Banner */}
        <Box 
  sx={{
          position: 'relative',
          height: {
            xs: '200px',
            sm: '300px',
            md: '400px'
          },
          minHeight: {
            xs: '200px',
            sm: '300px',
            md: '400px'
          },
          overflow: 'hidden',
          width: '100%',
          mb: { xs: 2, sm: 3, md: 4 },
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          mx: 'auto',
          maxWidth: '1400px',
        }}
>
  <AnimatePresence initial={false}>
    <motion.img
      key={currentIndex}
      src={images[currentIndex]}
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => navigate('/market')}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ 
        duration: 0.7,
        ease: 'easeInOut'
      }}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        position: 'absolute',
        zIndex: 4,
      }}
      alt={`Slide ${currentIndex + 1}`}
    />
  </AnimatePresence>

  {/* Navigation Dots */}
  {/* <Box
    sx={{
      position: 'absolute',
      bottom: { xs: 8, sm: 12, md: 16 },
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      gap: { xs: 0.5, sm: 0.75, md: 1 },
      zIndex: 1,
    }}
  >
    {images.map((_, index) => (
      <Box
        key={index}
        sx={{
          width: { xs: 6, sm: 8, md: 8 },
          height: { xs: 6, sm: 8, md: 8 },
          borderRadius: '50%',
          backgroundColor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.2)',
            backgroundColor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.8)',
          },
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        onClick={() => setCurrentIndex(index)} // Add this if you want clickable dots
      />
    ))} */}
    {/* <Button 
  style={{
    position: 'absolute',
    zIndex: 1,
    left: 1000,
    bottom :170
  }}
  onClick={() => navigate('/market')}  
  variant='contained'
  >
  <Typography>
    Purchase Your Responses
  </Typography>
</Button> */}
  {/* </Box> */}

  {/* Optional: Touch swipe area for mobile */}
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      touchAction: 'pan-y pinch-zoom',
    }}
    component="div"
    onTouchStart={(e) => {
      const touch = e.touches[0];
      setTouchStart(touch.clientX);
    }}
    onTouchMove={(e) => {
      if (!touchStart) return;
      
      const touch = e.touches[0];
      const diff = touchStart - touch.clientX;

      // Minimum swipe distance threshold
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left - next image
          setCurrentIndex((prev) => (prev + 1) % images.length);
        } else {
          // Swipe right - previous image
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
        setTouchStart(null);
      }
    }}
    onTouchEnd={() => {
      setTouchStart(null);
    }}
  />

  {/* Optional: Navigation Arrows */}
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: { xs: 'none', sm: 'flex' }, // Hide on mobile
      justifyContent: 'space-between',
      alignItems: 'center',
      px: { sm: 2, md: 3 },
      pointerEvents: 'none', // Allows clicking through to the swipe area
    }}
  >
    {['left', 'right'].map((direction) => (
      <IconButton
        key={direction}
        onClick={() => {
          if (direction === 'left') {
            setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
          } else {
            setCurrentIndex((prev) => (prev + 1) % images.length);
          }
        }}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          color: 'white',
          pointerEvents: 'auto', // Re-enable clicking
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          },
          display: { xs: 'none', sm: 'flex' },
        }}
      >
        {direction === 'left' ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>
    ))}
  </Box>
</Box>



      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 0, sm: 0 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <SEO
          title="Online Survey Software for Researchers"
          description="Easy to distribute and analyze surveys with Dubai Analytica, the best online survey software that helps UAE brands turn data into decisions."
          name="Dubai Analytica"
          type="Homepage"
        />
        <Stack
          spacing={1}
          borderwidth="10px"
          alignItems="center"
          useFlexGap
          sx={{
            width: { xs: '100%', sm: '85%' },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              fontSize: {xs: '1.7rem',  md: '3.0rem'},
              textAlign: 'center',
              mt: 0,
            }}
          >
           All-in-One Survey Software for Market and Academic Research
          </Typography>
          <Stack
            spacing={3}
            alignItems="center"
            useFlexGap
            sx={{ width: { xs: '100%', sm: '50%' } }}
          >
            
            <Typography
              textAlign='center'
              color="text.secondary"
              sx={{
                 width: { sm: '100%', md: '120%' },
                 paddingX:{xs:1,md:5},
             }}
             fontSize = {{xs: '0.9.5rem', md: '1.1rem'}}
            >
             Create, distribute, and analyse surveys—all in one place. Gain deeper insights with data gathered from surveys.
            </Typography>
            

            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #1565c0, #9B30FF, #1565c0)',
                backgroundSize: '200% 200%',
                animation: `${buttonPulse} 2s infinite, shine 4s ease infinite`,
                padding: '12px 24px',
                borderRadius: '8px',
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                boxShadow: '0px 4px 15px rgba(138, 43, 226, 0.4)',
                '@keyframes shine': {
                  '0%': { backgroundPosition: '0% 90%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
              }}
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              Sign up is free.
            </Button>
          </Stack>
        </Stack>
      </Container>
          
            <Container
                maxWidth="xl"
                sx={{
                    // backgroundImage:
                    //     'radial-gradient(ellipse 100% 50% at 50% 5%, hsl(210, 100%, 90%), transparent)',
                    // backgroundRepeat: 'repeat-y',
                }}
            >
                 <Container 
                 maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 4, sm: 10 },
        pb: { xs: 8, sm: 4},
      }}
    >
     
        <Stack
          spacing={2}
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{ position: 'relative', zIndex: 2 }}
        >
          <Stack spacing={3} sx={{
            width: { xs: '100%', sm: '80%' },
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
            justifyContent: 'center',

          }} >
            <Typography
              variant="h3"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                // justifyContent: 'center',
                width: { xs: '100%', sm: '80%' },
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              }}
            >
              Create remarkable surveys
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                marginLeft: '40px',
                width: { xs: '100%', sm: '80%' },
                fontSize: 'clamp(1.0rem, 3vw, 1rem)',
                paddingX:{xs:1,md:0},
              }}
            >
              Reach your desired target audience by creating incredible surveys. Choose from multiple-choice question types, add logic, and customize with your branding. Your creativity sets the boundaries. And yes, it&apos;s incredibly easy! Discover how we make it happen.
            </Typography>
          </Stack>
          <Paper
        elevation={6}
        sx={{
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Translucent effect
          backdropFilter: 'blur(10px)', // Adds blur to the background
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(120deg, rgba(81, 189, 215, 0.1), rgba(40, 130, 160, 0.2), rgba(200, 230, 240, 0.1))',
            backgroundSize: '200% 200%',
            animation: `${shinePaper} 4s ease infinite`,
            zIndex: 1,
          },
        }}
      >
           <img src={first} alt="My Animation" style={{ width: 1110, height: 'auto' }} />
      </Paper>
        </Stack>
    </Container>
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 4, sm: 10 },
        pb: { xs: 8, sm: 4 },
      }}
    >
      
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ position: 'relative', zIndex: 2 }}
        >
          <Paper
        elevation={6}
        sx={{
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Translucent effect
          backdropFilter: 'blur(10px)', // Adds blur to the background
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(120deg, rgba(81, 189, 215, 0.1), rgba(40, 130, 160, 0.2), rgba(200, 230, 240, 0.1))',
            backgroundSize: '200% 200%',
            animation: `${shinePaper} 4s ease infinite`,
            zIndex: 1,
          },
        }}
      >
          <Box
            component="img"
            src="https://i.postimg.cc/qB2kr4gL/analytics.jpg"
            width={1110}
            alt="My GIF"
            style={{
            }}
          />
          </Paper>
          <Stack spacing={3}
          sx={{
            width: { xs: '100%', sm: '80%' },
            display: 'flex',
            flexDirection: 'column',
            alignItems:'end',
            justifyContent: 'center',
          }}
          >
            <Typography
              variant="h3"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                // justifyContent: 'center',
                width: { xs: '100%', sm: '80%' },
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              }}
            >
              Fast-track better decision-making
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                marginLeft: '40px',
                width: { xs: '100%', sm: '80%' },
                fontSize: 'clamp(1.0rem, 3vw, 1rem)',
                paddingX:{xs:1,md:0},
              }}
            >
              Our reports simplify your analysis. With real-time, shareable dashboards and a complete analytics suite, we empower you to quickly transform data into actionable insights.
            </Typography>
          </Stack>
        </Stack>
      
    </Container>

    <Container
    maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 4, sm: 10 },
        pb: { xs: 8, sm: 4 },
      }}
    >
     
        <Stack
          spacing={2}
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{ position: 'relative', zIndex: 2 }}
        >
           <Stack spacing={3} sx={{
            width: { xs: '100%', sm: '80%' },
            display: 'flex',
            flexDirection: 'column',
            // alignItems: 'center',
            justifyContent: 'center',

          }} >
            <Typography
              variant="h3"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                // justifyContent: 'center',
                width: { xs: '100%', sm: '80%' },
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              }}
            >
              Designed for enterprise use
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                marginLeft: '40px',
                width: { xs: '100%', sm: '80%' },
                fontSize: 'clamp(1.0rem, 3vw, 1rem)',
                paddingX:{xs:1,md:0},
              }}
            >
              We meet all the needs of today&apos;s modern enterprise. From robust security and time-saving integrations to advanced collaboration features, we've got it covered. Plus, our world-class account service team is here to support you every step of the way.
            </Typography>
          </Stack>
          <Paper
        elevation={6}
        sx={{
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Translucent effect
          backdropFilter: 'blur(10px)', // Adds blur to the background
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(120deg, rgba(81, 189, 215, 0.1), rgba(40, 130, 160, 0.2), rgba(200, 230, 240, 0.1))',
            backgroundSize: '200% 200%',
            animation: `${shinePaper} 4s ease infinite`,
            zIndex: 1,
          },
        }}
      >
           <img src={functions} alt="My Animation" style={{ width: 1110, height: 'auto' }} />
      </Paper>
        </Stack>
    </Container>

    <Container
    maxWidth="xl"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 4, sm: 10 },
        pb: { xs: 8, sm: 4 },
      }}
    >
      
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ position: 'relative', zIndex: 2 }}
        >
          <Paper
        elevation={6}
        sx={{
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Translucent effect
          backdropFilter: 'blur(10px)', // Adds blur to the background
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(120deg, rgba(81, 189, 215, 0.1), rgba(40, 130, 160, 0.2), rgba(200, 230, 240, 0.1))',
            backgroundSize: '200% 200%',
            animation: `${shinePaper} 4s ease infinite`,
            zIndex: 1,
          },
        }}
      >
           <img src={contactFinal} alt="My Animation" style={{ width: 1110, height: 'auto' }} />
          </Paper>
          <Stack spacing={3}
          sx={{
            width: { xs: '100%', sm: '80%' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            justifyContent: 'center',
          }}
          >
             <Typography
              variant="h3"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                // justifyContent: 'center',
                width: { xs: '100%', sm: '80%' },
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              }}
            >
              All round support
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                marginLeft: '40px',
                width: { xs: '100%', sm: '80%' },
                fontSize: 'clamp(1.0rem, 3vw, 1rem)',
                paddingX:{xs:1,md:0},
              }}
            >
              Working late into the night? Our support team is available 24/7. From dedicated enterprise account managers to live chat, we&apos;re committed to ensuring your research is successful, no matter the hour.
            </Typography>
          </Stack>
        </Stack> 
    </Container>

    <Container
          maxWidth="xl"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: { xs: 8, sm: 12 },
            background: 'linear-gradient(180deg, rgba(240,249,255,0) 0%, rgba(240,249,255,1) 50%, rgba(240,249,255,0) 100%)',
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
<Box sx={{
  marginX:{xs:2,md:20}
}}>
          <Grid 
            container 
            spacing={4} 
            sx={{ 
              mb: 8,
              justifyContent: 'center',
            }}
          >
            {featuresData.map((feature, index) => (
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
                  <Typography variant="h1" sx={{ mb: 2, fontSize: '2.0rem', textAlign: { xs: 'left', md: 'center' } }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          </Box>

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
                <Container
                    maxWidth='md'
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 4, sm: 5 },
                        pb: { xs: 8, sm: 5 },
                        backgroundImage:
                            'radial-gradient(ellipse 40% 100% at 50% 40%, hsl(210, 100%, 90%), transparent)',
                        borderRadius: 3,
                    }}
                >
                    <Stack
                        spacing={3}
                        display={{ xs: 'flex', sm: 'flex' }}
                        justifyContent={{ xs: 'center', sm: 'center' }}
                        alignItems={{ xs: 'center', sm: 'center' }}
                    >
                        <Typography
                            variant="h2"
                            textAlign="center"
                            sx={{ height: 'full' }}
                            fontWeight={540}
                        >
                            Ready to Get started?
                        </Typography>

                        <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{ height: 'full' }}
                            fontSize={'clamp(1.3rem, 3vw, 1rem)'}

                        >
                            Make use of the best online survey software for reliable actionable insights.
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            textAlign="center"
                            size='large'
                            onClick={() => navigate('/dashboard')}
                            sx={{
                                width: { xs: '100%', sm: '30%'},
                            }}
                        >
                            Sign up free.
                        </Button>
                    </Stack>


                </Container>

                <Container
                maxWidth="xl"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 4, sm: 5 },
                        pb: { xs: 8, sm: 12 },

                    }}
                >
                    <Stack
                        spacing={4}
                    >
                    <Typography
                        variant="h1"
                        textAlign="center"
                        sx={{ height: 'full'}}
                        fontWeight={300}
                        fontSize={'clamp(1.8rem, 5vw, 2.5rem)'}
                        paddingX={{xs:1,md:12}}
                    >
                    The online survey software and data collection tool you need to uncover the right insights
                    </Typography>

                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ width: { sm: '100%', md: '100%' } }}
                        fontSize={'clamp(1.3rem, 3vw, 1rem)'}

                    >
                    Be a part of the 150+ global companies that trust Dubai Analytica to achieve their research objectives.
                    </Typography>
                    </Stack>
                    <br></br>
                    <br></br>
                    <Divider
                        sx={{ width: '100%', mb: 5}}
                    ></Divider>    
                    <Stack
                        spacing={2}
                        direction={{ xs: 'column', md: 'row' }}
                        paddingX={0}
                    >
                       

                        <Card sx={{ minWidth: {xs:350,md:275} }}>
                            <CardContent>
                                <Typography variant='h3' gutterBottom 
                                fontSize={'clamp(1.5rem, 3vw, 1.5rem)'}
                                >
                                What is a survey software?
                                </Typography>

                                <Typography  variant='body1'>
                               <b>Survey software</b>  is an online solution that empowers you to design, distribute, and analyze surveys efficiently.
                                    <br/>
                                    <br/>
                                </Typography>
                                <Typography variant="p">
                                With <b>Dubai Analytica</b> survey software, you can gather comprehensive responses through our extensive distribution network.
                                    <br />
                                    <br/>
                                </Typography>
                                <Typography variant="p">
                                <b>Dubai Analytica</b> simplifies the creation of online surveys. You have access to visually engaging and fully customizable to your needs.
                                    <br />
                                    <br/>
                                </Typography>
                            </CardContent>
                            
                        </Card>

                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant='h3'
                                fontSize={'clamp(1.5rem, 3vw, 1.5rem)'}
                                gutterBottom>
                                Benefits of using survey software
                                </Typography>

                                <Typography  variant='p'>
                               <b>Survey software</b> provides the tools you need to gather critical data for success, enabling you to collect valuable insights quickly and analyze them with ease.
                                    <br/>
                                    <br/>
                                </Typography>
                                <Typography variant="p">
                                <b>Dubai Analytica</b> survey software offers time-saving features such as a question library, automated report generation, pre-built templates, and much more.
                                    <br />
                                    <br/>
                                </Typography>
                              
                            </CardContent>
                            
                        </Card>

                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant='h3'
                                fontSize={'clamp(1.5rem, 3vw, 1.5rem)'}
                                gutterBottom>
                                What&apos;s the best survey software?
                                </Typography>

                                <Typography  variant='p'>
                                The ideal survey software provides a comprehensive set of tools along with exceptional customer support to assist you with your project.
                                    <br/>
                                    <br/>
                                </Typography>
                                <Typography variant="p">
                                At <b>Dubai Analytica</b>, we excel in delivering both. Book a consultation today to discover the advantages of our survey software and learn how to optimize your research projects effectively.
                                    <br />
                                    <br/>
                                </Typography>
                               
                            </CardContent>
                            
                        </Card>
                    </Stack>
                        <ReactWhatsapp 
                          number="+971582652808" 
                          message="Hello! I'm interested in Dubai Analytica's survey solutions." 
                          element="button"
                          style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            backgroundColor: '#25D366',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '60px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            zIndex: 1000,
                          }}
                        >
                          <WhatsAppIcon sx={{ fontSize: 32 }} />
                        </ReactWhatsapp>
                </Container>
            </Container>
        </Box>
        </ThemeProvider>
    );
}

export default Hero