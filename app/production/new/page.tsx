import ProductionFrom from "@/app/components/production/ProductionCreateFrom";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%] ">
        <h1 className="font-semibold text-2xl text-center font-bungee mb-10">
          Create New Production🍞
        </h1>
        <ProductionFrom />
      </div>
    </div>
  );
};

export default page;
