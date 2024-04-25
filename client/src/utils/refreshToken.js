import { jwtDecode } from 'jwt-decode';
import { axiosWithCredentials } from './customAxios';
import { backendUrl } from './backendUrl';

export const refreshTokenIfNeeded = async (accessToken) => {

    
    const decoded = jwtDecode(accessToken).exp;
    console.log(decoded);

    try {
        if (Date.now() >= decoded * 1000) {
            console.log('accessToken expired');
            const resp = await axiosWithCredentials.get(`${backendUrl}/api/auth/refresh`);
            console.log(resp.data, 'resp data for refresh');
            localStorage.setItem('analyuser', JSON.stringify({
                email: resp.data.email,
                id: resp.data.id,
                firstName: resp.data.firstName,
                isAdmin: resp.data.isAdmin,
                token: resp.data.accessToken
            }));
            return true; // Indicate success
        }
    } catch (error) {
        if (error.response.status === 401) {
            localStorage.removeItem('analyuser');
            return false; // Indicate failure
        }
        console.log(error);
    }

};
