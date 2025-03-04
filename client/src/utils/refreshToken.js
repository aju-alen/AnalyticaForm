import { axiosWithCredentials } from "./customAxios";
import { backendUrl } from "./backendUrl";
import {jwtDecode} from 'jwt-decode';
//function to refresh accesstoken if expired 

export const refreshToken = async () => {
    const accessToken = JSON.parse(localStorage.getItem('dubaiAnalytica-userAccess')).accessToken;
    const decoded = jwtDecode(accessToken).exp;
    // console.log(decoded);
    if(Date.now() >= decoded * 1000) {
        console.log('accessToken expired')
        const resp = await axiosWithCredentials.get(`${backendUrl}/api/auth/refresh`);
        // console.log(resp.data,'resp data for refresh');
        localStorage.setItem('dubaiAnalytica-userAccess', JSON.stringify({email: resp.data.email, id: resp.data.id, firstName: resp.data.firstName, isAdmin: resp.data.isAdmin, accessToken: resp.data.accessToken}));
    }
    return;
}