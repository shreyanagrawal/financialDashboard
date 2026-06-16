import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: API_URL,
});
export const fetchWithAuth = async(accessToken,setAccessToken,navigate)=>{
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
        if(!res.data.authenticated){
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
        return res.data;
    } catch(error){
        if(error.response?.status === 401){
            navigate("/");
            return false;
        }
    }
};
export const getAccountsData = async(userId)=>{
    try {
        const accountsData = await axios.post(`${API_URL}/api/getAccounts`,{ userid: userId});
        if (accountsData.status === 200) {
            return accountsData.data.accounts;
        }
    } catch (err) {
        console.log(err);
    }
}
export const getTransactionsData = async(userId)=>{
    try {
        const transactionsData = await axios.post(`${API_URL}/api/getTransactions`,{ userid: userId});
        if (transactionsData.status === 200) {
            return transactionsData.data.transactions;
        }
    } catch (err) {
        console.log(err);
    }
}
export const createLinkToken = async()=>{
    const response = await axios.post(`${API_URL}/api/create-link-token`,{},
        {
          withCredentials: true
        }
    );
    return response;
}
export const createUpdateModeLinkToken = async(userId, plaidItemId) => {
    try {
        const response = await axios.post(`${API_URL}/api/link-token/update`,
            {
                userId,
                plaidItemId
            },
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating update mode link token:', error);
        throw error;
    }
}
export const syncAccountsAfterUpdate = async(userId, plaidItemId) => {
    try {
        const response = await axios.post(`${API_URL}/api/sync-accounts`,
            {
                userId,
                plaidItemId
            },
            {
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error syncing accounts:', error);
        throw error;
    }
}
export const logoutUser = async()=>{
    const deleted = await axios.delete(`${API_URL}/api/refresh`,
        {
            withCredentials: true
        }
    );
    return deleted
}
export const fetchPlaidData = async(publicToken, userId)=>{
    if(publicToken !== ''){
        const resData = await axios.post(`${API_URL}/api/exchange_public_token`,{public_token:publicToken, user_id : userId},{
            withCredentials:true
        });
        return resData
    }
}
export const updateLinking = async(accountId, userId, isLinked)=>{
    if(accountId !== '' && userId !== ''){
        const AccountData = await axios.post(`${API_URL}/api/updateAccountsLink`,{accountId:accountId, userId:userId, isLinked: isLinked});
        if(AccountData.status === 200)
            return AccountData.status
    }
}
export const submitBuget = async(formData, userId)=>{
    if(formData !== '' && userId !== ''){
        const handleBudget = await axios.post(`${API_URL}/api/addBudget`,{formData: formData, userId: userId});
        if(handleBudget.status === 200)
            return handleBudget.data;
    }
}

export const getBudgets = async(userId)=>{
    if(userId){
        const budgets = await axios.post(`${API_URL}/api/getBudget`, {userId: userId});
        if(budgets.status === 200)
            return budgets.data.data.flatMap(item => item.budgets);
    } 
}