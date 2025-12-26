"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// #region Sample data
const data = [
  {
    month: "January",
    uv: 4000,
    amount: 2400,
  },
  {
    month: "February",
    uv: 3000,
    amount: 2210,
  },
  {
    month: "March",
    uv: 2000,
    amount: 2290,
  },
  {
    month: "April",
    uv: 2780,
    amount: 2000,
  },
  {
    month: "May",
    uv: 1890,
    amount: 2181,
  },
  {
    month: "June",
    uv: 2390,
    amount: 4000,
  },
  {
    month: "July",
    uv: 3490,
    amount: 2100,
  },
];

// #endregion
const MonthlyPurchases = () => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="6 6" />
          <XAxis dataKey="month" />
          <YAxis dataKey="amount" />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#5a86e9" fill="#61a6fa" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyPurchases;
