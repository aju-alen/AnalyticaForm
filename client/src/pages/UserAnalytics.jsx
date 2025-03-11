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
import CountryAnalytics from '../components/CountryAnalytics';




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
  const [analyticsSummary, setAnalyticsSummary] = useState({
    totalResponses: 0,
    totalViews: 0,
    completionRate: 0,
    averageResponseTime: 0
  });


  useEffect(() => {
    const getAnalyticsData = async () => {
      try {
        await refreshToken();
        const userId = JSON.parse(localStorage.getItem('dubaiAnalytica-userAccess')).id;
        console.log(userId, 'userId');
        const getAllUserData = await axiosWithAuth.get(`${backendUrl}/api/survey/get-all-sruvey-from-oneuser/${userId}`);
        setCustomerData(getAllUserData.data);
        
        // Calculate summary statistics
        const summary = {
          totalResponses: getAllUserData.data.reduce((sum, survey) => sum + survey.surveyResponses, 0),
          totalViews: getAllUserData.data.reduce((sum, survey) => sum + survey.surveyViews, 0),
          completionRate: getAllUserData.data.reduce((sum, survey) => sum + (survey.surveyCompleted / survey.surveyViews * 100 || 0), 0) / getAllUserData.data.length,
          averageResponseTime: 0 // Add this from your backend if available
        };
        setAnalyticsSummary(summary);
        setIsLoading(false);
      }
      catch (err) {
        if (err.response.status === 401) {
          console.log('unauthorized');
          localStorage.removeItem('dubaiAnalytica-userAccess');
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
        <Box sx={{ 
          mt: 3, 
          mb: 6, 
          backgroundColor: '#f5f5f5', 
          minHeight: '100vh', 
          pt: 3 
        }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              align="center" 
              color="primary" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                mb: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Analytics Dashboard
            </Typography>

            {/* Summary Cards */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: 3, 
                mt: 3 
              }}>
                {[
                  { 
                    title: 'Total Responses', 
                    value: analyticsSummary.totalResponses,
                    icon: '📊'
                  },
                  { 
                    title: 'Total Views', 
                    value: analyticsSummary.totalViews,
                    icon: '👁️'
                  },
                  // { 
                  //   title: 'Average Completion Rate', 
                  //   value: `${analyticsSummary.completionRate.toFixed(1)}%`,
                  //   icon: '✅'
                  // },
                  { 
                    title: 'Total Surveys', 
                    value: customerData.length,
                    icon: '📝'
                  }
                ].map((item) => (
                  <Paper
                    key={item.title}
                    elevation={3}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #fff 0%, #f7f7f7 100%)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontSize: '2rem', 
                        mb: 1,
                        opacity: 0.8 
                      }}
                    >
                      {item.icon}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      gutterBottom
                      sx={{ fontWeight: 'medium' }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      color="text.primary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {item.value}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Survey Details Table */}
            <Paper 
              elevation={3} 
              sx={{ 
                mb: 4, 
                overflow: 'hidden',
                borderRadius: 2
              }}
            >
              <Box sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, primary.main 0%, primary.dark 100%)',
                color: 'white' 
              }}>
                <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>
                  Survey Details
                </Typography>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                      <TableCell sx={{ 
                        color: 'white', 
                        fontWeight: 'bold',
                        fontSize: '1rem'
                      }}>Survey Name</TableCell>
                      {['Created Date', 'Survey Responses', 'Survey Introduction', 'Last Updated', 'Users Viewed'].map((header) => (
                        <TableCell 
                          key={header}
                          align="right" 
                          sx={{ 
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? customerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : customerData
                    ).map((row, index) => (
                      <TableRow 
                        key={row.id}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                          '&:hover': { 
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            transition: 'background-color 0.2s ease'
                          },
                          cursor: 'pointer'
                        }}
                      >
                        <TableCell 
                          component="th" 
                          scope="row"
                          sx={{
                            color: 'primary.main',
                            fontWeight: 'medium',
                            fontSize: '0.95rem'
                          }}
                        >
                          <Button 
                            onClick={() => navigate(`/user-survey-analytics/${row.id}`)}
                            sx={{
                              textTransform: 'none',
                              textAlign: 'left',
                              '&:hover': {
                                backgroundColor: 'transparent',
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            {row.surveyTitle}
                          </Button>
                        </TableCell>
                        {[
                          row.createdAt,
                          row.surveyResponses,
                          row.surveyIntroduction?.length > 0 ? 'Yes' : 'No',
                          row.updatedAt,
                          row.surveyViews
                        ].map((cell, cellIndex) => (
                          <TableCell 
                            key={cellIndex}
                            align="right"
                            sx={{ 
                              fontSize: '0.95rem',
                              color: 'text.secondary'
                            }}
                          >
                            {cell}
                          </TableCell>
                        ))}
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
                        colSpan={6}
                        count={customerData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        sx={{
                          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                            color: 'text.secondary',
                            fontSize: '0.875rem'
                          }
                        }}
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
            </Paper>

            {/* Analytics Charts */}
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #fff 0%, #f7f7f7 100%)'
              }}
            >
              <Typography 
                variant="h4" 
                align="center" 
                color="primary" 
                gutterBottom
                sx={{ fontWeight: 'bold', mb: 4 }}
              >
                Analytics Overview
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 4,
                mt: 3
              }}>
                {['Survey Responses', 'Survey Viewed', 'Survey Completed'].map((title, index) => (
                  <Paper 
                    key={title}
                    elevation={2}
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      align="center" 
                      color="primary" 
                      gutterBottom
                      sx={{ fontWeight: 'medium' }}
                    >
                      {title}
                    </Typography>
                    <BarChart
                      xAxis={[{ 
                        scaleType: 'band', 
                        data: customerData.map((data) => data.surveyTitle),
                        tickLabelStyle: { 
                          angle: 45, 
                          textAnchor: 'start',
                          fontSize: 12
                        }
                      }]}
                      series={[{ 
                        data: customerData.map((data) => 
                          index === 0 ? data.surveyResponses :
                          index === 1 ? data.surveyViews :
                          data.surveyCompleted
                        ),
                        color: theme.palette.primary.main
                      }]}
                      height={300}
                      margin={{ left: 40, right: 40, top: 20, bottom: 60 }}
                    />
                  </Paper>
                ))}
              </Box>
            </Paper>
          </Container>
        </Box>
      )}
    </ThemeProvider>
  );
}
