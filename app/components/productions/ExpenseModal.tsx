"use client";

import { createExpense } from "@/app/services/expenses";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, X } from "lucide-react";
import z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const validate = z.object({
  production_id: z.string().min(1, "Production ID is required"),
  expense: z.string().min(1, "Expense description is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
});

interface ExpenseModalProps {
  productionId: string;
}

export const ExpenseModal = ({ productionId }: ExpenseModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payload, setPayload] = useState({
    expense: "",
    amount: "",
  });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isLoading) return;

    const values = {
      production_id: productionId,
      expense: payload.expense,
      amount: payload.amount,
    };

    setErrors({});
    setIsLoading(true);

    try {
      await validate.parseAsync(values);
      const response = await createExpense({
        production_id: productionId,
        expense: payload.expense,
        amount: Number(payload.amount),
      });

      if (response.status === "SUCCESS") {
        toast.success("Expense has been created successfully");
        // Reset form
        setPayload({
          expense: "",
          amount: "",
        });
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast.error("Validation error, check your input");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-400 text-neutral-900">
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Expense
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="w-full">
            <label htmlFor="expense" className="text-sm font-medium">
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
            <label htmlFor="amount" className="text-sm font-medium">
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

          <div className="flex gap-2 justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Creating
                  <LoaderCircle size={15} className="animate-spin ml-2" />
                </>
              ) : (
                "Create Expense"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
