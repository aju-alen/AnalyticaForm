import { useEffect } from 'react'
import { backendUrl } from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';
import MySurvery from '../components/MySurvery';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';


const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const getTest = async () => {
            try {
                await refreshToken();
                const testResp = await axiosWithAuth.get(`${backendUrl}/api/auth/test`);
                console.log(testResp.data);
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
        getTest();
    }, [])

    return (
        <Box component="section" sx={{ p: { md: 10 }, pt: { xs: 10 } }}>
            <Fab onClick={() => navigate('/create-survey')} variant="extended" size="large" color="primary">
                <AddIcon />
                Create new survey
            </Fab>
            <MySurvery />
        </Box>

    )
}

export default Dashboard