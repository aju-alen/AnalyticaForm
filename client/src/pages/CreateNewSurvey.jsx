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
import InfiniteScroll from 'react-infinite-scroll-component';

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
  const [displayedForms, setDisplayedForms] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 5;
  

  const [surveyData, setSurveyData] = useState({
    surveyTitle: '',
    surveyForms: [],
    selectedItems: [],
    surveyIntroduction: ''
  });

  // Memoize form components object to prevent recreation on each render
  const formComponents = React.useMemo(() => ({
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
  }), []);

  // Memoize handlers that don't need to change between renders
  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(`${frontendUrl}user-survey/${surveyId}`).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }, [frontendUrl, surveyId]);

  const handleDeleteSelectOneForm = React.useCallback((id) => {
    setSurveyData(prevData => ({
      ...prevData,
      surveyForms: prevData.surveyForms.filter(form => form.id !== id)
    }));
  }, []);

  const handleSaveSinglePointForm = React.useCallback((formData) => {
    setSurveyData(prevSurveyData => {
      const existingFormIndex = prevSurveyData.surveyForms.findIndex(form => form.id === formData.id);
      
      if (existingFormIndex !== -1) {
        const newForms = [...prevSurveyData.surveyForms];
        newForms[existingFormIndex] = formData;
        return {
          ...prevSurveyData,
          surveyForms: newForms
        };
      }
      
      return {
        ...prevSurveyData,
        surveyForms: [...prevSurveyData.surveyForms, formData]
      };
    });
  }, []);

  // Modify the data fetching effect
  React.useEffect(() => {
    let mounted = true;

    const getSurveyData = async () => {
      try {
        await refreshToken();
        const getUserSurveyData = await axiosWithAuth.get(`${backendUrl}/api/survey/get-one-survey/${surveyId}`);
        
        if (mounted) {
          setSurveyData({
            surveyTitle: getUserSurveyData.data.surveyTitle,
            surveyForms: getUserSurveyData.data.surveyForms,
            selectedItems: getUserSurveyData.data.selectedItems,
            surveyIntroduction: getUserSurveyData.data.surveyIntroduction
          });
          
          // Initialize displayed forms with first batch
          setDisplayedForms(getUserSurveyData.data.surveyForms.slice(0, ITEMS_PER_PAGE));
          setCurrentPage(1);
          
          setSelectedItems(getUserSurveyData.data.selectedItems);
          setIsLoading(false);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('userAccessToken');
          navigate('/login');
        }
        console.error(err);
      }
    };

    getSurveyData();

    return () => {
      mounted = false;
    };
  }, [surveyId, navigate]);

  // Add fetch more data function
  const fetchMoreData = () => {
    const nextPage = currentPage + 1;
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newForms = surveyData.surveyForms.slice(start, end);
    
    if (newForms.length > 0) {
      setDisplayedForms(prev => [...prev, ...newForms]);
      setCurrentPage(nextPage);
    }
  };

  // Modify the form items rendering
  const selectItem = React.useMemo(() => {
    return displayedForms.map((item, index) => {
      const FormComponent = formComponents[item.formType];
    
      if (!FormComponent) {
        console.log('Unknown form type:', item.formType);
        return null;
      }
    
      return (
        <Stack spacing={2} key={item.id} direction="row" position="relative" sx={{ mt: 3 }}>
          <FormComponent
            onSaveForm={handleSaveSinglePointForm}
            data={item}
            id={item.id}
            options={item.options}
            disableForm={true}
            disableText={false}
            disableButtons={false}
            onHandleNext={() => 1}
            onSetLoading={setLoading}
          />
          <Button
            color="secondary"
            size="large"
            sx={{ position: 'absolute', right: {xs:10,md:30}, top: {xs:30,md:0} }}
            onClick={() => handleDeleteSelectOneForm(item.id)}
          >
            <CancelIcon />
          </Button>
        </Stack>
      );
    });
  }, [displayedForms, formComponents, handleSaveSinglePointForm, handleDeleteSelectOneForm, setLoading]);

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
          backgroundColor:'#F4F3F6',
        }}
          >
        <Container maxWidth="lg" sx={{
          marginTop:2
        }}>
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
                    disabled={loading}
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
         {surveyData.surveyForms.length > 0 && (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      mt: 2,
    }}
  >
    <TextField
      id="outlined-basic"
      label="Survey URL"
      variant='outlined'
      sx={{
        width: { xs: '100%', md: '50%' },
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
          minWidth: 'auto',
          px: 2, 
          py: 1, 
          bgcolor: 'primary.main',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        Copy
      </Button>
    </Tooltip>
    
    {isSaved && (
      <Typography variant="body2" color="success.main" sx={{ ml: 2 }}>
        {isSaved}
      </Typography>
    )}
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

            <InfiniteScroll
              dataLength={displayedForms.length}
              next={fetchMoreData}
              hasMore={displayedForms.length < surveyData.surveyForms.length}
              loader={
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress />
                </Box>
              }
              scrollThreshold={0.8}
            >
              {selectItem}
            </InfiniteScroll>
            
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
