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




const logoStyle = {
  width: '230px',
  height: '100px',
  cursor: 'pointer',
  marginLeft: '10px'
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
<div className="">
    <div className=" hidden md:block">
        <nav className={` h-28 p-4 flex justify-between items-center  z-50 w-full transition-all duration-500 ease-in-out ${userExists ? 'bg-[#d8f0f7]' : 'bg-[#d8f0f7]'} `}>
          {/* Logo on the left */}
          <Link className="text-black text-lg font-light" to="/">
          <img    
              
              src="https://i.postimg.cc/hG57FFyC/Untitled-design-1-removebg-preview.png"
              style={logoStyle}
              alt="logo of sitemark"
              onClick={() => navigate('/')}
            />
          </Link>

          {/* Navigation links on the right */}
          <div className="flex justify-around items-center space-x-4 text-black font-light">
            {!userExists ?
              (<span className=" p-2 space-x-2">
               <Button
                color="primary"
                variant="text"
                size="small"
                component="a"
                onClick={() => navigate('/login')}
                target="_blank"
              >
                 Log in
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
              </span>)
              :
              (
                <span className=" p-2 space-x-2">
                 <Button
                color="primary"
                variant="contained"
                size="small"
                component="a"
                onClick={() => navigate('/dashboard')}
                target="_blank"
              >      Dashboard
                </Button>
                
                </span>
              )}
          </div>
        </nav>
      </div>


       <div className='md:hidden flex flex-row justify-around bg-[#cff5ff] '>
       <img    
              
              src="https://i.postimg.cc/hG57FFyC/Untitled-design-1-removebg-preview.png"
              style={logoStyle}
              alt="logo of sitemark"
              onClick={() => navigate('/')}
            />
         {/* Hamburger icon */}
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
             {/* <MenuItem onClick={() => scrollToSection('features')}>
             Dubai Analytica
             </MenuItem> */}
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
             {!userExists ? (<MenuItem>
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
             </MenuItem>) :
               (<MenuItem>
                 <Button
                   color="primary"
                   variant="contained"
                   size="small"
                   component="a"
                   onClick={() => navigate('/dashboard')}
                   target="_blank"
                   sx={{ width: '100%' }}
                 >
                   Dashboard
                 </Button>
           </MenuItem>
               )}
       {!userExists ? (
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
               </MenuItem>) :
               null}
           </Box>
         </Drawer>
       </div>
       </div>
  );
}
export default HomeNavBar;