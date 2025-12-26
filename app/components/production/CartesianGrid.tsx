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

interface MonthlyPurchasesProps {
  data: {
    month: string;
    uv: number;
    amount: number;
  }[];
}

const MonthlyPurchases = ({ data }: MonthlyPurchasesProps) => {
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
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#5a86e9"
            fill="#61a6fa"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyPurchases;
