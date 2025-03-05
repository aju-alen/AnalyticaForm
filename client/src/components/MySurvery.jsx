import MenuOpenIcon from '@mui/icons-material/MenuOpen';
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
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';

export function MySurvey({ userSurveyData, isSubscribed, onDeleteSurvey,handleDataChanged }) {
  console.log(userSurveyData,'--userSurveyData--');
  
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  const [isloading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [surveyId, setSurveyId] = React.useState('');

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
      const getAllUserResponse = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-user-response/${surveyId}/${isSubscribed}`);
      console.log(getAllUserResponse.data,'--getAllUserResponse--asjhdajhsbd');
      if (getAllUserResponse.data.length === 0) {
        alert('No response available for this survey');
        setIsLoading(false);
        handleClose();
        return;
      }
      
      const response = await axiosWithAuth.post(`${backendUrl}/api/excel/export-to-excel`, getAllUserResponse.data, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      console.log(getAllUserResponse.data[0]["survey"].surveyTitle,'final answer');
      
      a.download = `${getAllUserResponse.data[0]["survey"].surveyTitle} Answers.xlsx`;
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
      const getAllUserResponse = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-user-response/${surveyId}/${isSubscribed}`);
      console.log(getAllUserResponse.data,'--getAllUserResponse--');
      if (getAllUserResponse.data.length === 0) {
        alert('No response available for this survey');
        setIsLoading(false);
        handleClose();
        return;
      }
      
      const response = await axiosWithAuth.post(`${backendUrl}/api/excel/export-to-excel-index`, getAllUserResponse.data, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${getAllUserResponse.data[0]["survey"].surveyTitle} Index.xlsx`;
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
    <Box component="section" sx={{ p: { xs: 0, md: 10 }, pt: { xs: 4 } }}>
      <Container maxWidth="2xl">
        <CssBaseline />
        <Box sx={{ boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 2,
              bgcolor: 'background.paper',
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
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  backgroundColor: '#fff',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
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
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell align="center" sx={{ fontWeight: 'bold', py: 2.5 }}>Survey Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' }, py: 2.5 }}>Created At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' }, py: 2.5 }}>Modified At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', py: 2.5 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', py: 2.5 }}>Response</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', py: 2.5 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userSurveyData.map((survey) => (
                  <TableRow
                    key={survey.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { bgcolor: 'grey.50' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell data-label="Survey Name" align="center">
                      <Link to={`/dashboard/create-survey/${survey.id}`} style={{ textDecoration: 'none' }}>
                        <Button 
                          variant="text" 
                          color="primary"
                          sx={{ 
                            width: { xs: '100%', sm: 'auto' },
                            justifyContent: 'flex-start',
                            fontWeight: 500,
                            '&:hover': {
                              bgcolor: 'primary.50'
                            }
                          }}
                        >
                          {survey.surveyTitle}
                        </Button>
                      </Link>
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
                            bgcolor: survey.surveyStatus === 'Active' ? 'success.50' : 'grey.100',
                            color: survey.surveyStatus === 'Active' ? 'success.main' : 'text.secondary',
                            fontWeight: 500
                          }
                        }}
                      >
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
                          bgcolor: 'primary.50',
                          color: 'primary.main',
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
                            bgcolor: 'grey.100'
                          }
                        }}
                        onClick={(event) => handleClickMenu(event, survey.id)}
                      >
                        <MenuOpenIcon color='action' />
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
              minWidth: '200px',
              borderRadius: 2,
              mt: 1,
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
            }
          }}
        >
          <MenuItem 
            onClick={() => handleDeleteOpen(surveyId)}
            sx={{ 
              py: 1.5,
              px: 2.5,
              '&:hover': {
                bgcolor: 'error.50',
                color: 'error.main'
              }
            }}
          >
            Delete
          </MenuItem>
          <MenuItem 
            onClick={() => handleClickOpen(surveyId)}
            sx={{ 
              py: 1.5,
              px: 2.5,
              '&:hover': {
                bgcolor: 'primary.50',
                color: 'primary.main'
              }
            }}
          >
            Export to Excel
          </MenuItem>
        </Menu>
      </Container>
      <Dialog open={deleteOpen} onClose={handleClose}>
                        <DialogTitle>{"Are you sure you want to delete this survey?"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            If you delete this survey, all data including participant responses will be lost.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button
  onClick={() => {
    const confirmed = window.confirm("Are you sure you want to delete this survey?");
    if (confirmed) {
      handleDeleteSurvey(surveyId);
    }
  }}
  color="error"
>
  {isloading? <CircularProgress color='error' /> :"Delete"}

</Button>
                          <Button onClick={handleClose} variant="contained">
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <Dialog open={open} onClose={handleClose}>
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
    </Box>
  );
}

export default MySurvey;
