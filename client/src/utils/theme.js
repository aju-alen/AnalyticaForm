// src/theme.js
import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'sans-serif',
      'Arial',
      'Poppins', // Add the Poppins font
    ].join(','),
  },
});

export default theme;
