// src/theme.js
import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      'Lato',
      'Poppins', // Add the Poppins font
      'sans-serif',
      'Arial',
    ].join(','),
  },
});

export default theme;
