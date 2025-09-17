import React from "react";
import SalesCreateForm from "@/app/components/sales/SalesCreateForm";
import { getLast10Productions } from "@/app/services/productions";
import { fetchCustomerById } from "@/app/services/customers";
import { unstable_cache } from "next/cache";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const page = async ({ searchParams }: Props) => {
  const searchQuery = await searchParams;
  const customer_id = searchQuery.customer_id;
  const production_id = searchQuery.production_id;
  const getProductions = unstable_cache(
    async () => {
      return getLast10Productions();
    },
    [],
    {
      tags: ["last10"],
    }
  );

  const productions = await getProductions();
  const customer = await fetchCustomerById(customer_id || "");

  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%] ">
        <h1 className="font-semibold text-2xl text-center font-bungee mb-10">
          Create New Sale🍞
        </h1>
        <SalesCreateForm
          productions={productions ?? undefined}
          customer={customer}
          production_id={production_id}
        />
      </div>
    </div>
  );
};

export default page;
