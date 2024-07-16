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
import CommentBox from '../components/CommentBox';
import SingleRowText from '../components/SingleRowText';
import EmailAddress from '../components/EmailAddress';
import ContactInformation from '../components/ContactInformation';
import StarRating from '../components/StarRating';
import SmileyRating from '../components/SmileyRating';
import ThumbsUpDown from '../components/ThumbsUpDown';
import SliderText from '../components/SliderText';
import DateTime from '../components/DateTime';
import { Stack } from '@mui/material';
import { uid } from 'uid';
import SelectMultiScalePoint from '../components/SelectMultiScalePoint';
import SelectMultiScaleCheckBox from '../components/SelectMultiScaleCheckBox';
import SelectMultiSpreadsheet from '../components/SelectMultiSpreadsheet';
import GoogleRecaptcha from '../components/GoogleRecaptcha';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import SelectDropdownMenu from '../components/SelectDropdownMenu';
import SurveyIntro from '../components/SurveyIntro';
import { ContentCopy } from '@mui/icons-material';

const CreateNewSurvey = () => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL
  const navigate = useNavigate();
  const { surveyId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [addIntro, setAddIntro] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // drawer open close
  const [selectedItems, setSelectedItems] = useState([]); // selected items 
  const [isSaved, setIsSaved] = useState('Saved'); // saved or not

  const [surveyData, setSurveyData] = useState({
    surveyTitle: '',
    surveyForms: [],
    selectedItems: [],
    surveyIntroduction: ''
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`${frontendUrl}user-survey/${surveyId}`).then(() => {
      console.log('Text copied to clipboard');
      
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

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

  const handleSaveIntro = (formData) => {
    console.log(formData, 'formData in the parent');
    setSurveyData({ ...surveyData, surveyIntroduction: formData });
  }

  const handleDeleteIntro = () => {
    setSurveyData({ ...surveyData, surveyIntroduction: '' });
    setAddIntro(false);
  }

  const handleAddIntro = () => {
    setAddIntro(true);
    if (surveyData.surveyIntroduction === '') {
      setSurveyData({
        ...surveyData, surveyIntroduction: `Hello:
    You are invited to participate in our survey [Project Description Here]. In this survey, approximately [Approximate Respondents] people will be asked to complete a survey that asks questions about [General Survey Process]. It will take approximately [Approximate Time] minutes to complete the questionnaire.
    
    Your participation in this study is completely voluntary. There are no foreseeable risks associated with this project. However, if you feel uncomfortable answering any questions, you can withdraw from the survey at any point. It is very important for us to learn your opinions.
    
    Your survey responses will be strictly confidential and data from this research will be reported only in the aggregate. Your information will be coded and will remain confidential. If you have questions at any time about the survey or the procedures, you may contact [Name of Survey Researcher] at [Phone Number] or by email at the email address specified below.` });
    }
    else {
      setSurveyData({ ...surveyData, surveyIntroduction: surveyData.surveyIntroduction });
    }
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

  const handleSaveDropdown = (formData) => {
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
          selectedItems: getUserSurveyData.data.selectedItems,
          surveyIntroduction: getUserSurveyData.data.surveyIntroduction

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
    console.log(item, 'item in selectItem mapppppppp',index);
    if (item.formType === 'SinglePointForm') {

      return (
        <Stack spacing={2} key={index} direction='row'>
          <SelectSingleRadio key={index} onSaveForm={handleSaveSinglePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} onSaveIndicator={setIsSaved} />
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
          <SelectSingleCheckBox key={index} onSaveForm={handleSaveSingleCheckForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
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
          <SelectMultiScalePoint key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
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
          <SelectMultiScaleCheckBox key={index} onSaveForm={handleSaveMultiScaleCheckboxForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
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
          <SelectMultiSpreadsheet key={index} onSaveForm={handleSaveMultiScaleCheckboxForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'SelectDropDownForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <SelectDropdownMenu key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'CommentBoxForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <CommentBox key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'SingleRowTextForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <SingleRowText key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'EmailAddressForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <EmailAddress key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'ContactInformationForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <ContactInformation key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'StarRatingForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <StarRating key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'SmileyRatingForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <SmileyRating key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'ThumbUpDownForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <ThumbsUpDown key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'SliderTextForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <SliderText key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'DateTimeForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <DateTime key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'GoogleRecaptchaForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <GoogleRecaptcha key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
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
  // console.log(surveyData.surveyForms, 'surveyFormsssss in surveyData in the parent');
  return (
    isLoading ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: '100vh' }}>
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
            (<div className=' flex flex-row justify-center items-center'>
              <TextField
                id="outlined-basic"
                label="Survey URL"
                variant='filled'
                sx={{
                  mt: 2,
                  width: { xs: '100%', md: '42%' },
                }}
                value={`${frontendUrl}user-survey/${surveyId}`}
              />
              <Button
                sx={{ mt: 2 }}
                variant='text'
                onClick={handleCopy}
                startIcon={<ContentCopy />}
              >
              </Button>

              { isSaved }

            </div>
            )

          }

          <Stack spacing={12}>
            {addIntro && <Stack spacing={2} direction='row'>
              <SurveyIntro onSaveForm={handleSaveIntro} data={surveyData.surveyIntroduction} disableText={false} disableButtons={false} />
              <Button
                color="secondary"
                size='large'
                onClick={handleDeleteIntro}>
                <CancelIcon />
              </Button>
            </Stack>}
            {selectItem}
            <div className="flex justify-center">
              <Stack spacing={2} direction='row'>
                <Button
                  sx={{
                    width: { xs: '100%', md: '90%' },
                    mt: 2,
                  }}
                  variant="contained"
                  color="primary"
                  onClick={toggleDrawer}>
                  Add Form
                </Button>
                <Button
                  sx={{
                    width: { xs: '100%', md: '100%' },
                    mt: 2,
                  }}
                  variant="contained"
                  color="primary"
                  onClick={
                    handleAddIntro
                  }>
                  Show Form Intro
                </Button>
              </Stack>
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

          <Button
            fullWidth
            sx={{ mt: 2, }}
            variant="contained" color="success" onClick={handleSubmitForm}>
            Submit Your Survey
          </Button>
          {/* <Button variant="contained" color="secondary" onClick={() => navigate(`/user-survey/${surveyId}`)}>Survey Link </Button> */}
        </Container>

        <TemporaryDrawer open={isDrawerOpen} toggleDrawer={toggleDrawer} handleItemSelect={handleItemSelect} />

      </React.Fragment>
    )
  );

}

export default CreateNewSurvey