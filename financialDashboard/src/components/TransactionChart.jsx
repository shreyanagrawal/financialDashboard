import React from 'react'
import {PieChart, Pie, Cell, ResponsiveContainer} from "recharts";
const TransactionChart = ({transactions}) => {
  const generateColor = () => {
    return `hsl(${Math.random() * 360}, 70%, 60%)`;
  };
  const categoryTotals = transactions.reduce((spend, tx) => {
    const category = tx.name.split("*//")[0] || "Other";
    const amount = Math.abs(Number(tx.amount));
    spend[category] = (spend[category] || 0) + amount;
  return spend;
  }, {});

  const totalAmount = Object.values(categoryTotals).reduce((sum, val) => sum + val,  0 );
  const chartData = Object.entries(categoryTotals).map(
    ([name, value]) => ({
        name,
        value,
        percentage: Number(
          ((value / totalAmount) * 100).toFixed(1)
        ),
        color: generateColor(),
      })
  );

  return (
    <div className="bg-white rounded-2xl shadow-md pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between px-8 py-4 border-b border-slate-600 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-tr-2xl rounded-tl-2xl">
        <h2 className="text-white text-sm">Recent Transactions</h2>
      </div>
      <div className="flex flex-col items-center gap-0">
        <div className="w-[250px] h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 w-full space-y-1 px-8">
          {chartData.map((item, index) => (
            <div key={index} className="flex">
              <div style={{"width":"100%"}}>
                <span className="text-gray-300 text-sm" style={{color: item.color}}>{item.name}</span>
                <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width: `${item.percentage}%`, backgroundColor: item.color}}/>
                </div>
              </div>
              <span className="w-12 text-right text-gray-900 text-sm block" style={{"paddingTop": "15px"}}>{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default TransactionChart
