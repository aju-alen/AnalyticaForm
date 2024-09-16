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
import Calender from '../components/Calender';
import DateTime from '../components/DateTime';
import CountrySlect from '../components/CountrySlect';
import RankOrder from '../components/RankOrder';
import ConstantSum from '../components/ConstantSum';
import NumericSlider from '../components/NumericSlider';
// import SelectOneImage from '../components/SelectOneImage';
import SelectMultipleImage from '../components/SelectMultipleImage';
import RankOrderImage from '../components/RankOrderImage';
import PresentationText from '../components/PresentationText';
import SectionHeading from '../components/SectionHeading';
import SectionSubHeading from '../components/SectionSubHeading';
import PickAndRank from '../components/PickAndRank';
import { Paper, Stack } from '@mui/material';
import { uid } from 'uid';
import SelectMultiScalePoint from '../components/SelectMultiScalePoint';
import SelectMultiScaleCheckBox from '../components/SelectMultiScaleCheckBox';
import SelectMultiSpreadsheet from '../components/SelectMultiSpreadsheet';
import GoogleRecaptcha from '../components/GoogleRecaptcha';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import SelectDropdownMenu from '../components/SelectDropdownMenu';
import MapForm from '../components/MapForm';
import SurveyIntro from '../components/SurveyIntro';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';
import { ContentCopy } from '@mui/icons-material';


import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const CreateNewSurvey = () => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL
  const navigate = useNavigate();
  const { surveyId } = useParams();

  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addIntro, setAddIntro] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // drawer open close
  const [selectedItems, setSelectedItems] = useState([]); // selected items 
  const [isSaved, setIsSaved] = useState('Saved'); // saved or not
  const [subscriptionEndDate, setSubscriptionEndDate] = useState('');

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
    console.log(item, 'item in handleItemSelect');
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
      console.log(surveyData, 'surveyData in Create Survey Form');
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

  useEffect(() => {
    const handlePopState = () => {
      setShowInfo(true);
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const getUserIsProMember = async () => {
      const userId = JSON.parse(localStorage.getItem('userAccessToken')).id;
      console.log(userId, 'userId in CreateNewSurvey');
      

      const userProMember = await axiosWithAuth.get(`${backendUrl}/api/auth/get-user-promember/${userId}`);
      console.log(userProMember.data, 'userProMember in CreateNewSurvey');
      if(userProMember.data === null) {
        setSubscriptionEndDate(0);
      }
      else{
        setSubscriptionEndDate(userProMember?.data?.subscriptionPeriodEnd);

      }
      
    }
    getUserIsProMember();
  }, []);

  console.log(subscriptionEndDate, 'subscriptionEndDate in CreateNewSurvey');
  

  const handleClose = () => {
    setShowInfo(false);
    navigate(1); // Move forward in history, essentially canceling the back navigation
  };


  const selectItem = surveyData.surveyForms.map((item, index) => {
    console.log(item, 'item in selectItem mapppppppp',index);
    if (item.formType === 'SinglePointForm') {

      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SelectSingleRadio key={index} onSaveForm={handleSaveSinglePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} onSaveIndicator={setIsSaved} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'SingleCheckForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SelectSingleCheckBox key={index} onSaveForm={handleSaveSingleCheckForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'MultiScalePoint') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SelectMultiScalePoint key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'MultiScaleCheckBox') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SelectMultiScaleCheckBox key={index} onSaveForm={handleSaveMultiScaleCheckboxForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
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
    else if (item.formType === 'MapForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <MapForm key={index} onSaveForm={handleSaveMultiScaleCheckboxForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'SelectDropDownForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SelectDropdownMenu key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'CommentBoxForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <CommentBox key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'SingleRowTextForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SingleRowText key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'EmailAddressForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <EmailAddress key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'ContactInformationForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <ContactInformation key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'StarRatingForm') {
      return (
        
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <StarRating key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'SmileyRatingForm') {
      return (
        <Stack>
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SmileyRating key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>

</Stack>
      )
    }

    else if (item.formType === 'ThumbUpDownForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <ThumbsUpDown key={index} onSaveForm={handleSaveDropdown} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'SliderTextForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SliderText key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'NumericSliderForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <NumericSlider key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'SelectOneImageForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SelectOneImage key={index} onSaveForm={handleSaveSinglePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'SelectMultipleImageForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SelectMultipleImage key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'RankOrderImageForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <RankOrderImage key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'PresentationTextForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <PresentationText key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'SectionHeadingForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SectionHeading key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'SectionSubHeadingForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <SectionSubHeading key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'DateTimeForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <DateTime key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'GoogleRecaptchaForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <GoogleRecaptcha key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'CalenderForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <Calender
           key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    
    else if (item.formType === 'CountrySelectForm') {
      return (
        <Stack spacing={2} key={index} direction='row'>
          <CountrySlect
           key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'RankOrderForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <RankOrder
           key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }
    else if (item.formType === 'PickAndRankForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <PickAndRank
           key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
            onClick={() => handleDeleteSelectOneForm(item.id)}>
            <CancelIcon />
          </Button>
        </Stack>
      )
    }

    else if (item.formType === 'ConstantSumForm') {
      return (
        <Stack spacing={2} key={index} direction='row' position='relative'>
          <ConstantSum
           key={index} onSaveForm={handleSaveMultiScalePointForm} data={item} id={item.id} options={item.options} disableForm={true} disableText={false} disableButtons={false} onHandleNext={() => 1} />
          <Button
            color="secondary"
            size='large'
            sx={{ position: 'absolute', right: 30 }}
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
        sx={{
          backgroundColor:'#F4F3F6'
        }}
          >
        <Container maxWidth="lg">
              <AppBar position='sticky' >
                <Toolbar 
                  sx={
                    {
                      display: 'flex',
                      justifyContent: 'space-between',
                    }
                  }
                >
                  <Button
                    variant='contained'
                    color='warning'
                    onClick={toggleDrawer}>
                    Add Question
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmitForm}
                  >
                    Submit Your Survey
                  </Button>
                </Toolbar>
              </AppBar>
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
                variant='outlined'
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

          <Stack spacing={4}>
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
              <Stack spacing={1} direction='row'>
                {/* <Button
                  sx={{
                    width: { xs: '100%', md: '100%' },
                    height: { xs: '100%', md: '70%' },
                  }}
                  variant="contained"
                  color="primary"
                  onClick={toggleDrawer}>
                  Add Question
                </Button> */}



                {/* <Button
                  sx={{
                    width: { xs: '100%', md: '100%' },
                    height: { xs: '100%', md: '50%' },
                    fontSize: { xs: 12, md: 10 },
                  }}
                  variant="contained"
                  color="primary"
                  onClick={
                    handleAddIntro
                  }>
                  Show Form Intro
                </Button> */}
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

            <div className="flex justify-center">
          {/* <Button
            fullWidth
            sx={{ 
              width: { xs: '100%', md: '50%' },
             }}
            variant="contained" color="success" onClick={handleSubmitForm}>
            Submit Your Survey
          </Button> */}
          </div>
          {/* <Button variant="contained" color="secondary" onClick={() => navigate(`/user-survey/${surveyId}`)}>Survey Link </Button> */}
        </Container>
        {showInfo && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', background: '#fff' }}>
          <div style={{ padding: '20px' }}>
            <p>This is the information component.</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}

        <TemporaryDrawer open={isDrawerOpen} toggleDrawer={toggleDrawer} handleItemSelect={handleItemSelect} subscriptionEndDate={subscriptionEndDate} />
            </Box>
      </ThemeProvider>
    )
  );

}

export default CreateNewSurvey