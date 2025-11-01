import React, { Suspense } from "react";
import PaymentCreateForm from "@/app/components/payments/PaymentCreateForm";
import { fetchCustomerById } from "@/app/services/customers";
import { getLatestProduction, Production } from "@/app/services/productions";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const page = async ({ searchParams }: Props) => {
  const searchQuery = await searchParams;
  const customer_id = searchQuery.customer_id;
  const latestProd = await getLatestProduction();

  let customer;
  if (customer_id) {
    customer = await fetchCustomerById(customer_id);
  }

  const latestProdItem =
    Array.isArray(latestProd) && latestProd.length > 0
      ? latestProd[0]
      : undefined;

  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%] ">
        <h1 className="font-semibold text-2xl text-center font-bungee mb-10">
          Create New Payment
        </h1>
        <Suspense>
          <PaymentCreateForm customer={customer} latestProd={latestProdItem} />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
