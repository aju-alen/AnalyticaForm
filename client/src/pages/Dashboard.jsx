import { useEffect, useState } from 'react'
import { backendUrl } from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';
import MySurvery from '../components/MySurvery';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';
import { Box, Grid, TextField, CircularProgress, Snackbar, Alert, Typography, Card, CardContent, Button } from '@mui/material';
import Joyride, { STATUS } from 'react-joyride';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [input, setInput] = useState(false);
    const [inputFeildVisible, setInputFeildVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [userSurveyData, setUserSurveyData] = useState([]);
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [dataChanged, setDataChanged] = useState(false);
    const [runTour, setRunTour] = useState(false);

    useEffect(() => {
        const getUserIsProMember = async () => {
            const userId = JSON.parse(localStorage.getItem('userAccessToken')).id;
            const userProMember = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user-promember/${userId}`);
            const date = new Date();
            const unixTimestamp = Math.floor(date.getTime() / 1000);

            if (userProMember?.data?.subscriptionPeriodEnd && userProMember?.data?.subscriptionPeriodEnd > unixTimestamp) {
                setIsSubscribed(true);
            }
        };
        getUserIsProMember();
    }, []);

    const handleClick = () => setOpen(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {
            setInputFeildVisible(true);
            if (input && inputFeildVisible && inputText.length > 0) {
                if (userSurveyData.length > 4) {
                    alert('You can only create 5 surveys with a free account. Please upgrade to premium.');
                    return;
                }
                await refreshToken();
                const surveyResp = await axiosWithAuth.post(`${backendUrl}/api/survey/create`, { surveyTitle: inputText });
                navigate(`/dashboard/create-survey/${surveyResp.data.newSurvey.id}`, { state: { surveyName: inputText } });
            }
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('userAccessToken');
                navigate('/login');
            } else {
                console.log(err);
            }
        }
    };

    const handleInputText = (e) => {
        setInputText(e.target.value);
        setInput(inputText.length > 0);
    };

    useEffect(() => {
        const getTest = async () => {
            try {
                await refreshToken();
                const getUserSurvey = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-survey`);
                setUserSurveyData(getUserSurvey.data);
                setIsLoading(false);
            } catch (err) {
                if (err.response.status === 401) {
                    localStorage.removeItem('userAccessToken');
                    navigate('/login');
                } else {
                    console.log(err);
                }
            }
        };
        getTest();
    }, [dataChanged]);

    useEffect(() => {
        const adminResponseLimit = userSurveyData.map((survey) => survey.surveyResponses);
        if (adminResponseLimit.filter((response) => response > 500).length > 0) {
            handleClick();
            setAlertMessage('Your survey has exceeded the response limit. Please upgrade to premium.');
            setAlertColor('warning');
        }
    }, [userSurveyData]);

    const handleDeleteSurveyFromParent = (surveyId) => {
        console.log('delete survey from parent', surveyId);
        
        setUserSurveyData(userSurveyData.filter((survey) => survey.id !== surveyId));
      };
    
    // Add tour steps
    const steps = [
        {
            target: '.survey-dashboard-title',
            content: 'Welcome to your Survey Dashboard! This is where you can manage all your surveys.',
            disableBeacon: true,
        },
        {
            target: '.subscription-card',
            content: 'Check your current subscription plan and upgrade for more features!',
        },
        {
            target: '.create-survey-button',
            content: 'Click here to create a new survey. Free users can create up to 5 surveys.',
        },
        {
            target: '.survey-list',
            content: 'All your created surveys will appear here. You can view responses, share, or delete them.',
        },
    ];

    // Add tour callback
    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunTour(false);
            // Optionally save to localStorage that user has seen the tour
            localStorage.setItem('dashboardTourComplete', 'true');
        }
    };

    // Check if user should see tour
    useEffect(() => {
        const tourComplete = localStorage.getItem('dashboardTourComplete');
        if (!tourComplete) {
            setRunTour(true);
        }
    }, []);

    return isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: '100vh' }}>
            <CircularProgress />
        </Box>
    ) : (
        <ThemeProvider theme={theme}>
            <Joyride
                steps={steps}
                run={runTour}
                continuous={true}
                showProgress={true}
                showSkipButton={true}
                callback={handleJoyrideCallback}
                styles={{
                    options: {
                        primaryColor: theme.palette.primary.main,
                        zIndex: 10000,
                    },
                }}
            />
            <Box component="section" sx={{ p: { md: 1 }, pt: { xs: 1 }, backgroundColor: '#f1f1f1', minHeight: '100vh' }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3, 
                    px: 3 
                }}>
                    <Typography 
                        className="survey-dashboard-title"
                        variant="h4" 
                        sx={{ color: '#333' }}
                    >
                        Survey Dashboard
                    </Typography>
                    <Card 
                        className="subscription-card"
                        sx={{ 
                            maxWidth: 200,
                            backgroundColor: isSubscribed ? '#4caf50' : '#2196f3',
                            color: 'white',
                            transform: 'rotate(3deg)'
                        }}
                    >
                        <CardContent>
                        <Button onClick={() => navigate('/pricing')
                        } sx={{ textTransform: 'none', textDecoration: 'none', color:'#fff' }
                        }>
                            <div className=" flex flex-col">
                            <Typography variant="h6" component="div">
                                {isSubscribed ? 'Premium Plan' : 'Free Plan'}
                            </Typography>
                            <Typography variant="body2">
                                {isSubscribed 
                                    ? 'Unlimited surveys & responses' 
                                    : 'Limited to 5 surveys & 500 responses'}
                            </Typography>
                                    {!isSubscribed && (
                                    <Button
                                    variant='contained'
                                    color='warning'
                                    sx={{
                                        textTransform: 'none',
                                    }}
                                    >
                                        See Plans
                                    </Button>
                                )}
                            </div>
                        </Button>
                        </CardContent>
                    </Card>
                </Box>

                <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ 
                    py: 2,
                    px: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 2,
                    mx: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <Grid item>
                        <Fab
                            className="create-survey-button"
                            onClick={handleSubmit}
                            variant="extended"
                            size="large"
                            color="primary"
                            sx={{
                                fontWeight: 'bold',
                                boxShadow: 3,
                                textTransform: 'none',
                                transition: '0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <AddIcon sx={{ mr: 1 }} />
                            Create New Survey
                        </Fab>
                    </Grid>

                    {inputFeildVisible && (
                        <Grid item>
                            <TextField
                                id="outlined-basic"
                                name="inputText"
                                value={inputText}
                                onChange={handleInputText}
                                label="Enter Survey Name"
                                variant="filled"
                                size="small"
                                fullWidth
                                sx={{
                                    minWidth: 250,
                                    backgroundColor: 'white',
                                    borderRadius: 1,
                                    boxShadow: 1,
                                    '& .MuiFilledInput-root': {
                                        backgroundColor: '#ffffff',
                                        transition: '0.3s',
                                    },
                                    '&:hover .MuiFilledInput-root': {
                                        backgroundColor: '#f8f8f8',
                                    },
                                }}
                            />
                        </Grid>
                    )}
                </Grid>

                <Box sx={{ px: 3, mt: 3 }} className="survey-list">
                    <MySurvery 
                        userSurveyData={userSurveyData} 
                        isSubscribed={isSubscribed}  
                        onDeleteSurvey={handleDeleteSurveyFromParent} 
                        handleDataChanged={setDataChanged} 
                    />
                </Box>
                
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={alertColor} variant="filled" sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard;
