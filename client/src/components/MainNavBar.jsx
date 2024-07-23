import  React,{useEffect,useState} from 'react';
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
import { useNavigate } from 'react-router-dom';
import { axiosWithCredentials,axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import { useLocation } from 'react-router-dom';
import { refreshToken } from '../utils/refreshToken';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material';



const logoStyleDextop = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
};
const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
};

function ResponsiveAppBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const userSurveyPage =  currentPath.startsWith('/user-survey');
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    navigate('/dashboard');
    setAnchorElNav(null);
  };
  const handleCloseProductDisplay = () => {
    navigate('/product-display');
    setAnchorElNav(null);
  };
  const handleCloseAdminAnalytics = () => {
    navigate('/admin-analytics');
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async() => {
    try{
      const testResp = await axiosWithCredentials.post(`${backendUrl}/api/auth/logout`);

      console.log(testResp,'logout response');
      localStorage.removeItem('userAccessToken');
      navigate('/');
    }
    catch(error){
      console.log(error)
    }
  }
  
  useEffect(() => {
    const checkUser = async () => {
      try{
        await refreshToken();
        const getUserData = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user`);
        console.log(getUserData.data, 'userData');
        console.log(getUserData.data.isSuperAdmin, 'isSuperAdmin');
        setIsSuperAdmin(getUserData.data.isSuperAdmin);
      }
      catch(err){
        if (err.response.status === 401) {
          console.log('unauthorized');
          localStorage.removeItem('userAccessToken');
          navigate('/login');
        }
        else {
          console.log(err);
        }
      }
    }
    checkUser();
  }, []);


  return (
    <ThemeProvider theme={theme}>
    <AppBar position="static">
      <Container maxWidth="xl" sx={{
        backgroundColor: 'white',
        borderRadius: '5px',
      }}>
        <Toolbar disableGutters>

          <Box sx={{ flexGrow:1, display:{xs:"none",md:"flex",}, 
          height: 50,
          width: 25,
        }}>
          
          <img className='hidden mr-4 md:flex' 
              src="https://i.postimg.cc/BnV5txb5/215b7754-0e37-41b2-be2f-453d190af861-1-removebg-preview.png"
              style={logoStyleDextop}
              alt="logo of Dubai Analytica"
              onClick={() => navigate('/')}
            />
            </Box>

          <Box sx={{ flexGrow:0.5 , display: { xs: 'flex', md: 'none' },  }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" onClick={()=> navigate('/dashboard')}>Create Your Survey Now</Typography>
                </MenuItem>

                <MenuItem onClick={handleCloseProductDisplay}>
                  <Typography textAlign="center" onClick={()=> navigate('/product-display')}>Become A Pro Member</Typography>
                </MenuItem>

                {isSuperAdmin && <MenuItem onClick={handleCloseAdminAnalytics}>
                  <Typography textAlign="center" onClick={()=> navigate('/admin-analytics')}>Analytics</Typography>
                </MenuItem>}              
            </Menu>
          </Box>
          <Box sx={{ flexGrow:0.5 , display: { xs: 'flex', md: 'none' },  }}>
          <img  
               src="https://i.postimg.cc/BnV5txb5/215b7754-0e37-41b2-be2f-453d190af861-1-removebg-preview.png"
              style={logoStyle}
              alt="logo of sitemark"
              onClick={() => navigate('/')}
            />
            </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
           
              <Button
                onClick={()=>navigate('/dashboard')}
                sx={{color: 'black', fontWeight:'500', display: 'block',":hover":{backgroundColor: '#4ABCE3'} }}
              >
                Create A Survey
              </Button>

              <Button
                onClick={()=>navigate('/product-display')}
                sx={{color: 'black',fontWeight:'500',  display: 'block',":hover":{backgroundColor: '#4ABCE3'} }}              >
                Become a pro member
              </Button>

             {isSuperAdmin && <Button
                onClick={()=>navigate('/admin-analytics')}
                sx={{color: 'black',fontWeight:'500' ,display: 'block',":hover":{backgroundColor: '#4ABCE3'} }}              >
                Analytics
              </Button>}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="https://i.postimg.cc/vZMZJJXH/avatar-3814049-640-1-removebg-preview.png" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                {/* <MenuItem  onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem> */}
                <MenuItem  onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={handleLogout}>Logout</Typography>
                </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </ThemeProvider>
  );
}
export default ResponsiveAppBar;