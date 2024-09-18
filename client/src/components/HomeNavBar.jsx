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
    // <AppBar
    //   sx={{
    //     boxShadow: 0,
    //     bgcolor: 'transparent',
    //     mt: 2,
    //   }}
    // >
    //   <Container maxWidth="xl" sx={{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
    //   <Toolbar
    //       variant="dense"
    //       sx={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'space-between',
    //         flexShrink: 0,
    //         backgroundColor: '#DBE9B9',
    //         borderRadius: '999px',
    //         bgcolor: 'rgba(255, 255, 255, 0.1)',
    //         backdropFilter: 'blur(200px)',
    //         maxHeight: 40,
    //         border: '1px solid',
    //         borderColor: 'divider',
    //         width: '86%',
    //         boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
    //       }}
    //     >
          
    //   <img    
              
    //           src="https://i.postimg.cc/hG57FFyC/Untitled-design-1-removebg-preview.png"
    //           style={logoStyle}
    //           alt="logo of sitemark"
    //           onClick={() => navigate('/')}
    //         />
       
          
    //       <Box
    //         sx={{
    //           flexGrow: 1,
    //           display: 'flex',
    //           alignItems: 'center',
    //           ml: '-18px',
    //           px: 0,
    //         }}
    //       >
            
    //         <Box sx={{ display: { xs: 'none', md: 'flex' }, }}>
    //           <MenuItem
    //             onClick={() => scrollToSection('features')}
    //             sx={{ py: '6px', px: '12px' }}
    //           >
    //             {/* <Typography variant='body2' color='text.primary'>
    //               Dubai Analytica
    //             </Typography> */}
    //           </MenuItem>
    //           {/* <MenuItem
    //             onClick={() => scrollToSection('testimonials')}
    //             sx={{ py: '6px', px: '12px' }}
    //           >
    //             <Typography variant="body2" color="text.primary">
    //               Testimonials
    //             </Typography>
    //           </MenuItem>
    //           <MenuItem
    //             onClick={() => scrollToSection('highlights')}
    //             sx={{ py: '6px', px: '12px' }}
    //           >
    //             <Typography variant="body2" color="text.primary">
    //               Highlights
    //             </Typography>
    //           </MenuItem>
    //           <MenuItem
    //             onClick={() => scrollToSection('pricing')}
    //             sx={{ py: '6px', px: '12px' }}
    //           >
    //             <Typography variant="body2" color="text.primary">
    //               Pricing
    //             </Typography>
    //           </MenuItem>
    //           <MenuItem
    //             onClick={() => scrollToSection('faq')}
    //             sx={{ py: '6px', px: '12px' }}
    //           >
    //             <Typography variant="body2" color="text.primary">
    //               FAQ
    //             </Typography>
    //           </MenuItem> */}
    //         </Box>
    //       </Box>

    //       <Box
    //         sx={{
    //           display: { xs: 'none', md: 'flex' },
    //           gap: 0.5,
    //           alignItems: 'center',
    //         }}
    //       >
    //         {!userExists ?
    //           <Button
    //             color="primary"
    //             variant="text"
    //             size="small"
    //             component="a"
    //             onClick={() => navigate('/login')}
    //             target="_blank"
    //             href='/login'
    //           >
    //             Log in
    //           </Button>
    //           :
    //           (<Button
    //             color="primary"
    //             variant="contained"
    //             size="small"
    //             component="a"
    //             onClick={() => navigate('/dashboard')}
    //             target="_blank"
    //           >
    //             Dashboard
    //           </Button>)
    //         }

    //         {!userExists ?
    //           (<Button
    //             color='primary'
    //             variant="contained"
    //             size="small"
    //             component="a"
    //             onClick={() => navigate('/register')}
    //             target="_blank"
    //           >
    //             Sign up
    //           </Button>) : null}
    //       </Box>

    //       <Box sx={{ display: { sm: '', md: 'none' } }}>
    //         <Button
    //           variant="text"
    //           color="primary"
    //           aria-label="menu"
    //           onClick={toggleDrawer(true)}
    //           sx={{ minWidth: '30px', p: '4px' }}
    //         >
    //           <MenuIcon />

    //         </Button>
    //         <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>

    //           <Box
    //             sx={{
    //               minWidth: '60dvw',
    //               p: 2,
    //               backgroundColor: 'background.paper',
    //               flexGrow: 1,
    //             }}
    //           >
    //             {/* <MenuItem onClick={() => scrollToSection('features')}>
    //             Dubai Analytica
    //             </MenuItem> */}
    //             {/* <MenuItem onClick={() => scrollToSection('testimonials')}>
    //               Testimonials
    //             </MenuItem>
    //             <MenuItem onClick={() => scrollToSection('highlights')}>
    //               Highlights
    //             </MenuItem>
    //             <MenuItem onClick={() => scrollToSection('pricing')}>
    //               Pricing
    //             </MenuItem>
    //             <MenuItem onClick={() => scrollToSection('faq')}>
    //               FAQ
    //             </MenuItem> */}
    //             <Divider />
    //             {!userExists ? (<MenuItem>
    //               <Button
    //                 color="primary"
    //                 variant="contained"
    //                 component="a"
    //                 onClick={() => navigate('/register')}
    //                 target="_blank"
    //                 sx={{ width: '100%' }}
    //               >
    //                 Sign up
    //               </Button>
    //             </MenuItem>) :
    //               (<MenuItem>
    //                 <Button
    //                   color="primary"
    //                   variant="contained"
    //                   size="small"
    //                   component="a"
    //                   onClick={() => navigate('/dashboard')}
    //                   target="_blank"
    //                   sx={{ width: '100%' }}
    //                 >
    //                   Dashboard
    //                 </Button>
    //               </MenuItem>
    //               )}
    //             {!userExists ? (
    //               <MenuItem>
    //                 <Button
    //                   color="primary"
    //                   variant="outlined"
    //                   component="a"
    //                   onClick={() => navigate('/login')}
    //                   target="_blank"
    //                   sx={{ width: '100%' }}
    //                 >
    //                   Sign in
    //                 </Button>
    //               </MenuItem>) :
    //               null}
    //           </Box>
    //         </Drawer>
    //       </Box>
    //     </Toolbar>
    //   </Container>
    // </AppBar>
<div className="">
    <div className=" hidden md:block">
        <nav className={` h-28 p-4 flex justify-between items-center fixed z-50 w-full transition-all duration-500 ease-in-out ${userExists ? 'bg-[#cff5ff]' : ''} `}>
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
                href='/login'
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