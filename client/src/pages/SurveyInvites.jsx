import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import { refreshToken } from '../utils/refreshToken';
import { clearUserAccess } from '../utils/userAccess';

const primaryColor = 'rgb(25, 118, 210)';

const SurveyInvites = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyStatus, setSurveyStatus] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [importText, setImportText] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendReminder, setSendReminder] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const [extraEmails, setExtraEmails] = useState('');
  const [sending, setSending] = useState(false);
  const [expandedCampaignId, setExpandedCampaignId] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [inviteQuota, setInviteQuota] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info', showPricing: false });

  const loadData = async () => {
    await refreshToken();
    const [contactsRes, campaignsRes] = await Promise.all([
      axiosWithAuth.get(`${backendUrl}/api/survey-invites/contacts`),
      axiosWithAuth.get(`${backendUrl}/api/survey-invites/campaigns/${surveyId}`),
    ]);
    setContacts(contactsRes.data.contacts || []);
    setCampaigns(campaignsRes.data.campaigns || []);
    setSurveyTitle(campaignsRes.data.surveyTitle || '');
    setSurveyStatus(campaignsRes.data.surveyStatus || '');
    setInviteQuota(campaignsRes.data.inviteQuota || null);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadData();
      } catch (err) {
        if (err.response?.status === 401) {
          clearUserAccess();
          navigate('/login');
          return;
        }
        if (err.response?.status === 403) {
          setSnackbar({
            open: true,
            message: err.response.data?.message || 'Email invitations are available on the Premium plan.',
            severity: 'warning',
            showPricing: true,
          });
        } else {
          setSnackbar({
            open: true,
            message: err.response?.data?.message || 'Could not load invitations.',
            severity: 'error',
            showPricing: false,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [surveyId, navigate]);

  const handleAddContact = async () => {
    try {
      await refreshToken();
      await axiosWithAuth.post(`${backendUrl}/api/survey-invites/contacts`, {
        email: contactEmail,
        name: contactName,
      });
      setContactEmail('');
      setContactName('');
      await loadData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Could not add contact.',
        severity: 'error',
        showPricing: err.response?.status === 403,
      });
    }
  };

  const handleImportContacts = async () => {
    try {
      await refreshToken();
      const result = await axiosWithAuth.post(`${backendUrl}/api/survey-invites/contacts/import`, {
        rawText: importText,
      });
      setImportText('');
      await loadData();
      setSnackbar({
        open: true,
        message: `Created ${result.data.created}, skipped ${result.data.skipped}, invalid ${result.data.invalid}.`,
        severity: 'success',
        showPricing: false,
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Could not import contacts.',
        severity: 'error',
        showPricing: err.response?.status === 403,
      });
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await refreshToken();
      await axiosWithAuth.delete(`${backendUrl}/api/survey-invites/contacts/${contactId}`);
      setSelectedContactIds((prev) => prev.filter((id) => id !== contactId));
      await loadData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Could not delete contact.',
        severity: 'error',
        showPricing: false,
      });
    }
  };

  const toggleContact = (contactId) => {
    setSelectedContactIds((prev) => (
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    ));
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setSelectedContactIds(checked ? contacts.filter((c) => !c.unsubscribedAt).map((c) => c.id) : []);
  };

  const handleSend = async () => {
    if (surveyStatus !== 'Active') return;
    setSending(true);
    try {
      await refreshToken();
      await axiosWithAuth.post(`${backendUrl}/api/survey-invites/campaigns/${surveyId}`, {
        subject,
        message,
        contactIds: selectedContactIds,
        extraEmails,
        sendReminder,
      });
      setSubject('');
      setMessage('');
      setExtraEmails('');
      await loadData();
      setSnackbar({
        open: true,
        message: 'Invitations queued. Emails go out within a minute.',
        severity: 'success',
        showPricing: false,
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Could not send invitations.',
        severity: err.response?.status === 403 ? 'warning' : 'error',
        showPricing: err.response?.status === 403,
      });
    } finally {
      setSending(false);
    }
  };

  const handleLoadRecipients = async (campaignId) => {
    if (expandedCampaignId === campaignId) {
      setExpandedCampaignId('');
      setRecipients([]);
      return;
    }
    try {
      await refreshToken();
      const result = await axiosWithAuth.get(
        `${backendUrl}/api/survey-invites/campaigns/${surveyId}/${campaignId}/recipients`
      );
      setExpandedCampaignId(campaignId);
      setRecipients(result.data.recipients || []);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Could not load recipients.',
        severity: 'error',
        showPricing: false,
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button onClick={() => navigate('/dashboard')} sx={{ mb: 2 }}>Back</Button>
      <Typography variant="h4" sx={{ mb: 0.5 }}>Email invitations</Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>{surveyTitle}</Typography>
      {surveyStatus !== 'Active' && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Publish this survey before sending invitations.
        </Alert>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        If this survey is password protected, respondents still need to enter the password. The invite email does not include it.
      </Typography>
      {inviteQuota?.unlimited ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Premium invitation limits: 200 recipients per campaign, 5 campaigns per survey per day, 500 sends per day.
        </Alert>
      ) : inviteQuota ? (
        <Alert severity={inviteQuota.campaignsRemaining < 1 || inviteQuota.recipientsRemaining < 1 ? 'warning' : 'info'} sx={{ mb: 3 }}>
          Free plan: {inviteQuota.campaignsRemaining} of {inviteQuota.campaignsLimit} campaign
          {inviteQuota.campaignsLimit === 1 ? '' : 's'} left this month, and {inviteQuota.recipientsRemaining} of {inviteQuota.recipientsLimit} recipients left.
        </Alert>
      ) : null}

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Contacts</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <TextField size="small" label="Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          <TextField size="small" label="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} fullWidth />
          <Button variant="contained" onClick={handleAddContact} sx={{ bgcolor: primaryColor }}>Add</Button>
        </Stack>
        <TextField
          label="Paste emails"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          multiline
          minRows={3}
          fullWidth
          helperText="One email per line, or email, name"
          sx={{ mb: 1.5 }}
        />
        <Button variant="outlined" onClick={handleImportContacts} sx={{ mb: 2 }}>Import</Button>
        <FormControlLabel
          control={<Checkbox checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} />}
          label="Select all contacts"
        />
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedContactIds.includes(contact.id)}
                    disabled={Boolean(contact.unsubscribedAt)}
                    onChange={() => toggleContact(contact.id)}
                  />
                </TableCell>
                <TableCell>
                  {contact.email}
                  {contact.unsubscribedAt ? <Chip size="small" label="Unsubscribed" sx={{ ml: 1 }} /> : null}
                </TableCell>
                <TableCell>{contact.name || '—'}</TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={() => handleDeleteContact(contact.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Compose</Typography>
        <TextField
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          fullWidth
          inputProps={{ maxLength: 120 }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          minRows={4}
          inputProps={{ maxLength: 2000 }}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={<Switch checked={sendReminder} onChange={(e) => setSendReminder(e.target.checked)} />}
          label="Send a reminder after 3 days"
        />
        <TextField
          label="Extra emails"
          value={extraEmails}
          onChange={(e) => setExtraEmails(e.target.value)}
          fullWidth
          multiline
          minRows={2}
          sx={{ mt: 2, mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={
            sending
            || surveyStatus !== 'Active'
            || (inviteQuota && !inviteQuota.unlimited && (inviteQuota.campaignsRemaining < 1 || inviteQuota.recipientsRemaining < 1))
          }
          sx={{ bgcolor: primaryColor }}
        >
          {sending ? <CircularProgress size={20} color="inherit" /> : 'Send'}
        </Button>
      </Paper>

      <Paper sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Campaigns</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Created</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Counts</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <React.Fragment key={campaign.id}>
                <TableRow>
                  <TableCell>{new Date(campaign.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{campaign.subject}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    queued {campaign.counts.queued}, sent {campaign.counts.sent}, opened {campaign.counts.opened}, finished {campaign.counts.completed}, failed {campaign.counts.failed}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleLoadRecipients(campaign.id)}>Recipients</Button>
                  </TableCell>
                </TableRow>
                {expandedCampaignId === campaign.id && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Sent</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {recipients.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>{row.email}</TableCell>
                              <TableCell>{row.name || '—'}</TableCell>
                              <TableCell>{row.status}</TableCell>
                              <TableCell>{row.sentAt ? new Date(row.sentAt).toLocaleString() : '—'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          action={snackbar.showPricing ? (
            <Button color="inherit" size="small" onClick={() => navigate('/pricing')}>Pricing</Button>
          ) : null}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SurveyInvites;
