import React from "react";
import ExpenseCreateForm from "@/app/components/expenses/ExpenseCreateForm";
import {
  getLast10Productions,
  getProductionById,
} from "@/app/services/productions";
import { unstable_cache } from "next/cache";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const page = async ({ searchParams }: Props) => {
  const searchQuery = await searchParams;
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

  let production;
  const productions = await getProductions();

  if (production_id) {
    production = await getProductionById(production_id);
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%]">
        <h1 className="font-semibold text-2xl text-center font-bungee mb-10">
          Create New Expense 💰
        </h1>
        <ExpenseCreateForm
          productions={productions ?? undefined}
          production={production}
        />
      </div>
    </div>
  );
};

export default page;
