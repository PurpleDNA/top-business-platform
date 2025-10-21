"use client";
import { createExpense } from "@/app/services/expenses";
import React, { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import z from "zod";
import { toast } from "sonner";
import { formatDateTime, getTimeFrame } from "@/app/services/utils";
import { Production } from "@/app/services/productions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const validate = z.object({
  production_id: z.string().min(1, "Production ID is required"),
  expense: z.string().min(1, "Expense description is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
});

interface Props {
  productions?: Production[];
  production?: Production;
}

const ExpenseCreateForm = ({ productions, production }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedProduction, setSelectedProduction] = useState<Production | undefined>(
    production ? production : productions && productions[0] ? productions[0] : undefined
  );
  const [payload, setPayload] = useState({
    production_id: selectedProduction?.id || "",
    expense: "",
    amount: "",
  });

  async function handleSubmit(prevState: any, formData: FormData) {
    const values = {
      production_id: payload.production_id,
      expense: formData.get("expense") as string,
      amount: formData.get("amount"),
    };

    setErrors({});

    try {
      await validate.parseAsync(values);
      const response = await createExpense({
        production_id: payload.production_id,
        expense: payload.expense,
        amount: Number(payload.amount),
      });

      if (response.status === "SUCCESS") {
        toast.success("Expense has been created successfully");
        // Reset form after successful submission
        setPayload({
          production_id: selectedProduction?.id || "",
          expense: "",
          amount: "",
        });
        return response;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast.error("Validation error, check your input");
        return { status: "ERROR", error: fieldErrors };
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    status: "",
    error: "",
  });

  return (
    <form action={formAction} className="flex flex-col gap-4 items-center my-5">
      <div className="w-full">
        <label htmlFor="expense" className="text-sm">
          Expense Description
        </label>
        <Input
          type="text"
          placeholder="e.g. Raw materials, Labor, Transport"
          name="expense"
          className="w-full mt-1"
          onChange={(e) => {
            setPayload((prev) => ({
              ...prev,
              expense: e.target.value,
            }));
          }}
          value={payload.expense}
        />
        {errors.expense && (
          <p className="text-red-500 text-xs mt-1">{errors.expense}</p>
        )}
      </div>

      <div className="w-full">
        <label htmlFor="amount" className="text-sm">
          Amount
        </label>
        <Input
          type="number"
          placeholder="Amount"
          name="amount"
          className="w-full mt-1 no-spinners"
          onChange={(e) => {
            setPayload((prev) => ({
              ...prev,
              amount: e.target.value,
            }));
          }}
          value={payload.amount}
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
        )}
      </div>

      <div className="w-full">
        <label className="mb-1 text-sm">Production</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center py-3 px-3 border rounded-md border-primary shadow ring font-semibold cursor-pointer">
              {selectedProduction
                ? formatDateTime(selectedProduction.created_at)
                : "Select Production"}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-32 overflow-y-auto">
            {productions?.map((prod) => (
              <DropdownMenuItem
                key={prod.id}
                onClick={() => {
                  setSelectedProduction(prod);
                  setPayload((prev) => ({
                    ...prev,
                    production_id: prod.id,
                  }));
                }}
              >
                {formatDateTime(prod.created_at)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedProduction && (
          <span className="text-xs text-primary">
            {getTimeFrame(selectedProduction.created_at)}
          </span>
        )}
        {errors.production_id && (
          <p className="text-red-500 text-xs mt-1">{errors.production_id}</p>
        )}
      </div>

      <Button
        className="bg-primary font-bungee cursor-pointer"
        disabled={isPending}
        type="submit"
      >
        Create{isPending && <LoaderCircle size={15} className="animate-spin" />}
      </Button>
    </form>
  );
};

export default ExpenseCreateForm;
