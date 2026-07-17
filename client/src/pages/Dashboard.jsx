import { useEffect, useState } from 'react'
import { backendUrl } from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';
import MySurvery from '../components/MySurvery';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { ThemeProvider, alpha } from '@mui/material/styles';
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
    const [runTour, setRunTour] = useState(false); // make it dynamic 

    useEffect(() => {
        const getUserIsProMember = async () => {
            const userId = JSON.parse(localStorage.getItem('dubaiAnalytica-userAccess')).id;
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
                await refreshToken();
                
                if (userSurveyData.length > 4) {
                    // Check if user is a pro member before showing warning
                    const userId = JSON.parse(localStorage.getItem('dubaiAnalytica-userAccess')).id;
                    const userProMember = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user-promember/${userId}`);
                    const date = new Date();
                    const unixTimestamp = Math.floor(date.getTime() / 1000);
                    
                    const isProMember = userProMember?.data?.subscriptionPeriodEnd && userProMember.data.subscriptionPeriodEnd > unixTimestamp;
                    
                    if (!isProMember) {
                        // Not a pro member, show warning
                        setAlertMessage('You can only create 5 surveys with a free account. Please upgrade to premium.');
                        setAlertColor('warning');
                        setOpen(true);
                        return;
                    }
                    // Pro member, proceed with creating survey
                }
                
                const surveyResp = await axiosWithAuth.post(`${backendUrl}/api/survey/create`, { surveyTitle: inputText });
                navigate(`/dashboard/create-survey/${surveyResp.data.newSurvey.id}`, { state: { surveyName: inputText } });
            }
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.removeItem('dubaiAnalytica-userAccess');
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
                    localStorage.removeItem('dubaiAnalytica-userAccess');
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

    const totalResponses = userSurveyData.reduce((acc, survey) => acc + (survey.surveyResponses || 0), 0);
    const activeSurveys = userSurveyData.filter((survey) => survey.surveyStatus === 'Active').length;
    const recentSurvey = userSurveyData[0]?.surveyTitle || 'No surveys yet';
    const primaryColor = 'rgb(25, 118, 210)';

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
            <Box
                component="section"
                sx={{
                    p: { xs: 2, md: 3 },
                    minHeight: '100vh',
                    backgroundColor: '#f5f8fc',
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3,
                    px: { xs: 1, md: 3 },
                    py: 2.5,
                    borderRadius: 4,
                    backgroundColor: primaryColor,
                    border: `1px solid ${alpha(primaryColor, 0.45)}`,
                    boxShadow: `0 20px 40px ${alpha(primaryColor, 0.25)}`
                }}>
                    <Box>
                        <Typography
                            className="survey-dashboard-title"
                            variant="h4"
                            sx={{
                                color: '#f8fafc',
                                fontWeight: 900,
                                letterSpacing: 0.3
                            }}
                        >
                            Survey Dashboard
                        </Typography>
                        <Typography sx={{ color: alpha('#f8fafc', 0.88), mt: 0.5 }}>
                            Create, manage, and track all surveys from one place.
                        </Typography>
                    </Box>
                    <Card 
                        className="subscription-card"
                        sx={{ 
                            display: { xs: 'none', md: 'block' },
                            maxWidth: 240,
                            borderRadius: 3,
                            backgroundColor: isSubscribed ? '#2e7d32' : primaryColor,
                            color: 'white',
                            border: `1px solid ${alpha('#ffffff', 0.24)}`,
                            boxShadow: `0 18px 30px ${alpha('#0f172a', 0.35)}`,
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
                                    sx={{
                                        textTransform: 'none',
                                        mt: 1,
                                        backgroundColor: alpha('#ffffff', 0.2),
                                        color: '#ffffff',
                                        border: `1px solid ${alpha('#ffffff', 0.38)}`,
                                        '&:hover': {
                                            backgroundColor: alpha('#ffffff', 0.3),
                                        },
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

                <Grid container spacing={2} sx={{ px: { xs: 1, md: 3 }, mb: 3 }}>
                    {[
                        { label: 'Total Surveys', value: userSurveyData.length },
                        { label: 'Active Surveys', value: activeSurveys },
                        { label: 'Total Responses', value: totalResponses },
                        { label: 'Latest Survey', value: recentSurvey, isText: true },
                    ].map((item) => (
                        <Grid key={item.label} item xs={12} sm={6} lg={3}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    height: '100%',
                                    backgroundColor: alpha('#ffffff', 0.88),
                                    border: `1px solid ${alpha(primaryColor, 0.25)}`,
                                    boxShadow: `0 14px 28px ${alpha(primaryColor, 0.08)}`,
                                }}
                            >
                                <CardContent>
                                    <Typography sx={{ color: primaryColor, fontWeight: 700, fontSize: 13 }}>
                                        {item.label}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#0f172a',
                                            fontWeight: 900,
                                            mt: 0.5,
                                            fontSize: item.isText ? 15 : 30,
                                            lineHeight: 1.2,
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {item.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{
                    py: 2.5,
                    px: { xs: 1, md: 2 },
                    backgroundColor: alpha('#ffffff', 0.9),
                    borderRadius: 3,
                    border: `1px solid ${alpha(primaryColor, 0.3)}`,
                    boxShadow: `0 16px 32px ${alpha(primaryColor, 0.08)}`
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
                                color: '#eff6ff',
                                boxShadow: `0 12px 24px ${alpha(primaryColor, 0.2)}`,
                                textTransform: 'none',
                                backgroundColor: primaryColor,
                                transition: '0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: `0 16px 28px ${alpha(primaryColor, 0.24)}`,
                                    backgroundColor: primaryColor,
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
                                    borderRadius: 2,
                                    boxShadow: `0 10px 22px ${alpha(primaryColor, 0.1)}`,
                                    '& .MuiFilledInput-root': {
                                        backgroundColor: alpha('#ffffff', 0.9),
                                        borderRadius: 2,
                                        border: `1px solid ${alpha(primaryColor, 0.24)}`,
                                        transition: '0.3s',
                                        '&:before, &:after': {
                                            display: 'none',
                                        },
                                    },
                                    '&:hover .MuiFilledInput-root': {
                                        backgroundColor: '#ffffff',
                                        border: `1px solid ${alpha(primaryColor, 0.36)}`,
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: primaryColor,
                                    },
                                }}
                            />
                        </Grid>
                    )}
                </Grid>

                <Box
                    sx={{
                        px: { xs: 1, md: 3 },
                        mt: 3,
                        py: 2.5,
                        borderRadius: 3,
                        backgroundColor: alpha('#ffffff', 0.9),
                        border: `1px solid ${alpha(primaryColor, 0.2)}`,
                        boxShadow: `0 18px 35px ${alpha(primaryColor, 0.08)}`
                    }}
                    className="survey-list"
                >
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
