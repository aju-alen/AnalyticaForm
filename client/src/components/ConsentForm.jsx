import React, { useEffect, useMemo, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button, Checkbox, FormControlLabel, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const CONSENT_AGREE_LABEL = 'Yes, I agree to participate in the study';
export const CONSENT_DISAGREE_LABEL = 'No, I do not agree to participate in this study';

const CONSENT_OPTIONS = [
  { id: 'consent-yes', value: CONSENT_AGREE_LABEL },
  { id: 'consent-no', value: CONSENT_DISAGREE_LABEL },
];

const cardSx = {
  bgcolor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'space-between',
  flexGrow: 1,
  height: '100%',
  mt: { xs: 4, md: 0 },
  width: '100%',
  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)',
  borderRadius: 2,
  p: 2,
  overflowX: 'auto',
  border: '2px solid #f0fbf0',
  transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
  position: 'relative',
  backgroundColor: '#F4F3F6',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '0%',
    transform: 'translateX(-50%)',
    height: '100%',
    width: '12px',
    bgcolor: '#1976d2',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
  },
  '&:hover::before': { opacity: 1 },
  '&:hover': {
    boxShadow: '0px 1px rgba(0, 0, 0, 0.2)',
    transform: 'scale(0.98)',
    backgroundColor: '#F4FFF8',
  },
};

const cleanHTMLContent = (htmlString) => {
  if (!htmlString) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  let cleanText = tempDiv.textContent || tempDiv.innerText || '';
  return cleanText.replace(/\s+/g, ' ').trim();
};

const buildConsentFormState = (data, id) => ({
  id: data?.id || id,
  question: data?.question || cleanHTMLContent(data?.quilText || ''),
  quilText: data?.quilText || data?.question || '',
  formMandate: true,
  options: CONSENT_OPTIONS,
  selectedValue:
    Array.isArray(data?.selectedValue) && data.selectedValue.length > 0
      ? data.selectedValue
      : [{ question: '', answer: '', value: '', index: '' }],
  formType: 'ConsentForm',
});

const ConsentForm = ({
  onSaveForm,
  data,
  id,
  disableText,
  disableButtons,
  onHandleNext,
  onConsentDisagree,
  onMandatoryIncomplete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const modules = useMemo(
    () => ({
      toolbar: disableText
        ? false
        : {
            container: isMobile
              ? [['bold', 'italic', 'underline'], ['clean']]
              : [['bold', 'italic', 'underline', 'strike'], ['clean']],
          },
      clipboard: { matchVisual: false },
    }),
    [disableText, isMobile]
  );
  const formats = useMemo(() => ['bold', 'italic', 'underline', 'strike'], []);

  const [formData, setFormData] = useState(() => buildConsentFormState(data, id));

  useEffect(() => {
    setFormData(buildConsentFormState(data, id));
  }, [id]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSaveForm({ ...formData, formMandate: true, options: CONSENT_OPTIONS, formType: 'ConsentForm' });
    }, 1000);
    return () => clearTimeout(handler);
  }, [formData]);

  const handleQuillChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      quilText: content,
      question: cleanHTMLContent(content),
      formMandate: true,
    }));
  };

  const handleSelect = (label, index) => {
    setFormData((prev) => ({
      ...prev,
      formMandate: true,
      options: CONSENT_OPTIONS,
      selectedValue: [{
        question: prev.question,
        answer: label,
        value: label,
        index,
      }],
    }));
  };

  const selectedAnswer = formData.selectedValue?.[0]?.answer || '';
  const isYes = selectedAnswer === CONSENT_AGREE_LABEL;
  const isNo = selectedAnswer === CONSENT_DISAGREE_LABEL;
  const buttonEnabled = isYes || isNo;

  const handlePrimaryClick = () => {
    const payload = {
      ...formData,
      formMandate: true,
      options: CONSENT_OPTIONS,
      formType: 'ConsentForm',
    };

    if (!selectedAnswer) {
      onMandatoryIncomplete?.();
      return;
    }

    if (isNo) {
      onConsentDisagree?.(payload);
      return;
    }

    onSaveForm(payload);
    onHandleNext?.();
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={cardSx}>
          <div style={{ marginBottom: '12px', width: '100%' }}>
            {!disableText && (
              <label
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(0, 0, 0, 0.6)',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Consent text
              </label>
            )}
            <ReactQuill
              theme="snow"
              value={formData.quilText || ''}
              onChange={handleQuillChange}
              readOnly={disableText}
              modules={modules}
              formats={formats}
              style={{ width: '100%', borderRadius: '4px' }}
            />
          </div>

          <Stack spacing={0.5} sx={{ mt: 2, width: '100%' }}>
            {!disableText && (
              <Typography variant="caption" color="text.secondary">
                Respondents will choose one of the options below (required).
              </Typography>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isYes}
                  onChange={() => handleSelect(CONSENT_AGREE_LABEL, 1)}
                  disabled={!disableText}
                />
              }
              label={CONSENT_AGREE_LABEL}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isNo}
                  onChange={() => handleSelect(CONSENT_DISAGREE_LABEL, 2)}
                  disabled={!disableText}
                />
              }
              label={CONSENT_DISAGREE_LABEL}
            />
          </Stack>

          <Stack spacing={2} direction="row" sx={{ marginTop: '1rem' }}>
            {disableButtons && (
              <Button
                variant="contained"
                color={isNo ? 'error' : 'success'}
                disabled={!buttonEnabled}
                onClick={handlePrimaryClick}
              >
                {isNo ? 'Exit' : 'Start Survey'}
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default ConsentForm;
