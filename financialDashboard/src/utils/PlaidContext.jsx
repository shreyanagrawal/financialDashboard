import { createContext } from "react";

export const PlaidContext = createContext({
    accounts:[],
    setAccounts:()=>{},
    transactions:[],
    setTransactions:()=>{},
    isDataAvailable:false,
    setisDataAvailable:()=>{}
})