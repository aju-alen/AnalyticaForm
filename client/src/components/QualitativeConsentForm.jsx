import React, { useEffect, useMemo, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button, Checkbox, FormControlLabel, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  CONSENT_RULE_EXIT_ON_NO,
  CONSENT_RULE_MUST_YES,
  CONSENT_RULE_OPTIONAL,
  evaluateConsentProgress,
} from '../utils/consentProgress';

const cleanHTMLContent = (htmlString) => {
  if (!htmlString) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  let cleanText = tempDiv.textContent || tempDiv.innerText || '';
  return cleanText.replace(/\s+/g, ' ').trim();
};

export const QUALITATIVE_CONSENT_DEFAULT_ITEMS = [
  {
    id: 'qc-1',
    label: 'Agree to take part in the survey',
    rule: CONSENT_RULE_EXIT_ON_NO,
    showsZoomOnYes: false,
  },
  {
    id: 'qc-2',
    label: 'Agree for virtual interview',
    rule: CONSENT_RULE_OPTIONAL,
    showsZoomOnYes: false,
  },
  {
    id: 'qc-3',
    label: 'Agree to audio-visual recording',
    rule: CONSENT_RULE_OPTIONAL,
    showsZoomOnYes: true,
  },
  {
    id: 'qc-4',
    label: 'Agree to written record or self-filled responses',
    rule: CONSENT_RULE_MUST_YES,
    showsZoomOnYes: false,
  },
];

const cardSx = {
  bgcolor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flexGrow: 1,
  mt: { xs: 4, md: 0 },
  width: '100%',
  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)',
  borderRadius: 2,
  p: 2,
  overflowX: 'auto',
  border: '2px solid #f0fbf0',
  backgroundColor: '#F4F3F6',
};

function emptySelected(items) {
  return (items || []).map((item, index) => ({
    question: item.label,
    answer: '',
    value: '',
    index: index + 1,
  }));
}

const QualitativeConsentForm = ({
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

  const defaultItems = useMemo(() => QUALITATIVE_CONSENT_DEFAULT_ITEMS.map((i) => ({ ...i })), []);

  const buildState = (source, formId) => {
    const items =
      Array.isArray(source?.items) && source.items.length > 0 ? source.items : defaultItems;
    return {
      id: source?.id || formId,
      question: source?.question || cleanHTMLContent(source?.quilText || ''),
      quilText: source?.quilText || source?.question || '',
      formMandate: true,
      items,
      selectedValue:
        Array.isArray(source?.selectedValue) && source.selectedValue.length === items.length
          ? source.selectedValue
          : emptySelected(items),
      formType: 'QualitativeConsentForm',
    };
  };

  const [formData, setFormData] = useState(() => buildState(data, id));

  useEffect(() => {
    setFormData(buildState(data, id));
  }, [id]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSaveForm({
        ...formData,
        formMandate: true,
        formType: 'QualitativeConsentForm',
        items: formData.items?.length ? formData.items : defaultItems,
      });
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

  const setAnswer = (index, answer) => {
    setFormData((prev) => {
      const items = prev.items || defaultItems;
      const selectedValue = emptySelected(items).map((row, i) => {
        const existing = prev.selectedValue?.[i];
        const nextAnswer = i === index ? answer : (existing?.answer || '');
        return {
          question: items[i].label,
          answer: nextAnswer,
          value: nextAnswer,
          index: i + 1,
        };
      });
      return { ...prev, selectedValue, formMandate: true };
    });
  };

  const getAnswer = (index) => formData.selectedValue?.[index]?.answer || '';

  const handlePrimaryClick = () => {
    const items = formData.items || defaultItems;
    const progress = evaluateConsentProgress(items, formData.selectedValue);
    const payload = {
      ...formData,
      formMandate: true,
      formType: 'QualitativeConsentForm',
      items,
    };

    if (progress.shouldExit) {
      onConsentDisagree?.(payload);
      return;
    }
    if (progress.missingMandatory || !progress.canProceed) {
      onMandatoryIncomplete?.();
      return;
    }
    onSaveForm(payload);
    onHandleNext?.();
  };

  const items = formData.items || defaultItems;
  const progress = evaluateConsentProgress(items, formData.selectedValue);

  const primaryDisabled =
    disableButtons &&
    !progress.shouldExit &&
    (progress.missingMandatory || !progress.canProceed);

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
                Interview / privacy text
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

          <Stack spacing={2} sx={{ mt: 2 }}>
            {items.map((item, index) => (
              <Box key={item.id || index}>
                {!disableText ? (
                  <TextField
                    fullWidth
                    size="small"
                    label={`Option ${index + 1} label`}
                    value={item.label}
                    onChange={(e) => {
                      const label = e.target.value;
                      setFormData((prev) => {
                        const nextItems = prev.items.map((it, i) =>
                          i === index ? { ...it, label } : it
                        );
                        return {
                          ...prev,
                          items: nextItems,
                          selectedValue: (prev.selectedValue || []).map((sv, i) =>
                            i === index ? { ...sv, question: label } : sv
                          ),
                        };
                      });
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                )}
                <Stack direction="row" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={getAnswer(index) === 'Yes'}
                        onChange={() => setAnswer(index, 'Yes')}
                        disabled={!disableText}
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={getAnswer(index) === 'No'}
                        onChange={() => setAnswer(index, 'No')}
                        disabled={!disableText}
                      />
                    }
                    label="No"
                  />
                </Stack>
                {!disableText && (
                  <Typography variant="caption" color="text.secondary">
                    Rule: {item.rule}
                    {item.showsZoomOnYes ? ' · create unique Zoom meeting if Yes' : ''}
                  </Typography>
                )}
              </Box>
            ))}
          </Stack>

          {disableButtons && (
            <Button
              variant="contained"
              color={progress.shouldExit ? 'error' : 'success'}
              disabled={primaryDisabled}
              onClick={handlePrimaryClick}
              sx={{ mt: 2, alignSelf: 'flex-start' }}
            >
              {progress.shouldExit ? 'Exit' : 'Start Survey'}
            </Button>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default QualitativeConsentForm;
