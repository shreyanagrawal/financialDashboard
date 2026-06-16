import React from 'react'
import { useLocation } from "react-router-dom";

const EditBudget = () => {
    const location = useLocation();
    const { userId, budgets } = location.state || {};
    console.log(budgets);
    return (
        <div>
            
        </div>
    )
}

export default EditBudget
