import React from "react";
import CustomerCreateForm from "@/app/components/customer/CustomerCreateForm";

const page = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%] ">
        <h1 className="font-semibold text-2xl text-center font-bungee mb-10">
          Create New Customer 🦸
        </h1>
        <CustomerCreateForm />
      </div>
    </div>
  );
};

export default page;
