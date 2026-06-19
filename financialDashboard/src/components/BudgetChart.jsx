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
                <div className="w-full h-96 rounded-lg p-4 bg-transparent">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20}} barGap={4} barCategoryGap="30%">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB"/>
                            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 13 }} dy={10}/>
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(value) => `$${value}`} dx={-10}/>
                            <Tooltip 
                                cursor={{ fill: '#F3F4F6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`$${Number(value).toFixed(2)}`]}/>
                            <Legend iconType="square" wrapperStyle={{ paddingTop: '20px' }}/>
                            <Bar dataKey="expected" name="Budget Limit" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30}/>
                            <Bar dataKey="actual" name="Actual Spending" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            }
        </>
    )
}

export default BudgetChart
