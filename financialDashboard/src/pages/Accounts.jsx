import axios from "axios";
import { useEffect } from "react";
import { useState } from "react"
const API_URL = import.meta.env.VITE_API_URL;

const Accounts = (userId) => {
    //console.log(userId);
    const [loading,setLoading] = useState(true);
    const [accounts,setAccounts] = useState(null);
    useEffect(()=>{
        const accountsData = getAccountsData();
    },[])
    const getAccountsData = async () => {
        const accountsData = await axios.post(`${API_URL}/api/getAccounts`,{userid:userId.userId});
        try{
            if(accountsData.status === 200){
                setAccounts(accountsData.data.accounts[0].accounts)
            }
                //console.log(accountsData.data.accounts[0].accounts);
        } catch (err){
            console.log(err);
        }
    }
     useEffect(()=>{
       if(accounts){
         setLoading(false);
        // console.log(accounts);
        }
     },[accounts]);
    if(loading) return <h1>Loading..</h1>
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">
           Accounts
        </h1>

        {accounts?.map((account,index)=>(
          <div
            key={account.accountId}
            className="bg-white rounded-xl shadow-md p-6 mb-4"
          >
            <h2 className="text-xl font-bold">
              {account.name}
            </h2>
            <div className="mt-3 space-y-1">
              <p>Type: {account.type}</p>
              <p>Subtype: {account.subtype}</p>
              <p>Mask: {account.mask}</p>

              <p>
               <strong>Current Balance:</strong>
               {" "}
               {account.balances?.current}
               {" "}
               {account.balances?.currency}
             </p>
            

            <p>
              <strong>Available Balance:</strong>
              {" "}
              {account.balances?.available}
              {" "}
              {account.balances?.currency}
            </p>
        </div>
    </div>    
    ))}
  </div>
)
}

export default Accounts
