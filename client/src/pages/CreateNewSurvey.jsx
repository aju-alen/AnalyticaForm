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
import ConsentForm from '../components/ConsentForm';
import QualitativeConsentForm from '../components/QualitativeConsentForm';
import DynamicConsentForm from '../components/DynamicConsentForm';
import DynamicQualitativeConsentForm from '../components/DynamicQualitativeConsentForm';
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
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Switch from '@mui/material/Switch';

const DISPLAY_ONLY_FORM_TYPES = new Set(['IntroductionForm', 'PresentationTextForm', 'SectionHeadingForm', 'SectionSubHeadingForm']);
const ALWAYS_MANDATORY_FORM_TYPES = new Set([
  'ConsentForm',
  'QualitativeConsentForm',
  'DynamicConsentForm',
  'DynamicQualitativeConsentForm',
]);
const CONSENT_FORM_TYPES = new Set([
  'ConsentForm',
  'QualitativeConsentForm',
  'DynamicConsentForm',
  'DynamicQualitativeConsentForm',
]);

function insertIndexForConsent(forms) {
  let i = 0;
  if (forms[0]?.formType === 'IntroductionForm') i = 1;
  while (i < forms.length && CONSENT_FORM_TYPES.has(forms[i].formType)) i += 1;
  return i;
}

const FORM_TYPE_LABELS = {
  SinglePointForm: 'Single choice',
  SingleCheckForm: 'Multiple choice',
  IntroductionForm: 'Introduction',
  MultiScalePoint: 'Multi scale (single)',
  MultiScaleCheckBox: 'Multi scale (multiple)',
  MultiSpreadsheet: 'Spreadsheet',
  MapForm: 'Map',
  SelectDropDownForm: 'Dropdown',
  CommentBoxForm: 'Comment box',
  SingleRowTextForm: 'Single row text',
  EmailAddressForm: 'Email address',
  ContactInformationForm: 'Contact information',
  StarRatingForm: 'Star rating',
  SmileyRatingForm: 'Smiley rating',
  ThumbUpDownForm: 'Thumbs up/down',
  SliderTextForm: 'Slider text',
  NumericSliderForm: 'Numeric slider',
  SelectOneImageForm: 'Select one image',
  SelectMultipleImageForm: 'Select multiple images',
  RankOrderForm: 'Rank order',
  ConstantSumForm: 'Constant sum',
  PickAndRankForm: 'Pick and rank',
  PresentationTextForm: 'Presentation text',
  SectionHeadingForm: 'Section heading',
  SectionSubHeadingForm: 'Section subheading',
  DateTimeForm: 'Date & time',
  GoogleRecaptchaForm: 'reCAPTCHA',
  CalenderForm: 'Calendar',
  RankOrderImage: 'Rank order (images)',
  ConsentForm: 'Form Consent',
  QualitativeConsentForm: 'Interview Consent',
  DynamicConsentForm: 'Dynamic Consent (Quantitative)',
  DynamicQualitativeConsentForm: 'Dynamic Consent (Qualitative)',
};

const AUTO_SAVE_DELAY_MS = 1800;

const TARGET_REGION_OPTIONS = [
  { code: 'AE', label: 'United Arab Emirates' },
  { code: 'SA', label: 'Saudi Arabia' },
  { code: 'CN', label: 'China' },
  { code: 'UK', label: 'United Kingdom' },
  { code: 'US', label: 'United States Of America' },
  { code: 'QA', label: 'Qatar' },
  { code: 'IN', label: 'India' },
];

function deriveLegacyTargetCountry(codes) {
  if (!codes?.length) return 'NIL';
  if (codes.length === 1) return codes[0];
  return 'MULTI';
}

function normalizeTargetCountriesFromSurvey(d) {
  if (Array.isArray(d.targetCountries) && d.targetCountries.length > 0) {
    return d.targetCountries.filter((c) => TARGET_REGION_OPTIONS.some((o) => o.code === c));
  }
  if (d.targetCountry && d.targetCountry !== 'NIL' && d.targetCountry !== 'MULTI') {
    return [d.targetCountry];
  }
  return [];
}

