
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
};

const Footer = () => {
  return (
    <ThemeProvider theme={theme}>
    <Container 
      maxWidth='xl'
      style={{ 
        // backgroundImage: 'radial-gradient(ellipse 100% 200% at 50% 5%, hsl(210, 100%, 90%), transparent)',
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        backgroundColor:'#E0ECF5',
        padding: '20px 0', 
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
              src="https://i.postimg.cc/BnV5txb5/215b7754-0e37-41b2-be2f-453d190af861-1-removebg-preview.png"
              style={logoStyle}
              alt="logo of sitemark"
              onClick={() => navigate('/')}

            />
        <Typography sx={{
          color: '#000',
          fontSize: '0.8rem',
          paddingLeft: '40px',
          width: '50%',

        }}>
        Dubai Analytica is revolutionising data collection with advanced online survey solutions designed for businesses, researchers, and organisations. Our survey software offers a user-friendly interface, is analytics-enabled, and strong data security, Dubai Analytica enables users to create customized surveys that gather valuable insights efficiently. With pre-built templates, diverse question types, and powerful response analysis, the platform simplifies the process of collecting and interpreting data. Whether you’re seeking customer feedback, conducting market research, or assessing employee satisfaction, Dubai Analytica helps turn survey data into actionable strategies that drive growth and enhance decision-making.
        </Typography>
        <Stack direction='row' spacing={2} sx={{
          marginTop: '40px',
          color: '#000',
          paddingLeft: '40px',
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
          paddingLeft: '40px',
          fontSize: '0.8rem',
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