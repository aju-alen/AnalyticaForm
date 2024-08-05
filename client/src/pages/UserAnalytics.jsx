import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Container, Typography } from '@mui/material';
import { refreshToken } from '../utils/refreshToken';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../utils/theme';
import { BarChart } from '@mui/x-charts/BarChart';




function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;


  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}





export default function UserAnalytics() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customerData, setCustomerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const getAnalyticsData = async () => {
      try {
        await refreshToken();
        const userId = JSON.parse(localStorage.getItem('userAccessToken')).id;
        console.log(userId, 'userId');
        const getAllUserData = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-sruvey-from-oneuser/${userId}`);
        setCustomerData(getAllUserData.data);
        setIsLoading(false);
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
    getAnalyticsData();
  }, []);



  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - customerData.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log(customerData, 'customerData');
  return (
    <ThemeProvider theme={theme}>
       {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", height: '100vh' }}>
                <CircularProgress />
            </Box>
        ) : (
      <Box sx={{ mt: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            User Analytics
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <TableHead>
                <TableRow>
                  <TableCell>Survey Name</TableCell>
                  <TableCell align="right">Created Date</TableCell>
                  <TableCell align="right">Survey Responses</TableCell>
                  <TableCell align="right">Survey Introduction</TableCell>
                  <TableCell align="right">Last Updated</TableCell>
                  <TableCell align="right">Users Viewed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? customerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : customerData
                ).map((row) => (
                  <TableRow key={row.id}>
                    <Button onClick={() => navigate(`/user-survey-analytics/${row.id}`)} >
                      <TableCell component="th" scope="row">
                        {row.surveyTitle}
                      </TableCell>
                    </Button>
                    <TableCell style={{ width: 160 }} align="right">
                      {row.createdAt}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {row.surveyResponses}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {row.surveyIntroduction?.length > 0 ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {row.updatedAt}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {row.surveyViews}
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={customerData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    slotProps={{
                      select: {
                        inputProps: {
                          'aria-label': 'rows per page',
                        },
                        native: true,
                      },
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <Typography variant="h4" align="center" color="primary" gutterBottom sx={{
            mt: 3
          }}>
            Chart Analytics
          </Typography>

          <Container component={Paper} >
            <Stack direction='row'>
              <Stack>
                <Typography variant="h6" align="center" color="primary" gutterBottom>
                  Survey Responses
                </Typography>
                <BarChart
                  xAxis={[{ scaleType: 'band', data: customerData.map((data) => data.surveyTitle) }]}
                  series={[{ data: customerData.map((data) => data.surveyResponses) }]}
                  width={300}
                  height={200}
                />
              </Stack>
              <Stack>
                <Typography variant="h6" align="center" color="primary" gutterBottom>
                  Survey Viewed
                </Typography>
                <BarChart
                  xAxis={[{ scaleType: 'band', data: customerData.map((data) => data.surveyTitle) }]}
                  series={[{ data: customerData.map((data) => data.surveyViews) }]}
                  width={300}
                  height={200}
                />
              </Stack>
              <Stack>
                <Typography variant="h6" align="center" color="primary" gutterBottom>
                  Survey Completed
                </Typography>
                <BarChart
                  xAxis={[{ scaleType: 'band', data: customerData.map((data) => data.surveyTitle) }]}
                  series={[{ data: customerData.map((data) => data.surveyCompleted) }]}
                  width={300}
                  height={200}
                />
              </Stack>
            </Stack>

          </Container>
        </Container>
      </Box>)}
    </ThemeProvider>
  );
}
