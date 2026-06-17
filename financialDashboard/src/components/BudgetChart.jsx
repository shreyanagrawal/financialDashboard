import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
const BudgetChart = ({chart}) => {
    const chartData = chart
    return (
        <>
            {chartData.length > 0  && 
                <div className="w-full h-96 bg-white rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="expected" name="Budget Limit" fill="#3b82f6"/>
                            <Bar dataKey="actual" name="Actual Spending" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            }
        </>
    )
}

export default BudgetChart
