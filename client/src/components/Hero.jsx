import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';


const Hero = () => {
    return (
        <Box
            id="hero"
            sx={{
                width: '100%',
                backgroundImage:
                    'radial-gradient(ellipse 100% 50% at 50% 5%, hsl(210, 100%, 90%), transparent)',
                backgroundRepeat: 'no-repeat',
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
                        Easy&nbsp;
                        <Typography
                            component="span"
                            variant="h1"
                            sx={{
                                fontSize: 'inherit',
                                color: 'primary.main',
                            }}
                        >
                            Survey
                        </Typography>
                    </Typography>
                    <Stack 
                        alignItems="center"
                        useFlexGap
                        sx={{ width: { xs: '100%', sm: '100%' } }}
                    >
                    <Typography
                        textAlign="justify"
                        color="text.secondary"
                        sx={{ width: { sm: '100%', md: '80%' } }}
                    >
                       With Easy Survey, you can seamlessly create, customize, and distribute surveys to your audience with ease. Whether it's gathering customer feedback, conducting market research, or collecting employee opinions, our platform streamlines the process for you. 
                    </Typography>
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ width: { sm: '100%', md: '80%' } }}
                    >
                        Gain actionable insights and access survey data 
                    </Typography>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

export default Hero