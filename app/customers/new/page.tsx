import React from "react";
import RegisterForm from "@/app/components/customer/CustomerCreateForm";

const page = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%]">
        {/* <h3 className="mx-auto">Create a new customer</h3> */}
        <RegisterForm />
      </div>
    </div>
  );
};

export default page;
