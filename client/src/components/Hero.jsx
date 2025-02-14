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

const images = [
  'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/da-market/analytica-banner1.jpg', // Replace with your image URLs
  'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/da-market/analytica-banner2.jpg',
  'https://s3-scientific-journal.s3.ap-south-1.amazonaws.com/Images/da-market/analytica-banner3.jpg',
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
        }}
      >
        {/* Slider Banner */}
        <Box 
  sx={{ 
    position: 'relative',
    // Responsive height using viewport units and min-height
    height: { 
      xs: '200px',  // Mobile
      sm: '300px',  // Tablet
      md: '400px'   // Desktop
    },
    minHeight: {
      xs: '200px',
      sm: '300px',
      md: '400px'
    },
    overflow: 'hidden',
    width: '100%',
  }}
>
  <AnimatePresence initial={false}>
    <motion.img
      key={currentIndex}
      src={images[currentIndex]}
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ 
        duration: 0.7,
        ease: 'easeInOut'
      }}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
      }}
      alt={`Slide ${currentIndex + 1}`}
    />
  </AnimatePresence>

  {/* Navigation Dots */}
  <Box
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
    ))}
  </Box>

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
<Button 
  style={{
    position: 'absolute',
  }}
  onClick={() => navigate('/market')}  
  variant='contained'
  >
  <Typography>
    Purchase Your Responses
  </Typography>
</Button>


      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <SEO
          title="Online Survey Data Collection Software"
          description="Easy to distribute and analyze surveys with Dubai Analytica, the best online survey software that helps UAE brands turn data into decisions."
          name="Dubai Analytica"
          type="Homepage"
        />
        <Stack
          spacing={4}
          borderwidth="10px"
          alignItems="center"
          useFlexGap
          sx={{
            width: { xs: '100%', sm: '70%' },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              fontSize: 'clamp(2rem, 10vw, 3.9rem)',
              textAlign: 'center',
              mt: 6,
            }}
          >
            Ask the right questions to find the answers you need with
          </Typography>
          <Stack
            spacing={3}
            alignItems="center"
            useFlexGap
            sx={{ width: { xs: '100%', sm: '100%' } }}
          >
            
            <Typography
              textAlign='center'
              color="text.secondary"
              sx={{
                 width: { sm: '100%', md: '100%' },
                 paddingX:5,
             }}
              fontSize="clamp(1.15rem, 3vw, 1rem)"
            >
              <b>Dubai Analytica</b>, the best survey software that helps UAE based companies, individuals, and teams with audience surveys. Create employee engagement surveys, customer surveys, market research surveys and more.
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

                            <Button onClick={() => navigate('/market')}>
                              Test Function
                            </Button>

                </Container>
            </Container>
        </Box>
        </ThemeProvider>
    );
}

export default Hero