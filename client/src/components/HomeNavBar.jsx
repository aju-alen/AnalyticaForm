import React, { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate,Link } from 'react-router-dom';

// Updated styles
const styles = {
  logo: {
    width: '180px',
    height: 'auto',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
  navbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
  button: {
    fontSize: '0.95rem',
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      transform: 'translateY(-1px)',
    }
  },
  actionButton: {
    background: 'linear-gradient(45deg, #2196F3, #1976D2)',
    color: 'white',
    fontWeight: 600,
    '&:hover': {
      background: 'linear-gradient(45deg, #1976D2, #1565C0)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }
  },
  mobileMenu: {
    '& .MuiDrawer-paper': {
      borderRadius: '16px 0 0 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    }
  }
};

function HomeNavBar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [userExists, setUserExists] = React.useState('');

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

  useEffect(() => {
    if (localStorage.getItem('userAccessToken')) {
      setUserExists(JSON.parse(localStorage.getItem('userAccessToken')));
    }
  }, []);
  console.log(userExists);

  return (
    <div>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <nav className={`h-20 px-6 flex justify-between items-center sticky top-0 z-50 w-full transition-all duration-300`} 
             style={styles.navbar}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img    
              src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png"
              style={styles.logo}
              alt="logo"
              className="hover:opacity-80"
            />
          </Link>

          {/* Main Navigation */}
          <div className="flex items-center space-x-8">
            <Button
              color="inherit"
              onClick={() => navigate('/about')}
              sx={styles.button}
            >
              About
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/menu2')}
              sx={styles.button}
            >
              Features
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/menu3')}
              sx={styles.button}
            >
              Pricing
            </Button>

            {/* Auth Buttons */}
            {!userExists ? (
              <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-gray-200">
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={styles.button}
                >
                  Log in
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{ ...styles.button, ...styles.actionButton }}
                >
                  Sign up
                </Button>
              </div>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{ ...styles.button, ...styles.actionButton }}
              >
                Dashboard
              </Button>
            )}

            {/* Contact Button */}
            <Button
              color="inherit"
              href="tel:+971567791074"
              startIcon={<span role="img" aria-label="phone">📞</span>}
              sx={styles.button}
            >
              056-7791074
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <nav className="flex items-center justify-between px-4 h-16" style={styles.navbar}>
          <Link to="/">
            <img    
              src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png"
              style={{ ...styles.logo, width: '140px' }}
              alt="logo"
              className="hover:opacity-80"
            />
          </Link>
          
          <Button
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <MenuIcon />
          </Button>
        </nav>

        <Drawer 
          anchor="right" 
          open={open} 
          onClose={toggleDrawer(false)}
          sx={styles.mobileMenu}
        >
          <Box sx={{ width: '280px', p: 3 }}>
            {['About', 'Features', 'Pricing'].map((text) => (
              <MenuItem
                key={text}
                onClick={() => {
                  navigate(`/${text.toLowerCase()}`);
                  setOpen(false);
                }}
                sx={{
                  borderRadius: '8px',
                  mb: 1,
                  p: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                {text}
              </MenuItem>
            ))}

            <Divider sx={{ my: 2 }} />

            {!userExists ? (
              <div className="space-y-2">
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    navigate('/login');
                    setOpen(false);
                  }}
                  sx={styles.button}
                >
                  Log in
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    navigate('/register');
                    setOpen(false);
                  }}
                  sx={{ ...styles.button, ...styles.actionButton }}
                >
                  Sign up
                </Button>
              </div>
            ) : (
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  navigate('/dashboard');
                  setOpen(false);
                }}
                sx={{ ...styles.button, ...styles.actionButton }}
              >
                Dashboard
              </Button>
            )}

            <MenuItem
              component="a"
              href="tel:+971567791074"
              sx={{
                borderRadius: '8px',
                mt: 2,
                p: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <span role="img" aria-label="phone" className="mr-2">📞</span>
              056-7791074
            </MenuItem>
          </Box>
        </Drawer>
      </div>
    </div>
  );
}

export default HomeNavBar;