import React, { createContext, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import ContentCopy from '@mui/icons-material/ContentCopy';
import EmailIcon from '@mui/icons-material/Email';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const ChromeContext = createContext(null);

const sectionSx = { mb: 2, p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#fff' };

function useChrome() {
  const ctx = useContext(ChromeContext);
  if (!ctx) throw new Error('Survey builder chrome is missing');
  return ctx;
}

function LayoutFields() {
  const { surveyData, setSurveyData } = useChrome();
  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Layout</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={surveyData.surveyLayout === 'onePage'}
            onChange={(e) => setSurveyData((prev) => ({
              ...prev,
              surveyLayout: e.target.checked ? 'onePage' : 'oneQuestion',
            }))}
            size="small"
          />
        }
        label="Show all questions on one page"
      />
    </>
  );
}

function TargetRegionsFields() {
  const { isSuperAdmin, selectedCountries, onRegionToggle, regionOptions } = useChrome();
  if (!isSuperAdmin) return null;
  return (
    <FormControl component="fieldset" fullWidth>
      <Typography variant="subtitle1" component="legend" sx={{ mb: 1 }}>
        Select Target Regions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        On each response, one selected region is chosen at random and a matching IP is assigned.
      </Typography>
      <FormGroup>
        {regionOptions.map(({ code, label }) => (
          <FormControlLabel
            key={code}
            control={
              <Checkbox
                checked={selectedCountries.includes(code)}
                onChange={() => onRegionToggle(code)}
                size="small"
              />
            }
            label={label}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}

function CloseRulesFields() {
  const {
    surveyData,
    setSurveyData,
    handleFormChange,
    passwordEnabled,
    setPasswordEnabled,
    accessPassword,
    setAccessPassword,
  } = useChrome();
  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Close rules</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Close date"
          type="datetime-local"
          name="closesAt"
          value={surveyData.closesAt || ''}
          onChange={handleFormChange}
          InputLabelProps={{ shrink: true }}
          size="small"
          fullWidth
        />
        <TextField
          label="Max responses"
          type="number"
          name="maxResponses"
          value={surveyData.maxResponses ?? ''}
          onChange={handleFormChange}
          inputProps={{ min: 1 }}
          size="small"
          fullWidth
        />
      </Stack>
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(surveyData.oneResponsePerPerson)}
            onChange={(e) => setSurveyData((prev) => ({ ...prev, oneResponsePerPerson: e.target.checked }))}
            size="small"
          />
        }
        label="One response per person"
      />
      <FormControlLabel
        control={
          <Switch
            checked={passwordEnabled}
            onChange={(e) => {
              const on = e.target.checked;
              setPasswordEnabled(on);
              if (!on) setAccessPassword('');
            }}
            size="small"
          />
        }
        label="Require a password to take this survey"
      />
      {passwordEnabled && (
        <TextField
          label={surveyData.passwordRequired ? 'Set a new password' : 'Access password'}
          type="password"
          autoComplete="new-password"
          value={accessPassword}
          onChange={(e) => setAccessPassword(e.target.value)}
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          helperText={
            surveyData.passwordRequired
              ? 'A password is currently required. Leave blank to keep it, or type a new one to replace it.'
              : 'Respondents must enter this password to take the survey.'
          }
        />
      )}
    </>
  );
}

function AiDraftFields() {
  const { aiUsage, aiPrompt, setAiPrompt, aiBusy, onGenerateAi } = useChrome();
  return (
    <Box sx={sectionSx}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>AI draft</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {aiUsage?.unlimited
          ? 'Unlimited AI drafts'
          : `${aiUsage?.remaining ?? 0} of ${aiUsage?.limit ?? 2} AI drafts left this month`}
      </Typography>
      <TextField
        label="Describe the survey"
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        multiline
        minRows={3}
        fullWidth
        size="small"
        disabled={aiBusy || (!aiUsage?.unlimited && (aiUsage?.remaining ?? 0) <= 0)}
        inputProps={{ maxLength: 4000 }}
      />
      <Button
        sx={{ mt: 1 }}
        variant="contained"
        size="small"
        disabled={
          aiBusy
          || !aiPrompt.trim()
          || (!aiUsage?.unlimited && (aiUsage?.remaining ?? 0) <= 0)
        }
        onClick={onGenerateAi}
      >
        {aiBusy ? 'Generating…' : 'Generate questions'}
      </Button>
    </Box>
  );
}

function ShareFields() {
  const { surveyId, surveyData, takeSurveyUrl, embedSnippet, onCopyUrl, onCopyEmbed, onShare } = useChrome();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, width: '100%' }}>
        <TextField
          label="Survey URL"
          variant="outlined"
          sx={{ flexGrow: 1 }}
          value={`${import.meta.env.VITE_BACKEND_URL}/survey-meta/${surveyId}`}
          InputProps={{ readOnly: true }}
        />
        <Tooltip title="Share options">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
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
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
        >
          <MenuItem onClick={onCopyUrl}>
            <ListItemIcon>
              <ContentCopy fontSize="small" />
            </ListItemIcon>
            Copy URL
          </MenuItem>
          <MenuItem onClick={() => onShare('whatsapp')}>
            <ListItemIcon>
              <WhatsAppIcon fontSize="small" />
            </ListItemIcon>
            Share via WhatsApp
          </MenuItem>
          <MenuItem onClick={() => onShare('email')}>
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            Share via Email
          </MenuItem>
        </Menu>
      </Box>
      {surveyData.surveyStatus === 'Draft' && (
        <Typography variant="body2" color="warning.main">
          This share URL will not collect responses until the survey is published.
        </Typography>
      )}
      <TextField
        label="Embed on your website"
        value={embedSnippet}
        InputProps={{ readOnly: true }}
        fullWidth
        size="small"
        sx={{ mt: 1 }}
      />
      <Button size="small" onClick={onCopyEmbed} sx={{ alignSelf: 'flex-start' }}>
        Copy embed code
      </Button>
      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">QR code</Typography>
        <Box
          component="img"
          alt="Survey QR code"
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(takeSurveyUrl)}`}
          sx={{ width: 160, height: 160, border: '1px solid #e2e8f0', borderRadius: 1 }}
        />
      </Box>
    </Box>
  );
}

function SettingsStack({ showAi }) {
  const { isSuperAdmin } = useChrome();
  return (
    <Stack spacing={2}>
      <Box sx={sectionSx}>
        <CloseRulesFields />
      </Box>
      <Box sx={sectionSx}>
        <LayoutFields />
      </Box>
      {isSuperAdmin && (
        <Box sx={sectionSx}>
          <TargetRegionsFields />
        </Box>
      )}
      {showAi && isSuperAdmin && <AiDraftFields />}
    </Stack>
  );
}

export function SurveyBuilderChromeProvider({ children, tabApiRef, ...value }) {
  const [tab, setTab] = useState('build');
  if (tabApiRef) {
    tabApiRef.current = { setTab };
  }
  const ctx = { ...value, tab, setTab };
  return (
    <ChromeContext.Provider value={ctx}>
      {children}
    </ChromeContext.Provider>
  );
}

export function SurveyBuilderChromeBody({ children }) {
  const { tab, setTab, isSuperAdmin, surveyData } = useChrome();
  const hasQuestions = (surveyData.surveyForms?.length ?? 0) > 0;
  const showEmptyAi = isSuperAdmin && !hasQuestions;
  const showSettingsAi = isSuperAdmin && hasQuestions;

  return (
    <>
      <Box sx={{ mt: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_e, next) => setTab(next)}>
          <Tab value="build" label="Build" />
          <Tab value="settings" label="Settings" />
          <Tab value="share" label="Share" />
        </Tabs>
      </Box>
      {showEmptyAi && tab === 'build' && <Box sx={{ mt: 2 }}><AiDraftFields /></Box>}
      <Box sx={{ display: tab === 'build' ? 'block' : 'none' }}>
        {children}
      </Box>
      {tab === 'settings' && (
        <Box sx={{ mt: 2 }}>
          <SettingsStack showAi={showSettingsAi} />
        </Box>
      )}
      {tab === 'share' && (
        <Box sx={{ mt: 2, ...sectionSx }}>
          <ShareFields />
        </Box>
      )}
    </>
  );
}
