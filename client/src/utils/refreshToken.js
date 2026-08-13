import { axiosWithCredentials } from "./customAxios";
import { backendUrl } from "./backendUrl";
import { jwtDecode } from 'jwt-decode';
import { getUserAccess, setUserAccess } from './userAccess';

export const refreshToken = async () => {
    const user = getUserAccess();
    if (!user?.accessToken) return;

    let expiresAt;
    try {
        expiresAt = jwtDecode(user.accessToken).exp;
    } catch {
        return;
    }
    if (!expiresAt || Date.now() < expiresAt * 1000) return;

    const resp = await axiosWithCredentials.get(`${backendUrl}/api/auth/refresh`);
    setUserAccess({
        ...user,
        email: resp.data.email,
        id: resp.data.id,
        firstName: resp.data.firstName,
        isAdmin: resp.data.isAdmin,
        isSuperAdmin: resp.data.isSuperAdmin ?? user.isSuperAdmin,
        accessToken: resp.data.accessToken,
    });
}
