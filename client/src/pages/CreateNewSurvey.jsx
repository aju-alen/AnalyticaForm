import React, { useEffect, useState, useRef, Suspense } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';
import { getUserAccess, clearUserAccess } from '../utils/userAccess';
import { useNavigate } from 'react-router-dom';
import TemporaryDrawer from '../components/TempDrawer';
import {
  SurveyBuilderChromeProvider,
  SurveyBuilderChromeBody,
} from '../components/SurveyBuilderChrome';
import { Stack } from '@mui/material';
import { uid } from 'uid';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import SurveyIntro from '../components/SurveyIntro';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { dropDownTemplate, checkBoxTemplate, cloneTemplateWithFreshIds } from '../utils/templateData';
import Collapse from '@mui/material/Collapse';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import {
  BUILDER_COMPONENTS,
  DISPLAY_ONLY_FORM_TYPES,
  ALWAYS_MANDATORY_FORM_TYPES,
  CONSENT_FORM_TYPES,
  FORM_TYPE_LABELS,
} from '../questionTypes/registry';

function toDatetimeLocalValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function insertIndexForConsent(forms) {
  let i = 0;
  if (forms[0]?.formType === 'IntroductionForm') i = 1;
  while (i < forms.length && CONSENT_FORM_TYPES.has(forms[i].formType)) i += 1;
  return i;
}

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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false); // off by default to avoid forms disappearing when adding many quickly
  const [zoomStatus, setZoomStatus] = useState({ connected: false, zoomEmail: null, loading: true });
  const [accessPassword, setAccessPassword] = useState('');
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiUsage, setAiUsage] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);

  const [surveyData, setSurveyData] = useState({
    surveyTitle: '',
    surveyForms: [],
    selectedItems: [],
    surveyIntroduction: '',
    targetCountry: 'NIL',
    targetCountries: [],
    surveyStatus: 'Draft',
    closesAt: '',
    maxResponses: '',
    oneResponsePerPerson: false,
    passwordRequired: false,
    surveyLayout: 'oneQuestion',
    brandLogoUrl: '',
    brandColor: '',
    hidePoweredBy: false,
  });

  const formDataRefs = useRef({});
  const formInstanceRefs = useRef({});
  const surveyDataRef = useRef(surveyData);
  const autoSaveTimerRef = useRef(null);
  const skipFirstAutoSaveRef = useRef(true);
  const initialLoadDoneRef = useRef(false);
  

  const formComponents = BUILDER_COMPONENTS;

  // Memoize handlers that don't need to change between renders
  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_BACKEND_URL}/survey-meta/${surveyId}`).then(() => {}).catch(() => {});
  }, [surveyId]);

  const takeSurveyUrl = `${window.location.origin}/user-survey/${surveyId}`;
  const embedSnippet = `<iframe src="${takeSurveyUrl}?embed=1" width="100%" height="800" style="border:0;" title="Survey"></iframe>`;

  const handleCopyEmbed = React.useCallback(() => {
    navigator.clipboard.writeText(embedSnippet).then(() => {}).catch(() => {});
  }, [embedSnippet]);

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
        const user = getUserAccess();
        const [surveyRes, proRes, superAdminRes, zoomRes, aiRes] = await Promise.all([
          axiosWithAuth.get(`${backendUrl}/api/survey/get-one-survey/${surveyId}`),
          user?.id ? axiosWithAuth.get(`${backendUrl}/api/auth/get-user-promember/${user.id}`).catch(() => ({ data: null })) : Promise.resolve({ data: null }),
          axiosWithAuth.get(`${backendUrl}/api/auth/get-user`).catch(() => ({ data: { isSuperAdmin: false } })),
          axiosWithAuth.get(`${backendUrl}/api/zoom/status`).catch(() => ({ data: { connected: false } })),
          axiosWithAuth.get(`${backendUrl}/api/ai-survey/usage`).catch(() => ({ data: { allowed: false, remaining: 0, limit: 2, used: 0 } })),
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
          surveyStatus: d.surveyStatus || 'Draft',
          closesAt: toDatetimeLocalValue(d.closesAt),
          maxResponses: d.maxResponses ?? '',
          oneResponsePerPerson: Boolean(d.oneResponsePerPerson),
          passwordRequired: Boolean(d.passwordRequired),
          surveyLayout: d.surveyLayout === 'onePage' ? 'onePage' : 'oneQuestion',
          brandLogoUrl: d.brandLogoUrl || '',
          brandColor: d.brandColor || '',
          hidePoweredBy: Boolean(d.hidePoweredBy),
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
        setAiUsage(aiRes.data || { allowed: false, remaining: 0, limit: 2, used: 0 });
        setPasswordEnabled(Boolean(d.passwordRequired));
      } catch (err) {
        if (err.response?.status === 401) {
          clearUserAccess();
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
      const payload = {
        ...current,
        surveyForms: surveyFormsToSubmit,
        maxResponses: current.maxResponses === '' ? null : current.maxResponses,
        closesAt: current.closesAt === '' ? null : current.closesAt,
        accessPassword: passwordEnabled && accessPassword.trim() ? accessPassword.trim() : undefined,
        clearAccessPassword: !passwordEnabled,
        clearBrandLogo: !current.brandLogoUrl,
      };
      await axiosWithAuth.put(`${backendUrl}/api/survey/get-one-survey/${surveyId}`, payload);
      setSaveStatus('saved');
      setAccessPassword('');
      if (passwordEnabled && accessPassword.trim()) {
        setSurveyData((prev) => ({ ...prev, passwordRequired: true }));
      }
      if (!passwordEnabled) {
        setSurveyData((prev) => ({ ...prev, passwordRequired: false }));
      }
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      if (err.response?.status === 401) {
        clearUserAccess();
        navigate('/login');
        return;
      }
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [surveyId, navigate, accessPassword, passwordEnabled]);

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
    } else if (item === 'DropDownTemplateForm' || item === 'CheckBoxTemplateForm') {
      const template = item === 'DropDownTemplateForm' ? dropDownTemplate : checkBoxTemplate;
      const cloned = cloneTemplateWithFreshIds(template);
      setSelectedItems((prev) => [...prev, ...cloned.map((form) => form.formType)]);
      setSurveyData((prev) => ({
        ...prev,
        surveyForms: [...(prev.surveyForms ?? []), ...cloned],
      }));
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
      const payload = {
        ...current,
        surveyForms: surveyFormsToSubmit,
        maxResponses: current.maxResponses === '' ? null : current.maxResponses,
        closesAt: current.closesAt === '' ? null : current.closesAt,
        accessPassword: passwordEnabled && accessPassword.trim() ? accessPassword.trim() : undefined,
        clearAccessPassword: !passwordEnabled,
        clearBrandLogo: !current.brandLogoUrl,
      };
      await axiosWithAuth.put(`${backendUrl}/api/survey/get-one-survey/${surveyId}`, payload);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        clearUserAccess();
        navigate('/login');
      }
    }
  }, [surveyId, navigate, accessPassword, passwordEnabled]);

  const handlePreviewSurvey = React.useCallback(() => {
    window.open(`${window.location.origin}/user-survey/${surveyId}?preview=1`, '_blank', 'noopener,noreferrer');
  }, [surveyId]);

  const handleGenerateAiSurvey = React.useCallback(async () => {
    const prompt = aiPrompt.trim();
    if (!isSuperAdmin || !prompt || aiBusy) return;
    if (surveyData.surveyForms.length > 0) {
      const ok = window.confirm('This will replace the current questions with an AI draft. Continue?');
      if (!ok) return;
    }
    setAiBusy(true);
    try {
      await refreshToken();
      const res = await axiosWithAuth.post(
        `${backendUrl}/api/ai-survey/generate/${surveyId}`,
        { prompt },
        { timeout: 120000 },
      );
      const d = res.data?.survey;
      if (d) {
        const normalized = normalizeTargetCountriesFromSurvey(d);
        setSurveyData({
          surveyTitle: d.surveyTitle,
          surveyForms: d.surveyForms ?? [],
          selectedItems: d.selectedItems ?? [],
          surveyIntroduction: d.surveyIntroduction ?? '',
          targetCountries: normalized,
          targetCountry: deriveLegacyTargetCountry(normalized),
          surveyStatus: d.surveyStatus || 'Draft',
          closesAt: toDatetimeLocalValue(d.closesAt),
          maxResponses: d.maxResponses ?? '',
          oneResponsePerPerson: Boolean(d.oneResponsePerPerson),
          passwordRequired: Boolean(d.passwordRequired),
          surveyLayout: d.surveyLayout === 'onePage' ? 'onePage' : 'oneQuestion',
          brandLogoUrl: d.brandLogoUrl || '',
          brandColor: d.brandColor || '',
          hidePoweredBy: Boolean(d.hidePoweredBy),
        });
        setSelectedItems(d.selectedItems ?? []);
        setSelectedCountries(normalized);
      }
      if (res.data?.usage) setAiUsage(res.data.usage);
      setAiPrompt('');
    } catch (err) {
      if (err.response?.status === 401) {
        clearUserAccess();
        navigate('/login');
        return;
      }
      alert(err.response?.data?.message || 'Could not generate the survey.');
      if (err.response?.data?.used != null) {
        setAiUsage((prev) => ({ ...prev, ...err.response.data }));
      }
    } finally {
      setAiBusy(false);
    }
  }, [isSuperAdmin, aiPrompt, aiBusy, surveyData.surveyForms.length, surveyId, navigate]);

  const handlePublishSurvey = React.useCallback(async () => {
    try {
      await refreshToken();
      const current = surveyDataRef.current;
      const surveyFormsToSubmit = (current.surveyForms ?? []).map((form) => {
        const fromInstance = formInstanceRefs.current[form.id]?.getFormData?.();
        return fromInstance ?? formDataRefs.current[form.id] ?? form;
      });
      const payload = {
        ...current,
        surveyForms: surveyFormsToSubmit,
        maxResponses: current.maxResponses === '' ? null : current.maxResponses,
        closesAt: current.closesAt === '' ? null : current.closesAt,
        accessPassword: passwordEnabled && accessPassword.trim() ? accessPassword.trim() : undefined,
        clearAccessPassword: !passwordEnabled,
        clearBrandLogo: !current.brandLogoUrl,
      };
      await axiosWithAuth.put(`${backendUrl}/api/survey/get-one-survey/${surveyId}`, payload);
      await axiosWithAuth.put(`${backendUrl}/api/survey/update-survey-status/${surveyId}`, { surveyStatus: 'Active' });
      setSurveyData((prev) => ({ ...prev, surveyStatus: 'Active' }));
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        clearUserAccess();
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'Could not publish survey.');
      }
    }
  }, [surveyId, navigate, accessPassword, passwordEnabled]);

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
        <SurveyBuilderChromeProvider
          surveyData={surveyData}
          setSurveyData={setSurveyData}
          handleFormChange={handleFormChange}
          passwordEnabled={passwordEnabled}
          setPasswordEnabled={setPasswordEnabled}
          accessPassword={accessPassword}
          setAccessPassword={setAccessPassword}
          isSuperAdmin={isSuperAdmin}
          selectedCountries={selectedCountries}
          onRegionToggle={handleRegionToggle}
          regionOptions={TARGET_REGION_OPTIONS}
          surveyId={surveyId}
          takeSurveyUrl={takeSurveyUrl}
          embedSnippet={embedSnippet}
          onCopyUrl={handleCopy}
          onCopyEmbed={handleCopyEmbed}
          onShare={handleShare}
          aiUsage={aiUsage}
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          aiBusy={aiBusy}
          onGenerateAi={handleGenerateAiSurvey}
        >
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
                      variant="outlined"
                      color="inherit"
                      onClick={handlePreviewSurvey}
                      disabled={loading}
                      sx={{ width: { xs: '100%', sm: 'auto' } }}
                    >
                      Preview
                    </Button>
                    {surveyData.surveyStatus !== 'Active' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePublishSurvey}
                        disabled={loading || (autoSaveEnabled && saveStatus === 'saving')}
                        sx={{ width: { xs: '100%', sm: 'auto' } }}
                      >
                        Publish
                      </Button>
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
                      Save
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
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              label={surveyData.surveyStatus === 'Disable' ? 'Inactive' : (surveyData.surveyStatus || 'Draft')}
              color={surveyData.surveyStatus === 'Active' ? 'success' : surveyData.surveyStatus === 'Draft' ? 'warning' : 'default'}
            />
            {surveyData.surveyStatus === 'Draft' && (
              <Typography variant="body2" color="text.secondary">
                Respondents cannot take this survey until you publish it.
              </Typography>
            )}
          </Box>
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
          <SurveyBuilderChromeBody>
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
                  <Suspense fallback={<CircularProgress size={24} />}>
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
                  </Suspense>
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
          </SurveyBuilderChromeBody>

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
        </SurveyBuilderChromeProvider>
      </ThemeProvider>
    )
  );

}

export default CreateNewSurvey