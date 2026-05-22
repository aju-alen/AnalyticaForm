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
          title="Market Research & Data Intelligence Platform UAE"

          description="Dubai Analytica is a UAE-based hybrid market research and data intelegence platform for managed research, targeted surveys, and actionable insights."


          ogTitle="Dubai Analytica: Market Research & Data Intelligence Platform UAE"
          ogDescription="Managed research, targeted surveys, and actionable insights for researchers, students, and organizations in the UAE."
          keywords="market research UAE"
          canonicalUrl="https://dubaianalytica.com/"
          name="Dubai Analytica"
          type="website"
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
              fontWeight: 600,
              mt: 0,
            }}
          >
           A UAE-based market research and data intelligence platform
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
                 width: { sm: '100%', md: '190%' },
                 paddingX:{xs:1,md:5},
             }}
             fontSize = {{xs: '0.9.5rem', md: '1.3rem'}}
            >
             That runs managed research, collects targeted survey responses, and transforms data into actionable insights for researchers, students, and organizations.
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
             Start a Research Project
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
        py: { xs: 8, sm: 12 }
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
              Research execution and data intelligence, in one system

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
             Dubai Analytica combines data collection, survey deployment, and research analysis within a single workflow.
It is designed for projects that require structured data gathering alongside meaningful interpretation.
Research progresses through one connected process, from setup through to outcome.

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
             From research question to structured insight
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
             Step 1 — Define the research objective
Each project begins with a clear question or requirement. This establishes what needs to be understood and the purpose behind the study.

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
             
Step 2 — Design and deploy surveys
Surveys are prepared around the research objective and deployed to relevant audiences.
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
             
             Step 3 — Collect targeted responses
Responses are gathered from selected participants and stored in a structured format for review and analysis.

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
             
             Step 4 — Process and analyse data
Collected responses are reviewed to identify patterns, trends, and relevant findings.

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
             
             Step 5 — Generate insights
Findings are translated into clear outputs that support academic work, research studies, and business decision-making.

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
        py: { xs: 8, sm: 12 }
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
              Structured research you can rely on
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
             Dubai Analytica is built around controlled research execution, from how data is collected to how it is interpreted.
Each project follows a defined process so that results remain consistent with the original research objective.

            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontWeight: 'bold',
                marginLeft: '40px',
                width: { xs: '100%', sm: '80%' },
                fontSize: 'clamp(1.0rem, 3vw, 1rem)',
                paddingX:{xs:1,md:0},
              }}
            >
            Controlled data collection

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
             Responses are gathered through targeted survey deployment aligned with the defined study requirements. This reduces irrelevant input and ensures data reflects the intended audience.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontWeight: 'bold',
                marginLeft: '40px',
                width: { xs: '100%', sm: '80%' },
                fontSize: 'clamp(1.0rem, 3vw, 1rem)',
                paddingX:{xs:1,md:0},
              }}
            >
            Structured research process

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
             Every study follows the same operational flow. From survey design to response collection and analysis, the process remains consistent across projects.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontWeight: 'bold',
                marginLeft: '40px',
                width: { xs: '100%', sm: '80%' },
                fontSize: 'clamp(1.0rem, 3vw, 1rem)',
                paddingX:{xs:1,md:0},
              }}
            >
            Interpreted analysis

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
             Collected data is reviewed to identify patterns, recurring signals, and relevant findings within the dataset. Interpretation stays anchored to the original research question.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontWeight: 'bold',
                marginLeft: '40px',
                width: { xs: '100%', sm: '80%' },
                fontSize: 'clamp(1.0rem, 3vw, 1rem)',
                paddingX:{xs:1,md:0},
              }}
            >
          Transparent execution


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
           Research projects follow a clear workflow from initiation through to final output. Each stage is traceable within the structure of the study.
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
        py: { xs: 8, sm: 12 }

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
          maxWidth="lg"
          sx={{

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: { xs: 8, sm: 12 }
          }}
        >
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              mb: 3,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 600,
            }}
          >
            Built for researchers, students, and organizations in the UAE
          </Typography>


          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              mb: 2,
              maxWidth: '800px',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'text.secondary',
            }}
          >
            Dubai Analytica supports students working on academic projects, researchers conducting studies, startups testing ideas, and organizations seeking structured feedback and insight.


          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              mb: 2,
              maxWidth: '800px',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'text.secondary',
            }}
          >
            Research needs differ across these groups, but the requirement is often the same: reliable responses and a clear framework for interpretation.
            

          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              mb: 2,
              maxWidth: '800px',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'text.secondary',
            }}
          >
            Projects may be conducted independently or supported through managed research execution depending on scope and complexity.
            

          </Typography>
    </Container>
    <Container
          maxWidth="lg"
          sx={{

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: { xs: 8, sm: 12 }
          }}
        >
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              mb: 3,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 600,
            }}
          >
           What the platform enables

          </Typography>

          <Grid
            container
            sx={{
              width: '100%',
              mt: { xs: 4, md: 7 },
              px: { xs: 1, sm: 2, md: 0 },
            }}
          >
            {[
              {
                title: 'Data collection',
                body: 'The platform supports targeted surveys, structured questionnaires, and controlled response gathering aligned with defined research objectives.',
              },
              {
                title: 'Research execution',
                body: 'Studies can be planned and deployed through managed workflows that align data collection with the intended research outcome.',
              },
              {
                title: 'Analysis and insights',
                body: 'Responses are reviewed to identify patterns, interpret sentiment where relevant, and develop structured insights for reporting and decision-making.',
              },
            ].map((item, index, items) => (
              <Grid
                item
                xs={12}
                md={4}
                key={item.title}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 3, md: 2 },
                  borderRight: {
                    md: index < items.length - 1 ? '1px solid' : 'none',
                  },
                  borderBottom: {
                    xs: index < items.length - 1 ? '1px solid' : 'none',
                    md: 'none',
                  },
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontSize: 'clamp(1rem, 2vw, 1.6rem)',
                    color: 'text.secondary',
                    fontWeight: 'bold',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    maxWidth: 360,
                    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                    color: 'text.secondary',
                    lineHeight: 1.6,
                  }}
                >
                  {item.body}
                </Typography>
              </Grid>
            ))}
          </Grid>
    </Container>

    <Container
          maxWidth="lg"
          sx={{

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: { xs: 8, sm: 12 }
          }}
        >
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              mb: 3,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 600,
            }}
          >
          A complete research workflow
          </Typography>


          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              mb: 2,
              maxWidth: '800px',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              color: 'text.secondary',
            }}
          >
            Dubai Analytica connects data collection and analysis within a single system designed for structured research outcomes.



          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              mb: 2,
              maxWidth: '800px',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              color: 'text.secondary',
            }}
          >
            Research can move from study design through to interpretation without fragmented tools or disconnected processes.
          
            

          </Typography>
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              mb: 2,
              maxWidth: '800px',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              color: 'text.secondary',
            }}
          >
             The focus is to make research more manageable, organised, and easier to translate into usable insight.
            

          </Typography>
    </Container>

    {/* <Container
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
    </Container> */}
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
                          Start your research project

                        </Typography>

                        <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{ height: 'full' }}
                            fontSize={'clamp(1.3rem, 3vw, 1rem)'}

                        >
                            Define your research objective and move from data collection to structured analysis and insight generation.

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
                            Start a Research Project.
                        </Button>
                    </Stack>


                </Container>
{/* 
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
                </Container> */}
            </Container>
        </Box>
        </ThemeProvider>
    );
}

export default Hero