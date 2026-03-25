import HomeNavBar from '../components/HomeNavBar';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Button } from '@mui/material';
import Hero from '../components/Hero';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from "react-router-dom";
import TagManager from "react-gtm-module";
import { useEffect } from 'react';
import {motion} from 'framer-motion';


export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const survey = searchParams.get('survey');

  const [mode, setMode] = React.useState(localStorage.getItem('mode') === 'true' ? true : false);
  const prefersDarkMode = useMediaQuery(`(prefers-color-scheme:${mode?"light":"dark"} )`);

  const handleChange = (event) => {
    setMode(event.target.checked);
    localStorage.setItem('mode', event.target.checked);

  };
  console.log(location,'location.pathname');
  console.log(TagManager,'TagManager');

  useEffect(() => {
    console.log(window.gtag,'window.gtag');
    
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-16870151196/_36GCMmJ2Z8aEJyoqOw-", // Use the specific conversion ID from your email
      });
    }
  }, []);
  

  useEffect(() => {
    // Send page view to GTM
    TagManager.dataLayer({
      dataLayer: {
        event: "pageview",
        page_path: location.pathname,
      },
    });
  }, [location]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  return (
      <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      transition={{duration:1.5}}
      >
    <div className='w-screen'>
      <CssBaseline />
      <HomeNavBar />
      <Hero />

      {survey ? (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1100,
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate(`/user-survey/${encodeURIComponent(survey)}`)}
          >
            Go back to survey
          </Button>
        </Box>
      ) : null}
    </div>
    </motion.div>
  );
}