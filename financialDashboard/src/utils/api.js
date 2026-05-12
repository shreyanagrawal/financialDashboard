import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: API_URL,
});
export const fetchWithAuth = async(accessToken,setAccessToken)=>{
    try{
        const res = await axios.get(`${API_URL}/api/profile`,
            {
                headers:{
                Authorization:
                    `Bearer ${accessToken}`
                },
                withCredentials:true
            }
        );
        return res.data;
    } catch(error){
        if(error.response?.status === 401){
            try{
                const refreshRes = await axios.post(`${API_URL}/api/refresh`,{},
                    {
                        withCredentials:true
                    }
                );
                const newAccessToken = refreshRes.data.accessToken;
                setAccessToken(newAccessToken);
                const retryRes = await axios.get(`${API_URL}/api/profile`,
                    {
                        headers:{
                            Authorization:
                            `Bearer ${newAccessToken}`
                        },
                        withCredentials:true
                    }
                );
                return retryRes.data;
            } catch(refreshError){
                throw refreshError;
            }
        }
        throw error;
    }
};