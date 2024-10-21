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
import { Box, Grid, TextField, CircularProgress, Snackbar, Alert, Typography, Card, CardContent } from '@mui/material';

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
                if (userSurveyData.length > 5) {
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
    }, []);

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
    

    return isLoading ? (
       
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: '100vh' }}>
            <CircularProgress />
        </Box>
    ) : (
        <ThemeProvider theme={theme}>
        <Box component="section" sx={{ p: { md: 1 }, pt: { xs: 1 }, backgroundColor: '#f1f1f1', minHeight: '100vh' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#333' }}>
                Survey Dashboard
            </Typography>
            <Grid container spacing={3} alignItems="center" justifyContent="center" sx={{ py: 2 }}>
  <Grid item>
    <Fab
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
          transform: 'scale(1.1)',
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
          backgroundColor: 'white',
          borderRadius: 1,
          boxShadow: 1,
          transition: '0.3s',
          '& .MuiFilledInput-root': {
            backgroundColor: '#f5f5f5',
          },
          '&:hover .MuiFilledInput-root': {
            backgroundColor: '#e0e0e0',
          },
        }}
      />
    </Grid>
  )}
</Grid>

           
            <MySurvery userSurveyData={userSurveyData} isSubscribed={isSubscribed}  onDeleteSurvey={handleDeleteSurveyFromParent} />
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
