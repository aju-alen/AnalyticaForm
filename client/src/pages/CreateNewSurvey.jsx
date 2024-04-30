import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';
import { useNavigate } from 'react-router-dom';
import TemporaryDrawer from '../components/TempDrawer';
import SelectOneChoiceForm from '../components/SelectOneChoiceForm';
import SelectMultiPoint from '../components/SelectMultiPoint';
import { Stack } from '@mui/material';
import { nanoid } from 'nanoid'

const CreateNewSurvey = () => {

  const { surveyId } = useParams();
  const navigate = useNavigate();

  const [surveyData, setSurveyData] = useState({
    surveyTitle: '',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // drawer open close
  const [selectedItems, setSelectedItems] = useState([]); // selected items 

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleItemSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleFormChange = (e) => {
    setSurveyData({
      ...surveyData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmitForm = async () => {
    try {
      await refreshToken();
      const updateSurveyData = await axiosWithAuth.put(`${backendUrl}/api/survey/get-one-survey/${surveyId}`, surveyData);
      console.log(updateSurveyData.data, 'updateSurveyData');
      navigate('/dashboard');
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

  useEffect(() => {

    const getSurveyData = async () => {
      try {
        await refreshToken();
        const getUserSurveyData = await axiosWithAuth.get(`${backendUrl}/api/survey/get-one-survey/${surveyId}`);
        console.log(getUserSurveyData.data, 'getUserSurveyData');
        setSurveyData({
          surveyTitle: getUserSurveyData.data.surveyTitle,

        });

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
    getSurveyData();
  }, []);

  const selectItem = selectedItems.map((item,index) => {
    if (item === 'SingleForm') {
      return <SelectOneChoiceForm key={index}  />
    }
    else if (item === 'MultiForm') {
      return <SelectMultiPoint key={index}  />
    }

  });
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{
          bgcolor: 'brown',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexGrow: 1,
          height: '100%',
          mt: { xs: 4, md: 8 },
          width: '100%',
          boxShadow: 3,
          borderRadius: 1,
          p: 2,
        }} >

          <TextField fullWidth id="standard-basic" label="Standard" variant="standard" name='surveyTitle' value={surveyData.surveyTitle} onChange={handleFormChange} />
          <Stack spacing={2}>
            {selectItem}
          <Button variant="contained" color="primary" onClick={toggleDrawer}>
            Add Form
          </Button>
          </Stack>
        </Box>
        <Button variant="contained" color="primary" onClick={handleSubmitForm}>
            Submit
          </Button>
      </Container>
      
      <TemporaryDrawer open={isDrawerOpen} toggleDrawer={toggleDrawer} handleItemSelect={handleItemSelect} />

    </React.Fragment>

  )
}

export default CreateNewSurvey