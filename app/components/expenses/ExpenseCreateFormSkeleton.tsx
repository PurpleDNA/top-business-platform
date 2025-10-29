import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ExpenseCreateFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 items-center my-5">
      {/* Expense Description Field */}
      <div className="w-full">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Amount Field */}
      <div className="w-full">
        <Skeleton className="h-4 w-16 mb-1" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Production Dropdown */}
      <div className="w-full">
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-3 w-24 mt-1" />
      </div>

      {/* Submit Button */}
      <Skeleton className="h-10 w-24" />
    </div>
  );
};
