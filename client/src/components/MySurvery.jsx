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





export function MySurvery({ userSurveyData,isSubscribed }) {
  const navigate = useNavigate();
  dayjs.extend(relativeTime);
console.log('isSubscribed',isSubscribed);

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
    try{
      await refreshToken();
      const deleteSurvey = await axiosWithAuth.delete(`${backendUrl}/api/survey/delete-survey/${surveyId}`);
      console.log('delete survey', deleteSurvey);
      setDeleteOpen(false);


    }
    catch{
      if (err.response.status === 401) {
        console.log('unauthorized');
        localStorage.removeItem('userAccessToken');
        navigate('/login');
      }
      else {
        console.log(err);

    }
  }
}


  const handleConvertToExcelAnswer = async (surveyId) => {
    console.log(surveyId);
    try {
      await refreshToken();
      console.log('isSubscribed',isSubscribed);
      
      const getAllUserResponse = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-user-response/${surveyId}/${isSubscribed}`);
      console.log(getAllUserResponse.data, 'response in export excel');

      if (getAllUserResponse.data.length === 0) {
        alert('No response available for this survey');
        return;
      }
      const response = await axiosWithAuth.post(`${backendUrl}/api/excel/export-to-excel`, getAllUserResponse.data, {
        responseType: 'blob' // Ensure response type is blob
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'UserResponse.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }
    catch (err) {
      if (err.response.status === 401) {
        console.log('unauthorized');
        localStorage.removeItem('userAccessToken');
        navigate('/login');
      }
      else {
        console.log(err);

      }
    }


  }

  const handleConvertToExcelIndex = async (surveyId) => {
    try {
      await refreshToken();
      const getAllUserResponse = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-user-response/${surveyId}`);
      console.log(getAllUserResponse.data, 'response in export excel');

      if (getAllUserResponse.data.length === 0) {
        alert('No response available for this survey');
        return;
      }
      const response = await axiosWithAuth.post(`${backendUrl}/api/excel/export-to-excel-index`, getAllUserResponse.data, {
        responseType: 'blob' // Ensure response type is blob
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'UserResponse.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }
    catch (err) {
      if (err.response.status === 401) {
        console.log('unauthorized');
        localStorage.removeItem('userAccessToken');
        navigate('/login');
      }
      else {
        console.log(err);

      }
    }

  }
  return (
    <Box component="section" sx={{ p: { md: 10 }, pt: { xs: 10 } }} >
      <Container maxWidth="lg">
        <CssBaseline />
        <Box sx={{ boxShadow: 3 }} >
          <TableContainer component={Paper} >
            <Table sx={{ minWidth: 650 }} aria-label="simple table" >
              <TableHead >
                <TableRow>
                  <TableCell align="center">Survey Name</TableCell>
                  <TableCell align="center">Created At</TableCell>
                  <TableCell align="center">Modified At</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Response</TableCell>
                  <TableCell align="center">Export to Excel</TableCell>
                  <TableCell align="center">Delete Survey</TableCell>
                  {/* <TableCell align="center">Export to Excel(Display answers)</TableCell>
                  <TableCell align="center">Export to Excel(Display Index)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {userSurveyData.map((survey) => (
                  <TableRow
                    key={survey.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Link to={`/dashboard/create-survey/${survey.id}`}>
                        <Button
                          variant='text'
                          color="primary"
                        >
                          {survey.surveyTitle}
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell align="center">{dayjs(survey.createdAt).fromNow()}</TableCell>
                    <TableCell align="center">{dayjs(survey.updatedAt).fromNow()}</TableCell>
                    <TableCell align="center">{survey.surveyStatus}</TableCell>
                    <TableCell align="center">{survey.surveyResponses}</TableCell>

                    <TableCell align="center">
                      <Button variant="" onClick={() => handleClickOpen(survey.id)}>
                        <img src={excelIcon} alt="excel icon" className='cursor-pointer' />
                      </Button>

                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"You can download the user response"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText
                          >
                            Display as Answers- This will display the user response in the excel sheet as answers.
                          </DialogContentText>
                          {/* <DialogContentText>
                            Display as Index- This will display the user response in the excel sheet as index.
                          </DialogContentText> */}
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => handleConvertToExcelAnswer(surveyId)}>Display as Answers</Button>
                          {/* <Button onClick={() => handleConvertToExcelIndex(surveyId)} autoFocus>
                            Display as Index
                          </Button> */}
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                    <TableCell align="center">
                      <Button variant="" onClick={() => handleDeleteOpen(survey.id)}>
                        <HighlightOffIcon color='error' />
                      </Button>

                      <Dialog
                        open={deleteOpen}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Are you sure you want to delete this survey?"}
                        </DialogTitle>
                        <DialogContent>
                          
                          <DialogContentText>
                            If you continue, you will not only loose your survey but also the responses from the participants.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => handleDeleteSurvey(surveyId)}>Continue to delete</Button>
                          <Button onClick={handleClose} variant='contained'  autoFocus>
                            Cancel and go back
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>

                    {/* <TableCell align="center">
                      <Button>
                        <img src={excelIcon} alt="excel icon" onClick={() => handleConvertToExcelAnswer(survey.id)} className=' md:ml-16 cursor-pointer' /></Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button>
                        <img src={excelIcon} alt="excel icon" onClick={() => handleConvertToExcelIndex(survey.id)} className=' md:ml-16 cursor-pointer' /></Button>
                    </TableCell> */}
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
export default MySurvery;
