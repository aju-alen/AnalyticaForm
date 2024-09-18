
import React from 'react'
import { Link } from 'react-router-dom'
import theme from '../utils/theme'
import { ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const logoStyle = {
  width: '240px',
  height: '120px',
  cursor: 'pointer',
  marginLeft: '114px'
};

const Footer = () => {
  return (
    <ThemeProvider theme={theme}>
    <Container 
      maxWidth='xl'
      sx={{ 
        // backgroundImage: 'radial-gradient(ellipse 100% 200% at 50% 5%, hsl(210, 100%, 90%), transparent)',
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        backgroundColor:'#E0ECF5',
        color: '#495057', 
      }}
    > 
    <Stack 
      direction="row" 
      spacing={2} 
    >

      {/* First section */}
      <Stack 
        direction="column" 
        spacing={1}
      >
        <Container maxWidth='md'>
        <img
              src="https://i.postimg.cc/hG57FFyC/Untitled-design-1-removebg-preview.png"
              style={logoStyle}
              alt="logo of sitemark"
              onClick={() => navigate('/')}

            />
        <Typography sx={{
          color: '#000',
          fontSize: '0.8rem',
          width: {xs:'80%',md:'50%'},

          marginLeft: {xs:'10px',md:'114px'}

        }}>
        Dubai Analytica is revolutionising data collection with advanced online survey solutions designed for businesses, researchers, and organisations. Our survey software offers a user-friendly interface, is analytics-enabled, and strong data security, Dubai Analytica enables users to create customized surveys that gather valuable insights efficiently. With pre-built templates, diverse question types, and powerful response analysis, the platform simplifies the process of collecting and interpreting data. Whether you’re seeking customer feedback, conducting market research, or assessing employee satisfaction, Dubai Analytica helps turn survey data into actionable strategies that drive growth and enhance decision-making.
        </Typography>
        <Stack direction='row' spacing={2} sx={{
          marginTop: '40px',
          color: '#000',
          marginLeft: {xs:'10px',md:'114px'}
        }}>
        <Typography fontSize='0.8rem'>
          <Link to='dapp/privacy-policy'>Privacy Policy</Link>
        </Typography>
        <Typography fontSize='0.8rem'>
          <Link to='/terms-of-use'>Terms of Use</Link>
        </Typography>
        </Stack>
        <Typography sx={{
          color: '#000',
          fontSize: '0.8rem',
          marginLeft: '114px'
        }}>
          Copyright © 2024 <Link to='/' >Dubai Analytica</Link>
        </Typography>
        </Container>

      </Stack>
      {/* End of First section */}

    </Stack>
    </Container>
    </ThemeProvider>
  )
}

export default Footer