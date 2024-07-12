// src/theme.js
import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins', // Add the Poppins font
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export default theme;
