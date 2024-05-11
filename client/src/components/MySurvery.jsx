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
import Button from '@mui/material/Button';





export function MySurvery({ userSurveyData }) {
  const navigate = useNavigate();

  const handleConvertToExcel = async (surveyId) => {
    console.log(surveyId);
    try {
      await refreshToken();
      const getAllUserResponse = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-user-response/${surveyId}`);
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
                  <TableCell align="center">Import to Excel</TableCell>
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
                        {survey.surveyTitle}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{survey.createdAt}</TableCell>
                    <TableCell align="center">{survey.updatedAt}</TableCell>
                    <TableCell align="center">{survey.surveyStatus}</TableCell>
                    <TableCell align="center">{survey.surveyResponses}</TableCell>
                    <TableCell align="center">
                      <Button>
                        <img src={excelIcon} alt="excel icon" onClick={() => handleConvertToExcel(survey.id)} className=' md:ml-16 cursor-pointer' /></Button>
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
export default MySurvery;
