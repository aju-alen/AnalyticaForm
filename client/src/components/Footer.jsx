
import React from 'react'
import { Link } from 'react-router-dom'
import theme from '../utils/theme'
import { ThemeProvider } from '@mui/material/styles';

const Footer = () => {
  return (
    <ThemeProvider theme={theme}>
    <div className='flex justify-around bg-[#79a5d1]'>
      <Link to="/terms-of-use">Terms of Use</Link>
      <Link to="/privacy-policy">Privacy Policy</Link>
    </div>
    </ThemeProvider>
  )
}

export default Footer