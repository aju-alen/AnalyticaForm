import React, { useEffect } from 'react'
import axios from 'axios';
import { backendUrl } from '../utils/backendUrl';
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { axiosNoHeaders,axiosWithCredentials,axiosWithAuth } from '../utils/customAxios';


const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const getTest = async () => {
            try{
                const accessToken = JSON.parse(localStorage.getItem('analyuser')).token
                const decoded = jwtDecode(accessToken).exp;
                console.log(decoded);
                if(Date.now() >= decoded * 1000) {
                    console.log('accessToken expired')
                    const resp = await axiosWithCredentials.get(`${backendUrl}/api/auth/refresh`);
                    console.log(resp.data,'resp data for refresh');
                    localStorage.setItem('analyuser', JSON.stringify({email: resp.data.email, id: resp.data.id, firstName: resp.data.firstName, isAdmin: resp.data.isAdmin, token: resp.data.accessToken}));
                }
                const testResp = await axiosWithAuth.get(`${backendUrl}/api/auth/test`);
            }
            catch(err){
                if(err.response.status === 401){
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