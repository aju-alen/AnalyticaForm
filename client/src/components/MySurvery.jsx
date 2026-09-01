import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';

function surveyShareUrl(id) {
  return `${import.meta.env.VITE_BACKEND_URL}/survey-meta/${id}`;
}

function surveyShareLabel(id) {
  try {
    const parsed = new URL(surveyShareUrl(id));
    return `${parsed.host}/survey-meta/${id}`;
  } catch {
    return `/survey-meta/${id}`;
  }
}

export function MySurvey({ userSurveyData, isSubscribed, onDeleteSurvey,handleDataChanged }) {
  console.log(userSurveyData,'--userSurveyData--');
  const primaryColor = 'rgb(25, 118, 210)';
  
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  const [isloading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [surveyId, setSurveyId] = React.useState('');
  const [pricingDialogOpen, setPricingDialogOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loadingSurveyId, setLoadingSurveyId] = React.useState(null);

  const handleChangeSelect = async(event, surveyId) => {
    try {
      setLoadingSurveyId(surveyId);
      const updateSurveyStatus = await axiosWithAuth.put(`${backendUrl}/api/survey/update-survey-status/${surveyId}`,{surveyStatus:event.target.value});
      handleDataChanged(prev=>!prev);
    }
    catch(err) {
      console.log(err)
    }
    finally {
      setLoadingSurveyId(null);
    }
  };
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event,surveyId) => {
    setSurveyId(surveyId);
    

    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = (surveyId) => {
    setSurveyId(surveyId);
    setOpen(true);
    handleCloseMenu();
  };

  const handleOpenAnalytics = (surveyId) => {
    handleCloseMenu();
    navigate(`/dashboard/analytics/${surveyId}`);
  };

  const handlePricingDialogClose = (proceed) => {
    setPricingDialogOpen(false);
    if (proceed) {
      navigate('/pricing');
    }
  };

  const handlePreviewSurvey = (id) => {
    handleCloseMenu();
    window.open(`${window.location.origin}/user-survey/${id}?preview=1`, '_blank', 'noopener,noreferrer');
  };

  const handleCopySurveyUrl = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(surveyShareUrl(id)).then(() => {
      setSnackbar({ open: true, message: 'Survey link copied.', severity: 'success' });
    }).catch(() => {
      setSnackbar({ open: true, message: 'Could not copy the survey link.', severity: 'error' });
    });
  };

  const handleCloneSurvey = async (id) => {
    handleCloseMenu();
    try {
      setIsLoading(true);
      await refreshToken();
      const cloned = await axiosWithAuth.post(`${backendUrl}/api/survey/clone-survey/${id}`);
      const newId = cloned.data?.newSurvey?.id;
      handleDataChanged((prev) => !prev);
      setSnackbar({ open: true, message: 'Survey cloned as a draft.', severity: 'success' });
      if (newId) {
        navigate(`/dashboard/create-survey/${newId}`);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Could not clone survey.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOpen = (surveyId) => {
    setSurveyId(surveyId);
    setDeleteOpen(true);
    handleCloseMenu();
  };

  const handleClose = () => {
    setOpen(false);
    setDeleteOpen(false);
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      setIsLoading(true);
      await refreshToken();
      const deleteSurvey = await axiosWithAuth.delete(`${backendUrl}/api/survey/delete-survey/${surveyId}`);
      console.log('delete survey', deleteSurvey);
      setDeleteOpen(false);
      onDeleteSurvey(surveyId);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response.status === 401) {
        console.log('unauthorized');
        localStorage.removeItem('dubaiAnalytica-userAccess');
        navigate('/login');
      } else {
        console.log(err);
      }
    }
  };

  const handleConvertToExcelAnswer = async (surveyId) => {
    console.log(surveyId);
    try {
      setIsLoading(true);
      await refreshToken();
      const response = await axiosWithAuth.post(`${backendUrl}/api/excel/export-to-excel/${surveyId}`, {}, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = response.headers?.['content-disposition'] || '';
      const named = disposition.match(/filename="?([^"]+)"?/);
      a.download = named?.[1] || 'survey Answers.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
      handleClose();
    } catch (err) {
      setIsLoading(false);
      handleClose();
      if (err.response.status === 401) {
        console.log('unauthorized');
        localStorage.removeItem('dubaiAnalytica-userAccess');
        navigate('/login');
      } else {
        console.log(err);
      }
    }
  };
  const handleConvertToExcelIndex = async (surveyId) => {
    console.log(surveyId);
    try {
      setIsLoading(true);
      await refreshToken();
      const response = await axiosWithAuth.post(`${backendUrl}/api/excel/export-to-excel-index/${surveyId}`, {}, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = response.headers?.['content-disposition'] || '';
      const named = disposition.match(/filename="?([^"]+)"?/);
      a.download = named?.[1] || 'survey Index.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      setIsLoading(false);
      handleClose();
    } catch (err) {
      setIsLoading(false);
      handleClose();
      if (err.response.status === 401) {
        console.log('unauthorized');
        localStorage.removeItem('dubaiAnalytica-userAccess');
        navigate('/login');
      } else {
        console.log(err);
      }
    }
  };

  return (
    <Box component="section" sx={{ p: { xs: 0, md: 2 }, pt: { xs: 2 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 0.5, md: 1 } }}>
        <CssBaseline />
        <Box
          sx={{
            borderRadius: 3,
            bgcolor: alpha('#ffffff', 0.88),
            border: `1px solid ${alpha(primaryColor, 0.2)}`,
            boxShadow: `0 20px 34px ${alpha(primaryColor, 0.08)}`,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              p: { xs: 1.5, md: 2.5 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              borderBottom: `1px solid ${alpha(primaryColor, 0.15)}`,
              backgroundColor: alpha(primaryColor, 0.08)
            }}
          >
            <Typography sx={{ fontWeight: 800, color: '#0f172a' }}>
              Your Surveys
            </Typography>
            <Chip
              label={`${userSurveyData.length} total`}
              sx={{
                fontWeight: 700,
                color: primaryColor,
                backgroundColor: alpha(primaryColor, 0.2),
                border: `1px solid ${alpha(primaryColor, 0.25)}`
              }}
            />
          </Box>
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 0,
              bgcolor: 'transparent',
              boxShadow: 'none',
              '@media (max-width: 600px)': {
                '& table': {
                  display: 'block'
                },
                '& thead': {
                  display: 'none'
                },
                '& tbody': {
                  display: 'block',
                  padding: '1rem'
                },
                '& tr': {
                  display: 'block',
                  marginBottom: '1.5rem',
                  boxShadow: `0 12px 20px ${alpha(primaryColor, 0.08)}`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                  backgroundColor: alpha('#ffffff', 0.95),
                  border: `1px solid ${alpha(primaryColor, 0.2)}`,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 14px 24px ${alpha(primaryColor, 0.12)}`
                  }
                },
                '& td': {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  textAlign: 'right',
                  borderBottom: '1px solid #f0f0f0',
                  '&:last-child': {
                    borderBottom: 'none'
                  },
                  '&:before': {
                    content: 'attr(data-label)',
                    float: 'left',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    letterSpacing: '0.05em'
                  }
                }
              }
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(primaryColor, 0.12) }}>
                  <TableCell align="center" sx={{ fontWeight: 'bold', py: 2.5, color: '#0f172a' }}>Survey Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' }, py: 2.5, color: '#0f172a' }}>Created At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' }, py: 2.5, color: '#0f172a' }}>Modified At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', py: 2.5, color: '#0f172a' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', py: 2.5, color: '#0f172a' }}>Response</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', py: 2.5, color: '#0f172a' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userSurveyData.map((survey) => (
                  <TableRow
                    key={survey.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: alpha(primaryColor, 0.08) },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell data-label="Survey Name" align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: { xs: 'flex-end', sm: 'center' },
                          gap: 0.25,
                          width: '100%',
                          minWidth: 0,
                        }}
                      >
                        <Link to={`/dashboard/create-survey/${survey.id}`} style={{ textDecoration: 'none' }}>
                          <Button 
                            variant="text" 
                            color="primary"
                            sx={{ 
                              width: { xs: '100%', sm: 'auto' },
                              justifyContent: { xs: 'flex-end', sm: 'center' },
                              fontWeight: 700,
                              color: primaryColor,
                              textTransform: 'none',
                              '&:hover': {
                                bgcolor: alpha(primaryColor, 0.2)
                              }
                            }}
                          >
                            {survey.surveyTitle}
                          </Button>
                        </Link>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.25,
                            maxWidth: { xs: '70%', sm: 240 },
                          }}
                        >
                          <Tooltip title={surveyShareUrl(survey.id)}>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              noWrap
                              sx={{ cursor: 'pointer', maxWidth: '100%' }}
                              onClick={(event) => handleCopySurveyUrl(event, survey.id)}
                            >
                              {surveyShareLabel(survey.id)}
                            </Typography>
                          </Tooltip>
                          <Tooltip title="Copy link">
                            <IconButton
                              size="small"
                              onClick={(event) => handleCopySurveyUrl(event, survey.id)}
                              aria-label="Copy survey link"
                              sx={{ p: 0.25 }}
                            >
                              <ContentCopyOutlinedIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell data-label="Created" align="center" sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>
                      {dayjs(survey.createdAt).fromNow()}
                    </TableCell>
                    <TableCell data-label="Modified" align="center" sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>
                      {dayjs(survey.updatedAt).fromNow()}
                    </TableCell>
                    <TableCell data-label="Status" align="center">
                      <Select
                        value={survey.surveyStatus}
                        onChange={(event) => handleChangeSelect(event, survey.id)}
                        variant='standard'
                        sx={{ 
                          minWidth: { xs: '120px', sm: '150px' },
                          '& .MuiSelect-select': {
                            py: 1,
                            px: 2,
                            borderRadius: '20px',
                            bgcolor: survey.surveyStatus === 'Active'
                              ? alpha(primaryColor, 0.2)
                              : survey.surveyStatus === 'Draft'
                                ? alpha('#f59e0b', 0.2)
                                : alpha('#cbd5e1', 0.4),
                            color: survey.surveyStatus === 'Active'
                              ? primaryColor
                              : survey.surveyStatus === 'Draft'
                                ? '#b45309'
                                : '#475569',
                            fontWeight: 500
                          },
                          '&:before, &:after': { display: 'none' }
                        }}
                      >
                        <MenuItem value={'Draft'}>
                          {loadingSurveyId === survey.id ? <CircularProgress size={20} /> : "Draft"}
                        </MenuItem>
                        <MenuItem value={'Active'}>
                          {loadingSurveyId === survey.id ? <CircularProgress size={20} /> : "Active"}
                        </MenuItem>
                        <MenuItem value={'Disable'}>
                          {loadingSurveyId === survey.id ? <CircularProgress size={20} /> : "Inactive"}
                        </MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell data-label="Responses" align="center">
                      <Typography
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 2,
                          py: 0.5,
                          borderRadius: '16px',
                          bgcolor: alpha(primaryColor, 0.25),
                          color: primaryColor,
                          fontWeight: 600
                        }}
                      >
                        {survey.surveyResponses}
                      </Typography>
                    </TableCell>
                    <TableCell data-label="Actions" align="center">
                      <Button
                        sx={{ 
                          minWidth: 'auto',
                          p: 1,
                          borderRadius: '50%',
                          '&:hover': {
                            bgcolor: alpha(primaryColor, 0.2)
                          }
                        }}
                        onClick={(event) => handleClickMenu(event, survey.id)}
                      >
                        <MenuOpenIcon sx={{ color: primaryColor }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          sx={{
            '& .MuiPaper-root': {
              minWidth: '220px',
              borderRadius: 2,
              mt: 1,
              border: `1px solid ${alpha(primaryColor, 0.2)}`,
              boxShadow: `0 14px 28px ${alpha(primaryColor, 0.12)}`
            }
          }}
        >
          <MenuItem
            onClick={() => handlePreviewSurvey(surveyId)}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemIcon>
              <VisibilityOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Preview</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleOpenAnalytics(surveyId)}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemIcon>
              <BarChartOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Analytics</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              navigate(`/dashboard/invites/${surveyId}`);
            }}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemIcon>
              <MailOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Invitations</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleClickOpen(surveyId)}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemIcon>
              <FileDownloadOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleCloneSurvey(surveyId)}
            sx={{ py: 1, px: 2 }}
          >
            <ListItemIcon>
              <ContentCopyOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Clone</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => handleDeleteOpen(surveyId)}
            sx={{
              py: 1,
              px: 2,
              color: 'error.main',
              '&:hover': {
                bgcolor: alpha('#fee2e2', 1),
              }
            }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Container>
      <Dialog
        open={deleteOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${alpha(primaryColor, 0.2)}`
          }
        }}
      >
                        <DialogTitle>{"Are you sure you want to delete this survey?"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            If you delete this survey, all data including participant responses will be lost.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button
  onClick={() => {
    handleDeleteSurvey(surveyId);
  }}
  color="error"
>
  {isloading? <CircularProgress color='error' /> :"Delete"}

</Button>
                          <Button onClick={handleClose} variant="contained" sx={{ bgcolor: primaryColor, '&:hover': { bgcolor: primaryColor } }}>
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <Dialog
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          sx: {
                            borderRadius: 3,
                            border: `1px solid ${alpha(primaryColor, 0.2)}`
                          }
                        }}
                      >
                        <DialogTitle>{"Export User Responses"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Display as Answers - This will show user responses as answers in the Excel sheet.
                          </DialogContentText>
                          <DialogContentText>
                            Display as Index - This will show user responses as index in the Excel sheet.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => handleConvertToExcelAnswer(surveyId)} color="primary">
                           { isloading? <CircularProgress /> :"Display as Answers"}
                          </Button>
                          <Button onClick={() => handleConvertToExcelIndex(surveyId)} color="primary">
                            {isloading?"" :"Display as Index"}
                          </Button>
                          <Button onClick={handleClose} color="secondary">
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog>

      {/* Pricing Dialog */}
      <Dialog
        open={pricingDialogOpen}
        onClose={() => handlePricingDialogClose(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            border: `1px solid ${alpha(primaryColor, 0.2)}`
          }
        }}
      >
        <DialogTitle>Upgrade Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Response analytics for individual respondents, plus email invitations, are available on Premium. Would you like to view our pricing plans?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePricingDialogClose(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handlePricingDialogClose(true)} variant="contained" sx={{ bgcolor: primaryColor, '&:hover': { bgcolor: primaryColor } }}>
            View Pricing
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MySurvey;
