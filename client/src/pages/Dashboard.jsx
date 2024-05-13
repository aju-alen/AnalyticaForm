import { useEffect, useState } from 'react'
import { backendUrl } from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';
import MySurvery from '../components/MySurvery';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';




const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [input, setInput] = useState(false);
    const [inputFeildVisible, setInputFeildVisible] = useState(false);
    const [inputText, setInputText] = useState(''); 
    const [userSurveyData, setUserSurveyData] = useState([]);

    const handleSubmit = async () => {
        try {
            setInputFeildVisible(true);
            if (input && inputFeildVisible && inputText.length > 0) {
                if(userSurveyData.length > 1){
                    alert('You can only create 2 surveys with a free account. Please upgrade to premium to create more surveys.');
                    return;
                }
                await refreshToken();
                const surveyResp = await axiosWithAuth.post(`${backendUrl}/api/survey/create`, { surveyTitle: inputText });
                console.log(surveyResp.data.newSurvey.id,'response');
                navigate(`/dashboard/create-survey/${surveyResp.data.newSurvey.id}`, { state: { surveyName: inputText } });
            }
        }
        catch (err) {
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
    const handleInputText = (e) => {
        setInputText(e.target.value)

        if (inputText.length > 0) {
            setInput(true);
        }

    }

    useEffect(() => {
        const getTest = async () => {
            try {
                await refreshToken();
                const getUserSurvey = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-survey`);
                setUserSurveyData(getUserSurvey.data);
                console.log(getUserSurvey.data);
                setIsLoading(false);
            }
            catch (err) {
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
        getTest();
    }, [])

    console.log(inputText);
    console.log(userSurveyData, 'surveyDatanames');



    return (
        isLoading? (
            <Box sx={{ display: 'flex', justifyContent:'center', alignItems:"center",height:'100vh' }}>
            <CircularProgress />
          </Box>
          ) : (
        <Box component="section" sx={{ p: { md: 10 }, pt: { xs: 10 } }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Fab onClick={handleSubmit} variant="extended" size="large" color="primary">
                        <AddIcon />
                        Create new survey
                    </Fab>
                </Grid>
                {inputFeildVisible && <Grid item>
                    <TextField
                        id="outlined-basic"
                        name='inputText'
                        value={inputText}
                        onChange={handleInputText}
                        label="Enter a name for the survey"
                        variant="filled"
                        size="small"
                        fullWidth
                    />
                </Grid>}
            </Grid>
            <MySurvery userSurveyData={userSurveyData} />
        </Box>)


    )
}

export default Dashboard