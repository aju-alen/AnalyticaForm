import React, { useEffect, useMemo, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { uid } from 'uid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  CONSENT_RULE_EXIT_ON_NO,
  CONSENT_RULE_MUST_YES,
  CONSENT_RULE_OPTIONAL,
  evaluateConsentProgress,
} from '../utils/consentProgress';

const MAX_ITEMS = 10;

const cleanHTMLContent = (htmlString) => {
  if (!htmlString) return '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  let cleanText = tempDiv.textContent || tempDiv.innerText || '';
  return cleanText.replace(/\s+/g, ' ').trim();
};

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

function seedItems() {
  return [
    {
      id: uid(5),
      label: 'Agree to take part in the survey',
      rule: CONSENT_RULE_EXIT_ON_NO,
    },
  ];
}

function emptySelected(items) {
  return (items || []).map((item, index) => ({
    question: item.label,
    answer: '',
    value: '',
    index: index + 1,
  }));
}

const DynamicConsentForm = ({
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

  const buildState = (source, formId) => {
    const items =
      Array.isArray(source?.items) && source.items.length > 0 ? source.items : seedItems();
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
      formType: 'DynamicConsentForm',
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
        formType: 'DynamicConsentForm',
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

  const syncSelected = (items, prevSelected) =>
    items.map((item, index) => ({
      question: item.label,
      answer: prevSelected?.[index]?.answer || '',
      value: prevSelected?.[index]?.answer || '',
      index: index + 1,
    }));

  const setAnswer = (index, answer) => {
    setFormData((prev) => ({
      ...prev,
      selectedValue: syncSelected(prev.items, prev.selectedValue).map((row, i) =>
        i === index ? { ...row, answer, value: answer } : row
      ),
    }));
  };

  const getAnswer = (index) => formData.selectedValue?.[index]?.answer || '';

  const addItem = () => {
    setFormData((prev) => {
      if ((prev.items || []).length >= MAX_ITEMS) return prev;
      const items = [
        ...prev.items,
        { id: uid(5), label: '', rule: CONSENT_RULE_MUST_YES },
      ];
      return { ...prev, items, selectedValue: syncSelected(items, prev.selectedValue) };
    });
  };

  const removeItem = (index) => {
    setFormData((prev) => {
      if ((prev.items || []).length <= 1) return prev;
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items, selectedValue: syncSelected(items, prev.selectedValue.filter((_, i) => i !== index)) };
    });
  };

  const handlePrimaryClick = () => {
    const progress = evaluateConsentProgress(formData.items, formData.selectedValue);
    const payload = { ...formData, formMandate: true, formType: 'DynamicConsentForm' };
    if (progress.shouldExit) {
      onConsentDisagree?.(payload);
      return;
    }
    if (!progress.canProceed) {
      onMandatoryIncomplete?.();
      return;
    }
    onSaveForm(payload);
    onHandleNext?.();
  };

  const progress = evaluateConsentProgress(formData.items, formData.selectedValue);
  const primaryDisabled =
    disableButtons && !progress.shouldExit && !progress.canProceed;

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
                Consent / privacy text
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
            {(formData.items || []).map((item, index) => (
              <Box key={item.id || index} sx={{ borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                {!disableText ? (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
                    <TextField
                      fullWidth
                      size="small"
                      label={`Option ${index + 1}`}
                      value={item.label}
                      onChange={(e) => {
                        const label = e.target.value;
                        setFormData((prev) => {
                          const items = prev.items.map((it, i) =>
                            i === index ? { ...it, label } : it
                          );
                          return {
                            ...prev,
                            items,
                            selectedValue: syncSelected(items, prev.selectedValue),
                          };
                        });
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <InputLabel>Rule</InputLabel>
                      <Select
                        label="Rule"
                        value={item.rule}
                        onChange={(e) => {
                          const rule = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            items: prev.items.map((it, i) =>
                              i === index ? { ...it, rule } : it
                            ),
                          }));
                        }}
                      >
                        <MenuItem value={CONSENT_RULE_EXIT_ON_NO}>Exit if No</MenuItem>
                        <MenuItem value={CONSENT_RULE_OPTIONAL}>Optional</MenuItem>
                        <MenuItem value={CONSENT_RULE_MUST_YES}>Must answer Yes</MenuItem>
                      </Select>
                    </FormControl>
                    <Button color="secondary" onClick={() => removeItem(index)} disabled={formData.items.length <= 1}>
                      <HighlightOffIcon />
                    </Button>
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                )}
                <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
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
              </Box>
            ))}
          </Stack>

          {!disableText && (
            <Button
              variant="outlined"
              size="small"
              onClick={addItem}
              disabled={(formData.items || []).length >= MAX_ITEMS}
              sx={{ mt: 2, alignSelf: 'flex-start' }}
            >
              Add consent option
            </Button>
          )}

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

export default DynamicConsentForm;
