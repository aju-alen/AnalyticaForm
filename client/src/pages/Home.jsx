import HomeNavBar from '../components/HomeNavBar';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Hero from '../components/Hero';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { useLocation } from "react-router-dom";
import TagManager from "react-gtm-module";
import { useEffect } from 'react';




export default function Home() {
  const location = useLocation();

  const [mode, setMode] = React.useState(localStorage.getItem('mode') === 'true' ? true : false);
  const prefersDarkMode = useMediaQuery(`(prefers-color-scheme:${mode?"light":"dark"} )`);

  const handleChange = (event) => {
    setMode(event.target.checked);
    localStorage.setItem('mode', event.target.checked);

  };
  console.log(location,'location.pathname');
  console.log(TagManager,'TagManager');

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-16870151196/q773CMj48JwaEJyoqOw-",
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
      //  <ThemeProvider theme={theme}>
    <div className='w-screen'>
      <CssBaseline />
      <HomeNavBar />
      <Hero />
    </div>
    // </ThemeProvider>
  );
}