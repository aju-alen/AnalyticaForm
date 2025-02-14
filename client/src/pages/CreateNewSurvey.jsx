import React, { useEffect, useState, useRef, memo, useCallback, useMemo, Suspense } from 'react';
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
import IntroductionForm from '../components/IntroductionForm';
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
import SelectOneImage from '../components/SelectOneImage';
import SelectMultipleImage from '../components/SelectMultipleImage';
import RankOrderImage from '../components/RankOrderImage';
import PresentationText from '../components/PresentationText';
import SectionHeading from '../components/SectionHeading';
import SectionSubHeading from '../components/SectionSubHeading';
import PickAndRank from '../components/PickAndRank';
import { Stack } from '@mui/material';
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
import Tooltip from '@mui/material/Tooltip';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { dropDownTemplate } from '../utils/templateData';
import { checkBoxTemplate } from '../utils/templateData';
import { Virtuoso } from 'react-virtuoso';
import { debounce } from 'lodash';
import { ErrorBoundary } from 'react-error-boundary';
import AddIcon from '@mui/icons-material/Add';

const FormWrapper = memo(({ item, index, onDelete, onSave, loading }) => {
  const formComponents = {
    'SinglePointForm': SelectSingleRadio,
    'SingleCheckForm': SelectSingleCheckBox,
    'IntroductionForm': IntroductionForm,
    'MultiScalePoint': SelectMultiScalePoint,
    'MultiScaleCheckBox': SelectMultiScaleCheckBox,
    'MultiSpreadsheet': SelectMultiSpreadsheet,
    'MapForm': MapForm,
    'SelectDropDownForm': SelectDropdownMenu,
    'CommentBoxForm': CommentBox,
    'SingleRowTextForm': SingleRowText,
    'EmailAddressForm': EmailAddress,
    'ContactInformationForm': ContactInformation,
    'StarRatingForm': StarRating,
    'SmileyRatingForm': SmileyRating,
    'ThumbUpDownForm': ThumbsUpDown,
    'SliderTextForm': SliderText,
    'NumericSliderForm': NumericSlider,
    'SelectOneImageForm': SelectOneImage,
    'SelectMultipleImageForm': SelectMultipleImage,
    'RankOrderForm': RankOrder,
    'ConstantSumForm':ConstantSum,
    'PickAndRankForm':PickAndRank,
    'PresentationTextForm': PresentationText,
    'SectionHeadingForm': SectionHeading,
    'SectionSubHeadingForm': SectionSubHeading,
    'DateTimeForm': DateTime,
    'GoogleRecaptchaForm': GoogleRecaptcha,
    'CalenderForm' : Calender,

  };
  const FormComponent = formComponents[item.formType]
  
  if (!FormComponent) return null

  return (
    <Stack 
      spacing={2} 
      direction="row" 
      position="relative" 
      sx={{
        marginBottom: '30px',
        padding: { xs: '10px', md: '20px' },
      }}
    >
      <FormComponent
        onSaveForm={onSave}
        data={item}
        id={item.id}
        options={item.options}
        disableForm={true}
        disableText={false}
        disableButtons={false}
        onHandleNext={() => 1}
        onSetLoading={loading}
      />
      <Button
        color="error"
        size="large"
        sx={{ 
          position: 'absolute', 
          right: {xs: '5px', sm: '15px', md: '30px'}, 
          top: {xs: '5px', sm: '15px', md: '30px'},
          minWidth: '40px',
          width: {xs: '30px', sm: '40px'},
          height: {xs: '30px', sm: '40px'},
          borderRadius: '50%',
          zIndex: 1
        }}
        onClick={() => onDelete(item.id)}
      >
        <CancelIcon sx={{ fontSize: {xs: '20px', sm: '20px'} }} />
      </Button>
    </Stack>
  )
})

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
  const [loading, setLoading] = useState(false);
  

  const [surveyData, setSurveyData] = useState({
    surveyTitle: '',
    surveyForms: [],
    selectedItems: [],
    surveyIntroduction: '',
    surveyDescription: ''
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
    console.log(selectedItems, 'selectedItems in handleItemSelect');
    console.log(surveyData, 'surveyData in handleItemSelect');
    if(item === 'IntroductionForm') {
      setSelectedItems([item,...selectedItems]);
      setSurveyData({ ...surveyData, surveyForms: [ { id: uid(5), formType: item },...surveyData.surveyForms] })

    }
    else if(item === 'DropDownTemplateForm'){
      console.log('inside test componenenennen');
      console.log(surveyData, 'surveyData in handleItemSelect-------jk---');
      setSurveyData({
        ...surveyData,surveyForms:dropDownTemplate
      })
    }
    else if(item === 'CheckBoxTemplateForm'){
      console.log('inside test componenenennen');
      console.log(surveyData, 'surveyData in handleItemSelect-------jk---');
      setSurveyData({
        ...surveyData,surveyForms:checkBoxTemplate
      })
    }
    else{
      setSelectedItems([...selectedItems, item]);
      setSurveyData({ ...surveyData, surveyForms: [...surveyData.surveyForms, { id: uid(5), formType: item }] })

    }
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

  const handleSaveSinglePointForm = useCallback((formData) => {
    setSurveyData(prevData => {
      const existingFormIndex = prevData.surveyForms.findIndex(form => form.id === formData.id)
      
      if (existingFormIndex !== -1) {
        const newForms = [...prevData.surveyForms]
        newForms[existingFormIndex] = formData
        return { ...prevData, surveyForms: newForms }
      }
      
      return {
        ...prevData,
        surveyForms: [...prevData.surveyForms, formData]
      }
    })
  }, [])

  const handleDeleteSelectOneForm = useCallback((id) => {
    setSurveyData(prevData => ({
      ...prevData,
      surveyForms: prevData.surveyForms.filter(form => form.id !== id)
    }))
  }, [])

  const debouncedSave = useCallback(
    debounce((formData) => handleSaveSinglePointForm(formData), 500),
    []
  )

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
          surveyDescription: getUserSurveyData.data.surveyDescription,
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


  
  const renderForm = useCallback(({ item, index }) => (
    <FormWrapper
      key={item.id}
      item={item}
      index={index}
      onDelete={handleDeleteSelectOneForm}
      onSave={handleSaveSinglePointForm}
      loading={setLoading}
    />
  ), [handleDeleteSelectOneForm, handleSaveSinglePointForm])

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
        <Box sx={{
          backgroundColor: '#F4F3F6',
          minHeight: '100vh',
          pb: 4
        }}>
          <Container maxWidth="lg" sx={{ pt: 2 }}>
            <AppBar 
              position='sticky' 
              elevation={2}
              sx={{
                borderRadius: '8px',
                mb: 3
              }}
            >
              <Toolbar sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
                p: {xs: 1, sm: 2}
              }}>
                <Button
                  variant='contained'
                  color='warning'
                  onClick={toggleDrawer}
                  startIcon={<AddIcon />}
                  sx={{
                    flex: {xs: '1 1 100%', sm: '0 1 auto'}
                  }}
                >
                  Add Question
                </Button>
                
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmitForm}
                  disabled={loading}
                  sx={{
                    flex: {xs: '1 1 100%', sm: '0 1 auto'}
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Survey'}
                </Button>
              </Toolbar>
            </AppBar>

            <TextField
              fullWidth
              label="Survey Name"
              variant="outlined"
              name='surveyTitle'
              value={surveyData.surveyTitle}
              onChange={handleFormChange}
              sx={{ 
                mb: 3,
                backgroundColor: 'background.paper',
                borderRadius: '8px'
              }}
            />
            <TextField
              fullWidth
              label="Survey Description"
              variant="outlined"
              name='surveyDescription'
              value={surveyData.surveyDescription}
              onChange={handleFormChange}
              sx={{ 
                mb: 3,
                backgroundColor: 'background.paper',
                borderRadius: '8px'
              }}
            />

            {surveyData.surveyForms.length > 0 && (
              <Box sx={{
                display: 'flex',
                flexDirection: {xs: 'column', md: 'row'},
                alignItems: 'center',
                gap: 2,
                mb: 3,
                p: 2,
                backgroundColor: 'background.paper',
                borderRadius: '8px',
                boxShadow: 1
              }}>
                <TextField
                  label="Survey URL"
                  variant='outlined'
                  sx={{
                    flex: 1,
                    width: '100%'
                  }}
                  value={`${frontendUrl}user-survey/${surveyId}`}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                
                <Tooltip title="Copy URL">
                  <Button
                    variant='contained'
                    onClick={handleCopy}
                    startIcon={<ContentCopy />}
                    sx={{ 
                      minWidth: '120px',
                      height: '56px'
                    }}
                  >
                    Copy URL
                  </Button>
                </Tooltip>
              </Box>
            )}

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

              <Suspense fallback={<CircularProgress />}>
                <ErrorBoundary>
                  <Virtuoso
                    style={{ height: '70vh' }}
                    totalCount={surveyData.surveyForms.length}
                    itemContent={index => renderForm({ 
                      item: surveyData.surveyForms[index],
                      index 
                    })}
                    overscan={5}
                  />
                </ErrorBoundary>
              </Suspense>
              
              <div className="flex justify-center">
                <Stack spacing={1} direction='row'>
                </Stack>
              </div>
            </Stack>
              <div className="flex justify-center">
            </div>
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

export default memo(CreateNewSurvey)
