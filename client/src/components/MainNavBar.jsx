import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosWithCredentials, axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import { refreshToken } from '../utils/refreshToken';
import { ThemeProvider } from '@mui/material';
import theme from '../utils/theme';

const ResponsiveAppBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const navigationItems = [
    { label: 'Create A Survey', path: '/dashboard' },
    { label: 'Subscription', path: '/dashboard/subscription' },
    { label: 'Become a Pro Member', path: '/pricing' },
    { label: 'User Analytics', path: '/user-analytics' },
    ...(isSuperAdmin ? [{ label: 'Super Admin Data', path: '/admin-analytics' }] : []),
  ];

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = async () => {
    try {
      await axiosWithCredentials.post(`${backendUrl}/api/auth/logout`);
      localStorage.removeItem('dubaiAnalytica-userAccess');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        await refreshToken();
        const { data } = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user`);
        setIsSuperAdmin(data.isSuperAdmin);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('dubaiAnalytica-userAccess');
          navigate('/login');
        }
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <ThemeProvider theme={theme}>
      <AppBar 
        position="static" 
        elevation={1}
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters 
            sx={{ 
              minHeight: { xs: '56px', md: '70px' },
              justifyContent: 'space-between'
            }}
          >
            {/* Desktop Logo */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onClick={() => navigate('/')}
            >
              <img
                src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png"
                alt="Dubai Analytica"
                style={{ height: '70px', width: 'auto' }}
              />
            </Box>

            {/* Mobile Logo */}
            <Box 
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              <img
                src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png"
                alt="Dubai Analytica"
                style={{ height: '75px', width: 'auto' }}
              />
            </Box>

            {/* Mobile Navigation */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              right: '16px'
            }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                sx={{
                  color: 'black',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(74, 188, 227, 0.1)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiPaper-root': {
                    borderRadius: '8px',
                    marginTop: '8px',
                    width: '200px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {navigationItems.map((item) => (
                  <MenuItem 
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      py: 1.5,
                      backgroundColor: location.pathname === item.path ? 'rgba(74, 188, 227, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(74, 188, 227, 0.1)'
                      }
                    }}
                  >
                    <Typography textAlign="center">{item.label}</Typography>
                  </MenuItem>
                ))}
                <MenuItem onClick={() => {
                  handleLogout();
                  handleCloseNavMenu();
                }}>Logout</MenuItem>
              </Menu>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: 'black',
                    fontWeight: '500',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    backgroundColor: location.pathname === item.path ? 'rgba(74, 188, 227, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(74, 188, 227, 0.2)'
                    },
                    transition: 'all 0.2s'
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                onClick={handleLogout}
                sx={{
                  color: 'error.main',
                  fontWeight: '500',
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.1)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                Logout
              </Button>
            </Box>

            {/* User Menu */}
            {/* <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Settings">
                <IconButton 
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.2s'
                  }}
                >
                  <Avatar 
                    src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png"
                    alt="User"
                    sx={{ 
                      width: 40, 
                      height: 40,
                      border: '2px solid rgba(74, 188, 227, 0.2)'
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                sx={{
                  '& .MuiPaper-root': {
                    borderRadius: '8px',
                    marginTop: '8px',
                    minWidth: '150px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <MenuItem 
                  onClick={() => {
                    handleLogout();
                    handleCloseUserMenu();
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      color: 'red'
                    }
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box> */}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default ResponsiveAppBar;