import  { useEffect } from 'react'
import { backendUrl } from '../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import { axiosWithAuth } from '../utils/customAxios';
import { refreshToken } from '../utils/refreshToken';


const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const getTest = async () => {
            try{
               await refreshToken();
                const testResp = await axiosWithAuth.get(`${backendUrl}/api/auth/test`);
                console.log(testResp.data);
            }
            catch(err){
                if(err.response.status === 401){
                    console.log('unauthorized');
                    localStorage.removeItem('userAccessToken');
                    navigate('/login');
                }
                else{
                    console.log(err);

                }
            }
           

        }
        getTest();
    }, [])
   
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard