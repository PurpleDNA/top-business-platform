import { Suspense } from "react";
import ExpenseCreateForm from "@/app/components/expenses/ExpenseCreateForm";
import { ExpenseCreateFormSkeleton } from "@/app/components/expenses/ExpenseCreateFormSkeleton";

const page = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-[95%] lg:w-[40%]">
        <h1 className="font-semibold text-2xl text-center font-bungee mb-10">
          Create New Expense 💰
        </h1>
        <Suspense fallback={<ExpenseCreateFormSkeleton />}>
          <ExpenseCreateForm />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
