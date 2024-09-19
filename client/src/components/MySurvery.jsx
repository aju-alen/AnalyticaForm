import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
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

export function MySurvey({ userSurveyData, isSubscribed }) {
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  const [open, setOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [surveyId, setSurveyId] = React.useState('');

  const handleClickOpen = (surveyId) => {
    setSurveyId(surveyId);
    setOpen(true);
  };

  const handleDeleteOpen = (surveyId) => {
    setSurveyId(surveyId);
    setDeleteOpen(true);
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
      a.download = 'UserResponse.xlsx';
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
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Export to Excel</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Delete Survey</TableCell>
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
                    <TableCell align="center">{survey.surveyStatus}</TableCell>
                    <TableCell align="center">{survey.surveyResponses}</TableCell>

                    <TableCell align="center">
                      <Button onClick={() => handleClickOpen(survey.id)}>
                        <img src={excelIcon} alt="excel icon" style={{ width: 70 }} />
                      </Button>
                      <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>{"Export User Responses"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Display as Answers - This will show user responses as answers in the Excel sheet.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => handleConvertToExcelAnswer(surveyId)} color="primary">
                            Display as Answers
                          </Button>
                          <Button onClick={handleClose} color="secondary">
                            Cancel
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>

                    <TableCell align="center">
                      <Button onClick={() => handleDeleteOpen(survey.id)}>
                        <HighlightOffIcon color="error" />
                      </Button>
                      <Dialog open={deleteOpen} onClose={handleClose}>
                        <DialogTitle>{"Are you sure you want to delete this survey?"}</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            If you delete this survey, all data including participant responses will be lost.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => handleDeleteSurvey(surveyId)} color="error">
                            Confirm Delete
                          </Button>
                          <Button onClick={handleClose} variant="contained">
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
