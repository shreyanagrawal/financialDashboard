import axios from "axios";
import { useEffect } from "react";
import { useState } from "react"
const API_URL = import.meta.env.VITE_API_URL;

const Accounts = (userId) => {
    console.log(userId);
    const [loading,setLoading] = useState(true);
    const [accounts,setAccounts] = useState(null);
    useEffect(()=>{
        const accountsData = getAccountsData();
    },[])
    const getAccountsData = async () => {
        const accountsData = await axios.post(`${API_URL}/api/getAccounts`,{userid:userId.userId});
        try{
            if(accountsData.status === 200){}
                setAccounts(accountsData.data.accounts[0].accounts)
        } catch (err){
            console.log(err);
        }
    }
    useEffect(()=>{
        setLoading(false);
        console.log(accounts)
    },[accounts]);
    if(loading) return <h1>Loading..</h1>
    return (
        <div>
            Accounts
        </div>
    )
}

export default Accounts
