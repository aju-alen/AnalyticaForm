// src/theme.js
import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  typography: {
    fontFamily: [
      'Figtree',
      'Lato',
      'Nunito Sans',
      'Raleway',
      'Roboto',
      'sans-serif',
      'Arial',
    ].join(','),
  },
  palette: {
    text: {
      secondary: '#000',
    },
  },
});

export default theme;
