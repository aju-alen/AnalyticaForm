import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import theme from '../utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';



const Hero = () => {
    const navigate = useNavigate();
    return (
        <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box
            id="hero"
            sx={{
                width: '100%',
                backgroundImage:
                    'radial-gradient(ellipse 100% 80% at 50% 5%, hsl(210, 100%, 90%), transparent)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover', // Ensures the gradient covers the whole box
            }}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 14, sm: 20 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                <Stack
                    spacing={2}
                    borderwidth='10px'
                    alignItems="center"
                    useFlexGap
                    sx={{ width: { xs: '100%', sm: '70%' } }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            fontSize: 'clamp(3rem, 10vw, 3.5rem)',
                        }}
                    >
                        Dubai&nbsp;
                        <Typography
                            component="span"
                            variant="h1"
                            sx={{
                                fontSize: 'inherit',
                                color: 'primary.main',
                            }}
                        >
                            Analytica
                        </Typography>
                    </Typography>
                    <Stack
                        spacing={3}
                        alignItems="center"
                        useFlexGap
                        sx={{ width: { xs: '100%', sm: '100%' } }}
                    >

                        <Typography
                            textAlign="center"
                            color="text.secondary"
                            sx={{ width: { sm: '100%', md: '80%' } }}
                        >
                            Ask the right questions to find the answers you need with Dubai Analytica, the best survey software that helps UAE based companies and individual teams with audience surveys. Create employee engagement surveys, customer surveys, market research surveys and more.
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/dashboard')}
                        >
                            Sign up free.
                        </Button>
                    </Stack>
                </Stack>
            </Container>
            {/* <Container
                maxWidth="xl"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pb: { xs: 8, sm: 12 },
                }}
            >

                <Typography
                    variant="h4"
                    textAlign="center"
                    sx={{ height: 'full'}}
                    fontWeight={200}
                    fontStyle={'italic'}
                    fontSize={'clamp(1.5rem, 5vw, 2rem)'}
                >
                    Survey software trusted by UAE&apos;s best companies
                </Typography>

            </Container> */}
            <Container
                maxWidth="xl"
                sx={{
                    // backgroundImage:
                    //     'radial-gradient(ellipse 100% 50% at 50% 5%, hsl(210, 100%, 90%), transparent)',
                    // backgroundRepeat: 'repeat-y',
                }}
            >
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 14, sm: 20 },
                        pb: { xs: 8, sm: 12 },

                    }}
                >
                    <Stack
                        spacing={2}
                        direction={{ xs: 'column', md: 'row' }}
                    >
                        <Stack
                            spacing={3}
                        >
                            <Typography
                                variant='h4'
                                sx={{
                                    width: { xs: '100%', sm: '100%' },
                                    fontWeight: 700,
                                }}
                            >Create remarkable surveys</Typography>
                            <Typography
                                textAlign=""
                                color="text.secondary"
                                sx={{ width: { sm: '100%', md: '80%' } }}
                            >
                                Reach your desired target audience by creating incredible surveys. Choose from multiple-choice question types, add logic, and customize with your branding. Your creativity sets the boundaries. And yes, it&apos;s incredibly easy! Discover how we make it happen.
                            </Typography>
                        </Stack>
                        <img src='https://i.postimg.cc/7LC9QbRX/first.png' width={700} alt="My GIF" />
                    </Stack>
                </Container>
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 14, sm: 20 },
                        pb: { xs: 8, sm: 12 },

                    }}
                >
                    <Stack
                        spacing={2}
                        direction={{ xs: 'column', md: 'row' }}
                    >
                        <img src='https://i.postimg.cc/7LC9QbRX/first.png' width={700} alt="My GIF" />
                        <Stack
                            spacing={3}
                        >
                            <Typography
                                variant='h4'
                                sx={{
                                    width: { xs: '100%', sm: '100%' },
                                    fontWeight: 700,
                                }}
                            >Fast-track better decision-making</Typography>
                            <Typography
                                textAlign=""
                                color="text.secondary"
                                sx={{ width: { sm: '100%', md: '80%' } }}
                            >
                                Our reports simplify your analysis. With real-time, shareable dashboards and a complete analytics suite, we empower you to quickly transform data into actionable insights.

                            </Typography>
                        </Stack>

                    </Stack>
                </Container>

                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 14, sm: 20 },
                        pb: { xs: 8, sm: 12 },

                    }}
                >
                    <Stack
                        spacing={2}
                        direction={{ xs: 'column', md: 'row' }}
                    >
                        <Stack
                            spacing={3}
                        >
                            <Typography
                                variant='h4'
                                sx={{
                                    width: { xs: '100%', sm: '100%' },
                                    fontWeight: 700,
                                }}
                            >Designed for enterprise use
                            </Typography>
                            <Typography
                                textAlign=""
                                color="text.secondary"
                                sx={{ width: { sm: '100%', md: '80%' } }}
                            >
                                We meet all the needs of today&apos;s modern enterprise. From robust security and time-saving integrations to advanced collaboration features, we've got it covered. Plus, our world-class account service team is here to support you every step of the way.

                            </Typography>
                        </Stack>
                        <img src='https://i.postimg.cc/dtcqL7dC/second.jpg' width={700} alt="My GIF" />
                    </Stack>
                </Container>

                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 14, sm: 20 },
                        pb: { xs: 8, sm: 12 },

                    }}
                >
                    <Stack
                        spacing={2}
                        direction={{ xs: 'column', md: 'row' }}
                    >
                        <img src='https://i.postimg.cc/7LC9QbRX/first.png' width={700} alt="My GIF" />

                        <Stack
                            spacing={3}
                        >
                            <Typography
                                variant='h4'
                                sx={{
                                    width: { xs: '100%', sm: '100%' },
                                    fontWeight: 700,
                                }}
                            >All round support
                            </Typography>
                            <Typography
                                textAlign=""
                                color="text.secondary"
                                sx={{ width: { sm: '100%', md: '80%' } }}
                            >
                                Working late into the night? Our support team is available 24/7. From dedicated enterprise account managers to live chat, we&apos;re committed to ensuring your research is successful, no matter the hour.

                            </Typography>
                        </Stack>
                    </Stack>
                </Container>
                <Container
                    maxWidth='md'
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 14, sm: 5 },
                        pb: { xs: 8, sm: 5 },
                        backgroundImage:
                            'radial-gradient(ellipse 40% 100% at 50% 40%, hsl(210, 100%, 90%), transparent)',
                        borderRadius: 3,
                    }}
                >
                    <Stack
                        spacing={2}
                    >
                        <Typography
                            variant="h4"
                            textAlign="center"
                            sx={{ height: 'full' }}
                            fontWeight={540}
                        >
                            Ready to Get started?
                        </Typography>

                        <Typography
                            variant="body1"
                            textAlign="center"
                            sx={{ height: 'full' }}

                        >
                            Make use of the best online survey software for reliable actionable insights.
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/dashboard')}
                            sx={{}}
                        >
                            Sign up free.
                        </Button>
                    </Stack>


                </Container>

                <Container
                maxWidth="xl"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 14, sm: 20 },
                        pb: { xs: 8, sm: 12 },

                    }}
                >
                    <Stack
                        spacing={2}
                    >
                    <Typography
                        variant="h4"
                        textAlign="center"
                        sx={{ height: 'full' }}
                        fontWeight={300}
                    >
                    The online survey software and data collection tool you need to uncover the right insights
                    </Typography>

                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ width: { sm: '100%', md: '100%' } }}
                    >
                    Be a part of the 150+ global companies that trust Dubai Analytica to achieve their research objectives.
                    </Typography>
                    </Stack>
                    <Divider
                        sx={{ width: '100%', mb: 5}}
                    ></Divider>    
                    <Stack
                        spacing={2}
                        direction={{ xs: 'column', md: 'row' }}
                    >
                       

                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant='h5' gutterBottom>
                                What is a survey software?
                                </Typography>

                                <Typography  variant='body1'>
                               <b>Survey software</b>  is an online solution that empowers you to design, distribute, and analyze surveys efficiently.
                                    <br/>
                                    <br/>
                                </Typography>
                                <Typography variant="p">
                                With <b>Dubai Analytica</b> survey software, you can gather comprehensive responses through our extensive distribution network.
                                    <br />
                                    <br/>
                                </Typography>
                                <Typography variant="p">
                                <b>Dubai Analytica</b> simplifies the creation of online surveys. You have access to visually engaging and fully customizable to your needs.
                                    <br />
                                    <br/>
                                </Typography>
                            </CardContent>
                            
                        </Card>

                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant='h5' gutterBottom>
                                Benefits of using survey software
                                </Typography>

                                <Typography  variant='p'>
                               <b>Survey software</b> provides the tools you need to gather critical data for success, enabling you to collect valuable insights quickly and analyze them with ease.
                                    <br/>
                                    <br/>
                                </Typography>
                                <Typography variant="p">
                                <b>Dubai Analytica</b> survey software offers time-saving features such as a question library, automated report generation, pre-built templates, and much more.
                                    <br />
                                    <br/>
                                </Typography>
                              
                            </CardContent>
                            
                        </Card>

                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant='h5' gutterBottom>
                                What&apos;s the best survey software?
                                </Typography>

                                <Typography  variant='p'>
                                The ideal survey software provides a comprehensive set of tools along with exceptional customer support to assist you with your project.
                                    <br/>
                                    <br/>
                                </Typography>
                                <Typography variant="p">
                                At <b>Dubai Analytica</b>, we excel in delivering both. Book a consultation today to discover the advantages of our survey software and learn how to optimize your research projects effectively.
                                    <br />
                                    <br/>
                                </Typography>
                               
                            </CardContent>
                            
                        </Card>

                    </Stack>

                </Container>
            </Container>
        </Box>
        </ThemeProvider>
    );
}

export default Hero