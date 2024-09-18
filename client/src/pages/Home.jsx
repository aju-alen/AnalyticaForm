import HomeNavBar from '../components/HomeNavBar';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Hero from '../components/Hero';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Switch from '@mui/material/Switch';




export default function Home() {

  const [mode, setMode] = React.useState(localStorage.getItem('mode') === 'true' ? true : false);
  const prefersDarkMode = useMediaQuery(`(prefers-color-scheme:${mode?"light":"dark"} )`);

  const handleChange = (event) => {
    setMode(event.target.checked);
    localStorage.setItem('mode', event.target.checked);

  };

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
      {/* <Switch
      sx={{ position: 'fixed', top: 70, right: 0 }}
      checked={mode}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    /> */}
      <Hero />
    </div>
    // </ThemeProvider>
  );
}