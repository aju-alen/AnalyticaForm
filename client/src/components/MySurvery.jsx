import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';



export function MySurvery() {
  return (
    <Box component="section" sx={{ p: { md: 10 }, pt: { xs: 10 } }}>
      <Container maxWidth="lg">
        <CssBaseline />
        <Box sx={{ boxShadow: 3 }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Survey Name</TableCell>
                  <TableCell align="center">Created At</TableCell>
                  <TableCell align="center">Modified At</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">test</TableCell>
                  <TableCell align="center">test</TableCell>
                  <TableCell align="center">test</TableCell>
                  <TableCell align="center">test</TableCell>
                  <TableCell align="center">test</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Box>
  );
}
export default MySurvery;
