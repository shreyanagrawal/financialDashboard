import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

const AnalyticsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 120
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="category"
          angle={-45}
          textAnchor="end"
          interval={0}
          height={120}
        />

        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`}/>

        <Tooltip
          formatter={(value) =>
            `$${Number(value).toLocaleString()}`
          }
        />

        <Legend />

        <Line
          type="monotone"
          dataKey="income"
          stroke="#22c55e"
          strokeWidth={3}
          name="Income"
        />

        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          strokeWidth={3}
          name="Expense"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;