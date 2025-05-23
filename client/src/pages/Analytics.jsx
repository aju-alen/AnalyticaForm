import  React,{useEffect,useState} from 'react';
import PropTypes from 'prop-types';
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
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Button, Container } from '@mui/material';
import { refreshToken } from '../utils/refreshToken';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';



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



function createData(name, calories, fat) {
  return { name, calories, fat };
}


export default function Analytics() {
    const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [customerData, setCustomerData] = useState([]);


  useEffect(() => {
   const getAnalyticsData = async () => {
    try{
        await refreshToken();
        const getAllUserData = await axiosWithAuth.get(`${backendUrl}/api/superadmin-data/get-user-data`);
        setCustomerData(getAllUserData.data);


    }
    catch(err){
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

  console.log(customerData, 'customerData');
  

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

  return (
    <Box sx={{ mt: 3 }}>
    <Container maxWidth="lg">
      <TableContainer 
        component={Paper} 
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Table 
          sx={{ 
            minWidth: { xs: 300, sm: 500 },
          }} 
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">User Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Survey Title</TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  display: { xs: 'none', md: 'table-cell' } 
                }} 
                align="right"
              >
                Is Premium Member
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  display: { xs: 'none', md: 'table-cell' } 
                }} 
                align="right"
              >
                Receive Marketing
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'table-cell' } 
                }} 
                align="right"
              >
                Surveys Created
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'table-cell' } 
                }} 
                align="right"
              >
                Total Responses
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  display: { xs: 'none', sm: 'table-cell' } 
                }} 
                align="right"
              >
                Total Views
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? customerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : customerData
            ).map((row) => (
              <TableRow 
                key={row.id}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  {row.firstName}
                </TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">
                  {row.surveys.map((survey) => (
                    <Button 
                      key={survey.id} 
                      onClick={() => navigate(`/admin-analytics/${survey.id}`)}
                      variant="contained"
                      size="small"
                      sx={{ m: 0.5 }}
                    >
                      {survey.surveyTitle}
                    </Button>
                  ))}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                >
                  {row.isAProMember ? 'Yes' : 'No'}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ display: { xs: 'none', md: 'table-cell' } }}
                >
                  {row.receiveMarketingEmails ? 'Yes' : 'No'}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                >
                  {row.surveys.length}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                >
                  {row.surveys.reduce((acc, survey) => acc + survey.surveyResponses, 0)}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ display: { xs: 'none', sm: 'table-cell' } }}
                >
                  {row.surveys.reduce((acc, survey) => acc + survey.surveyViews, 0)}
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={8} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={8}
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
    </Container>
  </Box>
  );
}