const CreateNewSurvey = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams();

  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addIntro, setAddIntro] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const open = Boolean(anchorEl);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false); // off by default to avoid forms disappearing when adding many quickly
  const [zoomStatus, setZoomStatus] = useState({ connected: false, zoomEmail: null, loading: true });

  const [surveyData, setSurveyData] = useState({
    surveyTitle: '',
    surveyForms: [],
    selectedItems: [],
    surveyIntroduction: '',
    targetCountry: 'NIL',
    targetCountries: [],
  });

  const formDataRefs = useRef({});
  const formInstanceRefs = useRef({});
  const surveyDataRef = useRef(surveyData);
  const autoSaveTimerRef = useRef(null);
  const skipFirstAutoSaveRef = useRef(true);
  const initialLoadDoneRef = useRef(false);
  

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
    'ConsentForm': ConsentForm,
    'QualitativeConsentForm': QualitativeConsentForm,
    'DynamicConsentForm': DynamicConsentForm,
    'DynamicQualitativeConsentForm': DynamicQualitativeConsentForm,
  }), []);

  // Memoize handlers that don't need to change between renders
  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_BACKEND_URL}/survey-meta/${surveyId}`).then(() => {}).catch(() => {});
  }, [surveyId]);

  const handleDeleteSelectOneForm = React.useCallback((id) => {
    delete formDataRefs.current[id];
    delete formInstanceRefs.current[id];
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

  // Form components call this whenever their formData changes so we always have the latest for submit.
  const registerFormData = React.useCallback((formId, formData) => {
    formDataRefs.current[formId] = formData;
  }, []);

  const handleSetFormMandate = React.useCallback((formId, checked) => {
    setSurveyData(prev => ({
      ...prev,
      surveyForms: prev.surveyForms.map(f => (f.id === formId ? { ...f, formMandate: !!checked } : f)),
    }));
  }, []);

  const getQuestionPreview = React.useCallback((item) => {
    if (item.question && String(item.question).trim() !== '') return item.question.trim();
    if (item.quilText) {
      const cleanText = item.quilText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanText !== '') return cleanText;
    }
    return '(No question text)';
  }, []);

  // Keep ref in sync for auto-save
  surveyDataRef.current = surveyData;

  // Initial load: fetch survey and user/pro in parallel for faster load
  React.useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        await refreshToken();
        const userAccess = localStorage.getItem('dubaiAnalytica-userAccess');
        const [surveyRes, proRes, superAdminRes, zoomRes] = await Promise.all([
          axiosWithAuth.get(`${backendUrl}/api/survey/get-one-survey/${surveyId}`),
          userAccess ? axiosWithAuth.get(`${backendUrl}/api/auth/get-user-promember/${JSON.parse(userAccess).id}`).catch(() => ({ data: null })) : Promise.resolve({ data: null }),
          axiosWithAuth.get(`${backendUrl}/api/auth/get-user`).catch(() => ({ data: { isSuperAdmin: false } })),
          axiosWithAuth.get(`${backendUrl}/api/zoom/status`).catch(() => ({ data: { connected: false } })),
        ]);

        if (!mounted) return;
        const d = surveyRes.data;
        const normalized = normalizeTargetCountriesFromSurvey(d);
        setSurveyData({
          surveyTitle: d.surveyTitle,
          surveyForms: d.surveyForms ?? [],
          selectedItems: d.selectedItems ?? [],
          surveyIntroduction: d.surveyIntroduction ?? '',
          targetCountries: normalized,
          targetCountry: deriveLegacyTargetCountry(normalized),
        });
        setSelectedItems(d.selectedItems ?? []);
        setSelectedCountries(normalized);
        setIsLoading(false);
        initialLoadDoneRef.current = true;
        setIsSuperAdmin(superAdminRes.data?.isSuperAdmin ?? false);
        setSubscriptionEndDate(proRes.data == null ? 0 : (proRes.data.subscriptionPeriodEnd ?? 0));
        setZoomStatus({
          connected: Boolean(zoomRes.data?.connected),
          zoomEmail: zoomRes.data?.zoomEmail || null,
          loading: false,
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('dubaiAnalytica-userAccess');
          navigate('/login');
          return;
        }
        if (mounted) {
          setIsLoading(false);
          setZoomStatus((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, [surveyId, navigate]);

  useEffect(() => {
    const handlePopState = () => setShowInfo(true);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const saveDraft = React.useCallback(async () => {
    if (!surveyId) return;
    setSaveStatus('saving');
    try {
      await refreshToken();
      const current = surveyDataRef.current;
      const surveyFormsToSubmit = (current.surveyForms ?? []).map((form) => {
        const fromInstance = formInstanceRefs.current[form.id]?.getFormData?.();
        return fromInstance ?? formDataRefs.current[form.id] ?? form;
      });
      const payload = { ...current, surveyForms: surveyFormsToSubmit };
      await axiosWithAuth.put(`${backendUrl}/api/survey/get-one-survey/${surveyId}`, payload);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('dubaiAnalytica-userAccess');
        navigate('/login');
        return;
      }
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [surveyId, navigate]);

  React.useEffect(() => {
    if (!autoSaveEnabled) return;
    if (!initialLoadDoneRef.current) return;
    if (skipFirstAutoSaveRef.current) {
      skipFirstAutoSaveRef.current = false;
      return;
    }
    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft();
    }, AUTO_SAVE_DELAY_MS);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [autoSaveEnabled, surveyData, saveDraft]);

  const handleClose = () => {
    setShowInfo(false);
    navigate(1); // Move forward in history, essentially canceling the back navigation
  };

  const toggleDrawer = React.useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);

  const handleItemSelect = React.useCallback((item) => {
    if (item === 'IntroductionForm') {
      setSelectedItems(prev => [item, ...prev]);
      setSurveyData(prev => {
        const newForm = { id: uid(5), formType: item };
        const forms = prev.surveyForms ?? [];
        const surveyForms = [newForm, ...forms];
        return { ...prev, surveyForms };
      });
    } else if (item === 'DropDownTemplateForm') {
      setSurveyData(prev => ({ ...prev, surveyForms: dropDownTemplate }));
    } else if (item === 'CheckBoxTemplateForm') {
      setSurveyData(prev => ({ ...prev, surveyForms: checkBoxTemplate }));
    } else if (CONSENT_FORM_TYPES.has(item)) {
      setSelectedItems(prev => [...prev, item]);
      setSurveyData(prev => {
        const forms = prev.surveyForms ?? [];
        const insertAt = insertIndexForConsent(forms);
        const newForm = { id: uid(5), formType: item, formMandate: true };
        const surveyForms = [
          ...forms.slice(0, insertAt),
          newForm,
          ...forms.slice(insertAt),
        ];
        return { ...prev, surveyForms };
      });
    } else {
      setSelectedItems(prev => [...prev, item]);
      setSurveyData(prev => ({
        ...prev,
        surveyForms: [...prev.surveyForms, { id: uid(5), formType: item }]
      }));
    }
  }, []);

  const handleFormChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setSurveyData(prev => ({ ...prev, [name]: value }));
  }, []);

  const needsZoomConnection = surveyData.surveyForms.some((form) =>
    form.formType === 'QualitativeConsentForm' || form.formType === 'DynamicQualitativeConsentForm'
  );

  const handleConnectZoom = React.useCallback(async () => {
    try {
      await refreshToken();
      const res = await axiosWithAuth.get(`${backendUrl}/api/zoom/connect`);
      if (res.data?.url) {
        window.location.assign(res.data.url);
      }
    } catch (err) {
      console.error('Zoom connect failed', err);
      alert(err.response?.data?.message || err.message || 'Zoom connect failed');
    }
  }, []);

  const handleDisconnectZoom = React.useCallback(async () => {
    try {
      await refreshToken();
      await axiosWithAuth.delete(`${backendUrl}/api/zoom/disconnect`);
      setZoomStatus({ connected: false, zoomEmail: null, loading: false });
    } catch (err) {
      console.error('Zoom disconnect failed', err);
    }
  }, []);

  const handleSaveIntro = React.useCallback((formData) => {
    setSurveyData(prev => ({ ...prev, surveyIntroduction: formData }));
  }, []);

  const handleDeleteIntro = React.useCallback(() => {
    setSurveyData(prev => ({ ...prev, surveyIntroduction: '' }));
    setAddIntro(false);
  }, []);

  const handleSubmitForm = React.useCallback(async () => {
    try {
      await refreshToken();
      const current = surveyDataRef.current;
      const surveyFormsToSubmit = (current.surveyForms ?? []).map((form) => {
        const fromInstance = formInstanceRefs.current[form.id]?.getFormData?.();
        return fromInstance ?? formDataRefs.current[form.id] ?? form;
      });
      const payload = { ...current, surveyForms: surveyFormsToSubmit };
      await axiosWithAuth.put(`${backendUrl}/api/survey/get-one-survey/${surveyId}`, payload);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('dubaiAnalytica-userAccess');
        navigate('/login');
      }
    }
  }, [surveyId, navigate]);

  const handleShare = React.useCallback((platform) => {
    const surveyUrl = `${import.meta.env.VITE_BACKEND_URL}/survey-meta/${surveyId}`;
    const encodedUrl = encodeURIComponent(surveyUrl);
    const title = encodeURIComponent(surveyData.surveyTitle || 'Survey');

    switch (platform) {
      case 'whatsapp':
        // Check if it's a mobile device
        if (/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) {
          // Use the WhatsApp mobile API that shows contact selector
          window.open(`whatsapp://send?text=${title}%0A${encodedUrl}`);
        } else {
          // Use web version for desktop
          window.open(`https://wa.me/?text=${title}%0A${encodedUrl}`);
        }
        break;
      case 'email':
        window.open(`mailto:?subject=${title}&body=${encodedUrl}`);
        break;
      default:
        break;
    }
  }, [surveyId, surveyData.surveyTitle]);

  const handleClick = React.useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = React.useCallback(() => setAnchorEl(null), []);

  const handleRegionToggle = React.useCallback((code) => {
    setSelectedCountries((prev) => {
      const next = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code];
      setSurveyData((prevData) => ({
        ...prevData,
        targetCountries: next,
        targetCountry: deriveLegacyTargetCountry(next),
      }));
      return next;
    });
  }, []);

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
              <AppBar position='sticky'>
                <Toolbar 
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 0 },
                    py: { xs: 2, sm: 1 }
                  }}
                >
                  <Button
                    variant='contained'
                    color='warning'
                    onClick={toggleDrawer}
                    fullWidth={false}
                    sx={{
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Add Question
                  </Button>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={autoSaveEnabled}
                          onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                          color="primary"
                          size="small"
                        />
                      }
                      label={<Typography variant="body2">Auto-save</Typography>}
                      sx={{ mr: 0.5 }}
                    />
                    {autoSaveEnabled && saveStatus === 'saving' && (
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        Saving…
                      </Typography>
                    )}
                    {autoSaveEnabled && saveStatus === 'saved' && (
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: 'success.dark',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'success.light',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        Saved
                      </Typography>
                    )}
                    {autoSaveEnabled && saveStatus === 'error' && (
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: 'error.dark',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'error.light',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        Save failed
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleSubmitForm}
                      disabled={loading || (autoSaveEnabled && saveStatus === 'saving')}
                      fullWidth={false}
                      sx={{
                        width: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      Submit Your Survey
                    </Button>
                  </Box>
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
          <Box sx={{ mt: 2, mb: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Zoom (for unique interview links):{' '}
              {zoomStatus.loading
                ? 'Checking…'
                : zoomStatus.connected
                  ? `Connected${zoomStatus.zoomEmail ? ` (${zoomStatus.zoomEmail})` : ''}`
                  : 'Not connected'}
            </Typography>
            {!zoomStatus.loading && !zoomStatus.connected && (
              <Button size="small" variant="outlined" onClick={handleConnectZoom}>
                Connect Zoom
              </Button>
            )}
            {!zoomStatus.loading && zoomStatus.connected && (
              <Button size="small" variant="text" color="secondary" onClick={handleDisconnectZoom}>
                Disconnect
              </Button>
            )}
          </Box>
          {needsZoomConnection && !zoomStatus.loading && !zoomStatus.connected && (
            <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
              This survey includes interview consent. Connect Zoom so respondents who agree to AV recording receive a unique join link after submit.
            </Typography>
          )}
         {surveyData.surveyForms.length > 0 && (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'row', sm: 'row' },
      justifyContent: 'center',
      alignItems: { xs: '', sm: 'center' },
      gap: 2,
      mt: 2,
      width: '100%'
    }}
  >
    <TextField
      id="outlined-basic"
      label="Survey URL"
      variant='outlined'
      sx={{
        flexGrow: 1,
        minWidth: { xs: '90%', sm: '50%' },
      }}
      value={`${import.meta.env.VITE_BACKEND_URL}/survey-meta/${surveyId}`}
      InputProps={{
        readOnly: true,
      }}
    />
    
    <Box sx={{ 
      display: 'flex', 
      justifyContent: { xs: 'center', sm: 'flex-start' },
      alignItems: 'center'
    }}>
      <Tooltip title="Share options">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'share-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="share-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        <MenuItem onClick={handleCopy}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          Copy URL
        </MenuItem>
        <MenuItem onClick={() => handleShare('whatsapp')}>
          <ListItemIcon>
            <WhatsAppIcon fontSize="small" />
          </ListItemIcon>
          Share via WhatsApp
        </MenuItem>
        <MenuItem onClick={() => handleShare('email')}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          Share via Email
        </MenuItem>
      </Menu>
    </Box>
    
    {/* {isSaved && (
      <Typography variant="body2" color="success.main">
        {isSaved}
      </Typography>
    )} */}
  </Box>
  
)}
 {isSuperAdmin && (
            <FormControl component="fieldset" fullWidth sx={{ mt: 3, mb: 3 }}>
              <Typography variant="subtitle1" component="legend" sx={{ mb: 1 }}>
                Select Target Regions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                On each response, one selected region is chosen at random and a matching IP is assigned.
              </Typography>
              <FormGroup>
                {TARGET_REGION_OPTIONS.map(({ code, label }) => (
                  <FormControlLabel
                    key={code}
                    control={
                      <Checkbox
                        checked={selectedCountries.includes(code)}
                        onChange={() => handleRegionToggle(code)}
                        size="small"
                      />
                    }
                    label={label}
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}

          {surveyData.surveyForms.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <ListItem
                button
                onClick={() => setSummaryOpen(prev => !prev)}
                sx={{ px: 0, borderRadius: 1 }}
                aria-expanded={summaryOpen}
                aria-label="Question summary"
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  Question summary
                </Typography>
                {summaryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={summaryOpen}>
                <List dense disablePadding>
                  {surveyData.surveyForms.map((item) => {
                    const isDisplayOnly = DISPLAY_ONLY_FORM_TYPES.has(item.formType);
                    const isAlwaysMandatory = ALWAYS_MANDATORY_FORM_TYPES.has(item.formType);
                    const typeLabel = FORM_TYPE_LABELS[item.formType] ?? item.formType;
                    return (
                      <ListItem
                        key={item.id}
                        sx={{
                          flexDirection: 'column',
                          alignItems: 'stretch',
                          opacity: isDisplayOnly ? 0.7 : 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" color={isDisplayOnly ? 'text.secondary' : 'text.primary'} sx={{ fontWeight: 500, minWidth: 140 }}>
                            {typeLabel}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ flex: 1, wordBreak: 'break-word' }}>
                            {getQuestionPreview(item)}
                          </Typography>
                          {isAlwaysMandatory && (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked
                                  disabled
                                  size="small"
                                  aria-label="Mandatory"
                                />
                              }
                              label="Mandatory"
                              sx={{ flexShrink: 0 }}
                            />
                          )}
                          {!isDisplayOnly && !isAlwaysMandatory && (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={!!item.formMandate}
                                  onChange={(e) => handleSetFormMandate(item.id, e.target.checked)}
                                  size="small"
                                  aria-label="Mandatory"
                                />
                              }
                              label="Mandatory"
                              sx={{ flexShrink: 0 }}
                            />
                          )}
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          )}

          <Stack spacing={4} sx={{ 
            width: '100%',
            px: { xs: 1, sm: 2, md: 3 }
          }}>
            {addIntro && (
              <Stack 
                spacing={2} 
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretch', sm: 'flex-start' }}
              >
                <SurveyIntro 
                  onSaveForm={handleSaveIntro} 
                  data={surveyData.surveyIntroduction} 
                  disableText={false} 
                  disableButtons={false}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  color="secondary"
                  size='large'
                  onClick={handleDeleteIntro}
                  sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}
                >
                  <CancelIcon />
                </Button>
              </Stack>
            )}

            {surveyData.surveyForms.map((item, index) => {
              const FormComponent = formComponents[item.formType];
              
              if (!FormComponent) return null;
              
              return (
                <Stack 
                  spacing={2} 
                  key={item.id} 
                  direction={{ xs: 'column', sm: 'row' }}
                  position="relative"
                  sx={{
                    width: '100%',
                    '& > *': { width: '100%' }
                  }}
                >
                  <FormComponent
                    ref={item.formType === 'SinglePointForm' ? (el) => { if (el) formInstanceRefs.current[item.id] = el; else delete formInstanceRefs.current[item.id]; } : undefined}
                    onSaveForm={handleSaveSinglePointForm}
                    registerFormData={registerFormData}
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
                    sx={{ 
                      position: { xs: 'static', sm: 'absolute' },
                      alignSelf: { xs: 'center', sm: 'flex-start' },
                      right: { sm: 2, md: 3 },
                      top: { sm: 0 },
                      width: { xs: '100%', sm: 'auto' }
                    }}
                    onClick={() => handleDeleteSelectOneForm(item.id)}
                  >
                    <CancelIcon />
                  </Button>
                </Stack>
              );
            })}
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

export default CreateNewSurvey