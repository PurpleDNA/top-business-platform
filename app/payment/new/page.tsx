import React from "react";
import PaymentCreateForm from "@/app/components/payments/PaymentCreateForm";
import { fetchCustomerById } from "@/app/services/customers";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const page = async ({ searchParams }: Props) => {
  const searchQuery = await searchParams;
  const customer_id = searchQuery.customer_id;

  let customer;
  if (customer_id) {
    customer = await fetchCustomerById(customer_id);
  }
  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%] ">
        <h1 className="font-semibold text-2xl text-center font-bungee mb-10">
          Create New Payment
        </h1>
        <PaymentCreateForm customer={customer} />
      </div>
    </div>
  );
};

export default page;
