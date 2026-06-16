import React from 'react'
import { useState } from 'react'
import { PlaidContext } from '../utils/PlaidContext';
import Nav from './Nav';
import { Outlet } from 'react-router-dom';

const PlaidRoute = () => {
    const [isDataAvailable, setisDataAvailable] = useState(false);
    const [accounts,setAccounts] = useState([]);
    const [transactions,setTransactions] = useState([]);
  return (
    <PlaidContext.Provider value={{isDataAvailable, setisDataAvailable, accounts, setAccounts, transactions, setTransactions}}>
        <Nav />
    </PlaidContext.Provider>
  )
}
export default PlaidRoute
