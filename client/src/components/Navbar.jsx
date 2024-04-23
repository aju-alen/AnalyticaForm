import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';




const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
};

function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);


  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };


  return (
    <AppBar
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          variant="regular"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            borderRadius: '999px',
            bgcolor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(24px)',
            maxHeight: 40,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
          }}
        >



          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              ml: '-18px',
              px: 0,
            }}
          >

            <img
              src="https://i.postimg.cc/jqDGBvw9/Scientific-Journals-Portal-logo-03.png"
              style={logoStyle}
              alt="logo of sitemark"
              onClick={() => navigate('/')}
            />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, }}>
              <MenuItem
                onClick={() => scrollToSection('features')}
                sx={{ py: '6px', px: '12px' }}
              >
                <Typography variant='body2' color='text.primary'>
                  Easy Survey
                </Typography>
              </MenuItem>
              {/* <MenuItem
                onClick={() => scrollToSection('testimonials')}
                sx={{ py: '6px', px: '12px' }}
              >
                <Typography variant="body2" color="text.primary">
                  Testimonials
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => scrollToSection('highlights')}
                sx={{ py: '6px', px: '12px' }}
              >
                <Typography variant="body2" color="text.primary">
                  Highlights
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => scrollToSection('pricing')}
                sx={{ py: '6px', px: '12px' }}
              >
                <Typography variant="body2" color="text.primary">
                  Pricing
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => scrollToSection('faq')}
                sx={{ py: '6px', px: '12px' }}
              >
                <Typography variant="body2" color="text.primary">
                  FAQ
                </Typography>
              </MenuItem> */}
            </Box>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 0.5,
              alignItems: 'center',
            }}
          >
            <Button
              color="primary"
              variant="text"
              size="small"
              component="a"
              onClick={() => navigate('/login')}
              target="_blank"
            >
              Sign in
            </Button>
            <Button
              color='primary'
              variant="contained"
              size="small"
              component="a"
              onClick={() => navigate('/register')}
              target="_blank"
            >
              Sign up
            </Button>
          </Box>

          <Box sx={{ display: { sm: '', md: 'none' } }}>
            <Button
              variant="text"
              color="primary"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ minWidth: '30px', p: '4px' }}
            >
              <MenuIcon />

            </Button>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>

              <Box
                sx={{
                  minWidth: '60dvw',
                  p: 2,
                  backgroundColor: 'background.paper',
                  flexGrow: 1,
                }}
              >
                <MenuItem onClick={() => scrollToSection('features')}>
                  Easy Survey
                </MenuItem>
                {/* <MenuItem onClick={() => scrollToSection('testimonials')}>
                  Testimonials
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('highlights')}>
                  Highlights
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('pricing')}>
                  Pricing
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('faq')}>
                  FAQ
                </MenuItem> */}
                <Divider />
                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    component="a"
                   onClick={() => navigate('/register')}
                    target="_blank"
                    sx={{ width: '100%' }}
                  >
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    component="a"
                    onClick={() => navigate('/login')}
                    target="_blank"
                    sx={{ width: '100%' }}
                  >
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;