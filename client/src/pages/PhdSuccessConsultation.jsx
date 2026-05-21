import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import baseTheme from '../utils/theme';
import { backendUrl } from '../utils/backendUrl';
import { openSchedulerInNewTab } from '../utils/phdSuccessRedirect';

const redTheme = createTheme(baseTheme, {
  palette: {
    primary: {
      main: '#c62828',
      light: '#ef5350',
      dark: '#8e0000',
      contrastText: '#fff',
    },
  },
});

const DISSERTATION_STAGES = [
  'Research',
  'Editing',
  'Writing',
  'Data Collection & Analysis',
];

const CONSULTATION_METHODS = ['Phone', 'Video Call', 'In Person'];

const URGENCY_OPTIONS = Array.from({ length: 6 }, (_, i) => `${i + 1} week${i === 0 ? '' : 's'}`);

const IMPORTANCE_OPTIONS = Array.from({ length: 10 }, (_, i) => `${(i + 1) * 10}%`);

const initialFormData = {
  fullName: '',
  email: '',
  phone: '',
  university: '',
  dissertationStage: '',
  needsDescription: '',
  consultationMethod: '',
  budget: '',
  urgency: '',
  importance: '',
  additionalComments: '',
};

const PhdSuccessConsultation = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [open, setOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState('success');
  const [alertText, setAlertText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const schedulerTab = openSchedulerInNewTab(formData.email);
    setSubmitting(true);
    try {
      await axios.post(`${backendUrl}/api/dri/phd-success-consultation-form`, formData);
      const tabOpened = schedulerTab;
      setFormData(initialFormData);
      setAlertStatus('success');
      setAlertText(
        tabOpened
          ? 'Form submitted. A new tab has opened to schedule your session.'
          : 'Form submitted. Please allow pop-ups, then click Submit again to open the scheduler.'
      );
      setOpen(true);
    } catch {
      schedulerTab?.close();
      setAlertStatus('error');
      setAlertText('Failed to send message. Please try again later.');
      setOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const selectField = (name, label, options, required = true) => (
    <FormControl fullWidth required={required} variant="standard">
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        name={name}
        value={formData[name]}
        label={label}
        onChange={handleFormChange}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <ThemeProvider theme={redTheme}>
      <Box
        component="main"
        sx={{
          bgcolor: '#fff',
          minHeight: '100%',
          py: { xs: 2, sm: 3 },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack spacing={2} component="form" onSubmit={handleSubmit}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  textAlign: 'center',
                  color: 'primary.main',
                }}
              >
                PhD Success Consultation
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                Please fill out this form and we will contact you shortly.
              </Typography>

              <FormControl fullWidth>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    required
                    label="Full Name"
                    variant="standard"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                  />
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email"
                    variant="standard"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                  <TextField
                    fullWidth
                    required
                    label="Phone Number"
                    variant="standard"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                  <TextField
                    fullWidth
                    required
                    label="University/Institution"
                    variant="standard"
                    name="university"
                    value={formData.university}
                    onChange={handleFormChange}
                  />
                  {selectField('dissertationStage', 'Current Stage of Dissertation', DISSERTATION_STAGES)}
                  <TextField
                    fullWidth
                    required
                    label="Brief Description of Your Needs/Challenges"
                    variant="filled"
                    name="needsDescription"
                    value={formData.needsDescription}
                    multiline
                    rows={4}
                    onChange={handleFormChange}
                  />
                  {selectField('consultationMethod', 'Preferred Method of Consultation', CONSULTATION_METHODS)}
                  <TextField
                    fullWidth
                    required
                    label="Enter Your Budget"
                    variant="standard"
                    name="budget"
                    value={formData.budget}
                    onChange={handleFormChange}
                  />
                  {selectField('urgency', 'Range of Urgency (How fast do you need it)', URGENCY_OPTIONS)}
                  {selectField('importance', 'Range of Importance (How important is this to you)', IMPORTANCE_OPTIONS)}
                  <TextField
                    fullWidth
                    label="Additional Comments"
                    variant="filled"
                    name="additionalComments"
                    value={formData.additionalComments}
                    multiline
                    rows={3}
                    onChange={handleFormChange}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{
                      mt: 1,
                      alignSelf: 'center',
                      width: { xs: '100%', sm: '60%' },
                    }}
                  >
                    {submitting ? 'Sending…' : 'Submit'}
                  </Button>
                </Stack>
              </FormControl>
            </Stack>
          </Paper>
        </Container>

        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity={alertStatus}
            sx={{ width: '100%' }}
          >
            {alertText}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default PhdSuccessConsultation;
