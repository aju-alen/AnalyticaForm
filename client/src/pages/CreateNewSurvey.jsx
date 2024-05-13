import React, { useEffect, useState, useRef } from 'react';
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
import SelectSingleRadio from '../components/SelectSingleRadio';
import SelectSingleCheckBox from '../components/SelectSingleCheckBox';
import { Stack } from '@mui/material';
import { uid } from 'uid';
import SelectMultiScalePoint from '../components/SelectMultiScalePoint';
import SelectMultiScaleCheckBox from '../components/SelectMultiScaleCheckBox';
import SelectMultiSpreadsheet from '../components/SelectMultiSpreadsheet';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import SelectDropdownMenu from '../components/SelectDropdownMenu';

const CreateNewSurvey = () => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [surveyData, setSurveyData] = useState({
    surveyTitle: '',
    surveyForms: [],
    selectedItems: []
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // drawer open close
  const [selectedItems, setSelectedItems] = useState([]); // selected items 

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleItemSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
    setSurveyData({ ...surveyData, surveyForms: [...surveyData.surveyForms, { id: uid(5), formType: item }] })
  };

  const handleFormChange = (e) => {
    setSurveyData({
      ...surveyData,
      [e.target.name]: e.target.value,
    });
  }
  const handleSaveSinglePointForm = (formData) => {
    console.log(formData, 'formData in the parent');

    // Check if the formData id exists in the surveyForms array
    const existingFormIndex = surveyData.surveyForms.findIndex(form => form.id === formData.id);

    if (existingFormIndex !== -1) {
      // If the form data already exists, update it
      setSurveyData(prevSurveyData => ({
        ...prevSurveyData,
        surveyForms: prevSurveyData.surveyForms.map((form, index) => {
          if (index === existingFormIndex) {
            return formData; // Update existing form data
          }
          return form; // Leave other form data unchanged
        })
      }));
    } else {
      // If the form data doesn't exist, add it to the surveyForms array
      setSurveyData(prevSurveyData => ({
        ...prevSurveyData,
        surveyForms: [...prevSurveyData.surveyForms, formData]
      }));
    }
  };



  const handleSaveSingleCheckForm = (formData) => {

    const existingFormIndex = surveyData.surveyForms.findIndex(form => form.id === formData.id);

    if (existingFormIndex !== -1) {
      // If the form data already exists, update it
      setSurveyData(prevSurveyData => ({
        ...prevSurveyData,
        surveyForms: prevSurveyData.surveyForms.map((form, index) => {
          if (index === existingFormIndex) {
            return formData; // Update existing form data
          }
          return form; // Leave other form data unchanged
        })
      }));
    } else {
      // If the form data doesn't exist, add it to the surveyForms array
      setSurveyData(prevSurveyData => ({
        ...prevSurveyData,
        surveyForms: [...prevSurveyData.surveyForms, formData]
      }));
    }

  }

  const handleSaveMultiScalePointForm = (formData) => {

    const existingFormIndex = surveyData.surveyForms.findIndex(form => form.id === formData.id);

    if (existingFormIndex !== -1) {
      // If the form data already exists, update it
      setSurveyData(prevSurveyData => ({
        ...prevSurveyData,
        surveyForms: prevSurveyData.surveyForms.map((form, index) => {
          if (index === existingFormIndex) {
            return formData; // Update existing form data
          }
          return form; // Leave other form data unchanged
        })
      }));
    } else {
      // If the form data doesn't exist, add it to the surveyForms array
      setSurveyData(prevSurveyData => ({
        ...prevSurveyData,
        surveyForms: [...prevSurveyData.surveyForms, formData]
      }));
    }

  }

  const handleSaveMultiScaleCheckboxForm = (formData) => {

    const existingFormIndex = surveyData.surveyForms.findIndex(form => form.id === formData.id);

    if (existingFormIndex !== -1) {
      // If the form data already exists, update it
      setSurveyData(prevSurveyData => ({
        ...prevSurveyData,
        surveyForms: prevSurveyData.surveyForms.map((form, index) => {
          if (index === existingFormIndex) {
            return formData; // Update existing form data
          }
          return form; // Leave other form data unchanged
        })
      }));
    } else {
      // If the form data doesn't exist, add it to the surveyForms array
      setSurveyData(prevSurveyData => ({
        ...prevSurveyData,
        surveyForms: [...prevSurveyData.surveyForms, formData]
      }));
    }

  }

  const handleDeleteSelectOneForm = (id) => {
    console.log(id, 'id in delete');
    const newSurveyForms = surveyData.surveyForms.filter(form => {
      console.log(form.id, 'form.id in delete filter');
      return form.id !== id
    });
    console.log(newSurveyForms, 'newSurveyForms in delete form filter');
    setSurveyData({ ...surveyData, surveyForms: newSurveyForms });

  }



  const handleSubmitForm = async () => {
    try {
      // handleSaveSinglePointForm();
      await refreshToken();
      const updateSurveyData = await axiosWithAuth.put(`${backendUrl}/api/survey/get-one-survey/${surveyId}`, surveyData);
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
        setSurveyData({

          surveyTitle: getUserSurveyData.data.surveyTitle,
          surveyForms: getUserSurveyData.data.surveyForms,
          selectedItems: getUserSurveyData.data.selectedItems

        });
        setSelectedItems(getUserSurveyData.data.selectedItems)
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
    getSurveyData();
  }, []);

  const selectItem = surveyData.surveyForms.map((item, index) => {
    console.log(item, 'item in selectItem mapppppppp');
    if (item.formType === 'SinglePointForm') {

      return (
        <Stack spacing={2} key={index} direction='row'>
          <SelectSingleRadio key={index} onSaveForm={handleSaveSinglePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'SingleCheckForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <SelectSingleCheckBox key={index} onSaveForm={handleSaveSingleCheckForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'MultiScalePoint') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <SelectMultiScalePoint key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'MultiScaleCheckBox') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <SelectMultiScaleCheckBox key={index} onSaveForm={handleSaveMultiScaleCheckboxForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'MultiSpreadsheet') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <SelectMultiSpreadsheet key={index} onSaveForm={handleSaveMultiScaleCheckboxForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'DropdownMenu') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <SelectDropdownMenu key={index} onSaveForm={handleSaveMultiScaleCheckboxForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

  });

  console.log(surveyData, 'surveyData in the parent');
  console.log(surveyData.surveyForms, 'surveyFormsssss in surveyData in the parent');
  return (
    isLoading ? (
      <Box sx={{ display: 'flex', justifyContent:'center', alignItems:"center",height:'100vh' }}>
      <CircularProgress />
    </Box>
    ) : (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <TextField
            fullWidth
            id="standard-basic"
            label="Survey Name"
            variant="standard"
            name='surveyTitle'
            value={surveyData.surveyTitle}
            onChange={handleFormChange}
            sx={{ mt: 2 }}
          />
          {surveyData.surveyForms.length > 0 &&
            <TextField
              id="outlined-basic"
              label="Survey URL"
              variant='filled'
              sx={{
                mt: 2,
                width: { xs: '100%', md: '42%' },
              }}
              value={`${frontendUrl}/user-survey/${surveyId}`}
            />}
  
          <Stack spacing={12}>
            {selectItem}
            <div className="flex justify-center">
              <Button
                sx={{
                  width: { xs: '100%', md: '20%' },
                  mt: 2,
                }}
                variant="contained"
                color="primary"
                onClick={toggleDrawer}>
                Add Form
              </Button>
            </div>
          </Stack>
          {/* <Box sx={{
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
          </Box> */}
  
         {surveyData.surveyForms.length > 0 && <Button
            fullWidth
            sx={{ mt: 2, }}
            variant="contained" color="success" onClick={handleSubmitForm}>
            Submit Your Survey
          </Button>}
          {/* <Button variant="contained" color="secondary" onClick={() => navigate(`/user-survey/${surveyId}`)}>Survey Link </Button> */}
        </Container>
  
        <TemporaryDrawer open={isDrawerOpen} toggleDrawer={toggleDrawer} handleItemSelect={handleItemSelect} />
  
      </React.Fragment>
    )
  );
  
}

export default CreateNewSurvey