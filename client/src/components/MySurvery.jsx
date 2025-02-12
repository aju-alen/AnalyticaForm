import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CssBaseline from '@mui/material/CssBaseline';
import excelIcon from '../assets/icons/excel.svg';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { backendUrl } from '../utils/backendUrl';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export function MySurvey({ userSurveyData, isSubscribed, onDeleteSurvey,handleDataChanged }) {
  console.log(userSurveyData,'--userSurveyData--');
  
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [surveyId, setSurveyId] = React.useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);



  const handleChangeSelect = async(event,surveyId) => {
    const updateSurveyStatus = await axiosWithAuth.put(`${backendUrl}/api/survey/update-survey-status/${surveyId}`,{surveyStatus:event.target.value});
    
    console.log(event.target.value);
    handleDataChanged(prev=>!prev);
    
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
      await refreshToken();
      const deleteSurvey = await axiosWithAuth.delete(`${backendUrl}/api/survey/delete-survey/${surveyId}`);
      console.log('delete survey', deleteSurvey);
      setDeleteOpen(false);
      onDeleteSurvey(surveyId);
    } catch (err) {
      if (err.response.status === 401) {
        console.log('unauthorized');
        localStorage.removeItem('userAccessToken');
        navigate('/login');
      } else {
        console.log(err);
      }
    }
  };

  const handleConvertToExcelAnswer = async (surveyId) => {
    console.log(surveyId);
    try {
      await refreshToken();
      const getAllUserResponse = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-user-response/${surveyId}/${isSubscribed}`);
      console.log(getAllUserResponse.data,'--getAllUserResponse--asjhdajhsbd');
      if (getAllUserResponse.data.length === 0) {
        alert('No response available for this survey');
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
    } catch (err) {
      if (err.response.status === 401) {
        console.log('unauthorized');
        localStorage.removeItem('userAccessToken');
        navigate('/login');
      } else {
        console.log(err);
      }
    }
  };
  const handleConvertToExcelIndex = async (surveyId) => {
    console.log(surveyId);
    try {
      await refreshToken();
      const getAllUserResponse = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-user-response/${surveyId}/${isSubscribed}`);
      console.log(getAllUserResponse.data,'--getAllUserResponse--');
      if (getAllUserResponse.data.length === 0) {
        alert('No response available for this survey');
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
    } catch (err) {
      if (err.response.status === 401) {
        console.log('unauthorized');
        localStorage.removeItem('userAccessToken');
        navigate('/login');
      } else {
        console.log(err);
      }
    }
  };

  return (
    <Box component="section" sx={{ p: { md: 10 }, pt: { xs: 10 } }}>
      <Container maxWidth="lg">
        <CssBaseline />
        <Box sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 700 }} aria-label="survey table">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Survey Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Modified At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Response</TableCell>
                  
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userSurveyData.map((survey) => (
                  <TableRow
                    key={survey.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <TableCell align="center">
                      <Link to={`/dashboard/create-survey/${survey.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="text" color="primary">
                          {survey.surveyTitle}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell align="center">{dayjs(survey.createdAt).fromNow()}</TableCell>
                    <TableCell align="center">{dayjs(survey.updatedAt).fromNow()}</TableCell>
                    <TableCell align="center">
                    <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={survey.surveyStatus}
          label="Age"
          onChange={(event)=>handleChangeSelect(event,survey.id)}
          variant='standard'
        >
          <MenuItem value={'Active'}>Active</MenuItem>
          <MenuItem value={'Disable'}>Disable</MenuItem>
          <MenuItem value={'Draft'}>Draft</MenuItem>
        </Select>
                    </TableCell>
                    <TableCell align="center">{survey.surveyResponses}</TableCell>

             

                    <TableCell align="center">
                    <Button
        id="basic-button"
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        onClick={(event)=>handleClickMenu(event,survey.id)}
      >
        <MoreVertIcon color='warning' />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleDeleteOpen(surveyId)}>Delete</MenuItem>
        <MenuItem onClick={() => handleClickOpen(surveyId)}>Export to Excel</MenuItem>
      </Menu>
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
  Delete
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
                            Display as Answers
                          </Button>
                          <Button onClick={() => handleConvertToExcelIndex(surveyId)} color="primary">
                            Display as Index
                          </Button>
                          <Button onClick={handleClose} color="secondary">
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
}

export default MySurvey;
