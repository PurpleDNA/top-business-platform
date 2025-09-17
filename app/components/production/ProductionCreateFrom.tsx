/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useActionState, useState } from "react";
import { createProduction } from "@/app/services/productions";
import z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const validateCreate = z.object({
  quantity: z
    .object({
      orange: z.coerce.number(),
      blue: z.coerce.number(),
      green: z.coerce.number(),
    })
    .refine(
      (data) => {
        // Check if at least one property has a truthy (non-NaN, >0) value
        return Object.values(data).some(
          (val) => val !== undefined && val !== 0 && !isNaN(val)
        );
      },
      {
        message: "You must input at least one value",
        path: ["quantity"], // put error at the object level
      }
    ),
  total: z.coerce.number().min(1, "total is required"),
  expenses_total: z.coerce.number().min(1, "Expenses Total is required"),
  outstanding: z.coerce.number().min(1, "Outstanding is required"),
});

const multipliers: Record<string, number> = {
  orange: 1200,
  blue: 1000,
  green: 650,
};

const ProductionFrom = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payload, setPayload] = useState({
    quantity: {
      orange: "",
      blue: "",
      green: "",
    },
    total: "",
    expenses_total: "",
    outstanding: "",
  });

  function handleQuantityChange(name: string, value: string) {
    setPayload((prev) => {
      const updatedQuantity = {
        ...prev.quantity,
        [name]: value,
      };

      // sum all quantities × multipliers
      const total = Object.entries(updatedQuantity).reduce(
        (sum, [key, val]) => {
          const multiplier = multipliers[key] || 0;
          return sum + Number(val || 0) * multiplier;
        },
        0
      );

      return {
        ...prev,
        quantity: updatedQuantity,
        total: String(total),
      };
    });
  }

  async function handleSubmit(prevState: any, formData: FormData) {
    const values = {
      quantity: {
        orange: String(formData.get("orange") || ""),
        blue: String(formData.get("blue") || ""),
        green: String(formData.get("green") || ""),
      },
      total: formData.get("total") as string,
      expenses_total: formData.get("expenses_total") as string,
      outstanding: formData.get("outstanding") as string,
    };

    setErrors({});

    try {
      await validateCreate.parseAsync(values);
      const response = await createProduction(payload);
      if (response.status === "SUCCESS") {
        toast("Production has been created");
        setPayload({
          quantity: {
            orange: "",
            blue: "",
            green: "",
          },
          total: "",
          expenses_total: "",
          outstanding: "",
        });
      }
      return response;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast.error("Validation error, check your input");
        return { status: "ERROR", error: fieldErrors };
      }
    }
    console.log(prevState);
  }
  const [state, formAction, isPending] = useActionState(handleSubmit, {
    status: "",
    error: "",
  });

  return (
    <form action={formAction} className="flex flex-col gap-4 items-center my-5">
      <div className="w-full">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm ">orange</span>
            <Input
              className="w-[60px] h-[60px] bg-orange-200 text-center no-spinners dark:bg-orange-500"
              name="orange"
              type="number"
              onChange={(e) =>
                handleQuantityChange(e.target.name, e.target.value)
              }
              value={payload.quantity.orange}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm ">blue</span>
            <Input
              className="w-[60px] h-[60px] bg-blue-200 text-center no-spinners dark:bg-blue-500"
              name="blue"
              type="number"
              onChange={(e) =>
                handleQuantityChange(e.target.name, e.target.value)
              }
              value={payload.quantity.blue}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm ">green</span>
            <Input
              className="w-[60px] h-[60px] bg-green-200 text-center no-spinners dark:bg-green-500"
              name="green"
              type="number"
              onChange={(e) =>
                handleQuantityChange(e.target.name, e.target.value)
              }
              value={payload.quantity.green}
            />
          </div>
        </div>
        {errors.quantity && (
          <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
        )}
      </div>
      <div className="w-full">
        <label htmlFor="total" className="mb-1 text-sm">
          Production Total
        </label>
        <Input
          type="number"
          placeholder="total"
          name="total"
          className="w-full mt-1 no-spinners font-bold"
          readOnly
          value={`${payload.total}`}
        />

        {errors.total && (
          <p className="text-red-500 text-xs mt-1">{errors.total}</p>
        )}
      </div>
      <div className="w-full">
        <label htmlFor="expenses_total" className="text-sm">
          Expenses Total
        </label>
        <Input
          type="number"
          placeholder="expenses total"
          name="expenses_total"
          className="w-full mt-1 no-spinners"
          onChange={(e) =>
            setPayload((prev) => ({
              ...prev,
              expenses_total: e.target.value,
            }))
          }
          value={payload.expenses_total}
        />
        {errors.expenses_total && (
          <p className="text-red-500 text-xs mt-1">{errors.expenses_total}</p>
        )}
      </div>
      <div className="w-full transition-all animate-collapsible-down">
        <label htmlFor="outstanding" className="text-sm">
          Outstanding
        </label>
        <Input
          type="number"
          placeholder="amount"
          name="outstanding"
          className="w-full mt-1 no-spinners"
          onChange={(e) =>
            setPayload((prev) => ({
              ...prev,
              outstanding: e.target.value,
            }))
          }
          value={payload.outstanding}
        />
        {errors.outstanding && (
          <p className="text-red-500 text-xs mt-1">{errors.outstanding}</p>
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

export default ProductionFrom;
