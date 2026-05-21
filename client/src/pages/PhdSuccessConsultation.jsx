import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import theme from '../utils/theme';
import { backendUrl } from '../utils/backendUrl';

const initialFormData = {
  username: '',
  email: '',
  message: '',
  contact: '',
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
    setSubmitting(true);
    try {
      await axios.post(`${backendUrl}/api/send-email/contact-us`, {
        ...formData,
        message: `[PhD Success Consultation]\n\n${formData.message}`,
      });
      setFormData(initialFormData);
      setAlertStatus('success');
      setAlertText('Message sent successfully. We will contact you shortly.');
      setOpen(true);
    } catch {
      setAlertStatus('error');
      setAlertText('Failed to send message. Please try again later.');
      setOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
                    label="Given Name"
                    variant="standard"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                  />
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email Address"
                    variant="standard"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                  />
                  <TextField
                    fullWidth
                    label="Contact Number"
                    variant="standard"
                    name="contact"
                    value={formData.contact}
                    onChange={handleFormChange}
                  />
                  <TextField
                    fullWidth
                    required
                    label="Your Message"
                    variant="filled"
                    name="message"
                    value={formData.message}
                    multiline
                    rows={4}
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
                    {submitting ? 'Sending…' : 'Send Message'}
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
