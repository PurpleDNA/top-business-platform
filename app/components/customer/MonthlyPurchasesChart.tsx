"use client";

import React from "react";
import CartesianGrid from "@/app/components/production/CartesianGrid";
import PurchasesPieChart from "./PurchasesPieChart";

interface MonthlyPurchasesChartProps {
  data: {
    month: string;
    uv: number;
    amount: number;
  }[];
}

const MonthlyPurchasesChart = ({ data }: MonthlyPurchasesChartProps) => {
  return (
    <>
      {/* Desktop View: Area Chart */}
      <div className="hidden lg:block h-full">
        <CartesianGrid data={data} />
      </div>

      {/* Mobile View: Pie Chart */}
      <div className="block lg:hidden h-full">
        <PurchasesPieChart data={data} />
      </div>
    </>
  );
};

export default MonthlyPurchasesChart;
