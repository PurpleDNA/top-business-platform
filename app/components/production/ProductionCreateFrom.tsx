/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useActionState, useState } from "react";
import { createProduction } from "@/app/services/productions";
import z, { set } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  old_bread: z
    .object({
      orange: z.coerce.number().optional(),
      blue: z.coerce.number().optional(),
      green: z.coerce.number().optional(),
    })
    .optional(),
});

interface Props {
  multipliers?: Record<string, number>;
}

const ProductionFrom = ({
  multipliers = { orange: 1200, blue: 1000, green: 650 },
}: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOldBread, setShowOldBread] = useState(false);
  const [payload, setPayload] = useState({
    quantity: {
      orange: "",
      blue: "",
      green: "",
    },
    total: "",
    old_bread: {
      orange: "",
      blue: "",
      green: "",
    },
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

  function handleOldBreadChange(name: string, value: string) {
    setPayload((prev) => ({
      ...prev,
      old_bread: {
        ...prev.old_bread,
        [name]: value,
      },
    }));
  }

  async function handleSubmit(prevState: any, formData: FormData) {
    const values = {
      quantity: {
        orange: String(formData.get("orange") || ""),
        blue: String(formData.get("blue") || ""),
        green: String(formData.get("green") || ""),
      },
      total: formData.get("total") as string,
      old_bread: {
        orange: String(formData.get("old_bread_orange") || ""),
        blue: String(formData.get("old_bread_blue") || ""),
        green: String(formData.get("old_bread_green") || ""),
      },
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
          old_bread: {
            orange: "",
            blue: "",
            green: "",
          },
        });
        setShowOldBread(false);
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

      {/* Old Bread Quantity Inputs */}
      {showOldBread && (
        <div className="w-full animate-in slide-in-from-top-2 duration-200">
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm">orange</span>
              <Input
                className="w-[60px] h-[60px] bg-orange-200 text-center no-spinners dark:bg-orange-500 opacity-75"
                name="old_bread_orange"
                type="number"
                onChange={(e) =>
                  handleOldBreadChange(
                    e.target.name.replace("old_bread_", ""),
                    e.target.value
                  )
                }
                value={payload.old_bread.orange}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm">blue</span>
              <Input
                className="w-[60px] h-[60px] bg-blue-200 text-center no-spinners dark:bg-blue-500 opacity-75"
                name="old_bread_blue"
                type="number"
                onChange={(e) =>
                  handleOldBreadChange(
                    e.target.name.replace("old_bread_", ""),
                    e.target.value
                  )
                }
                value={payload.old_bread.blue}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm">green</span>
              <Input
                className="w-[60px] h-[60px] bg-green-200 text-center no-spinners dark:bg-green-500 opacity-75"
                name="old_bread_green"
                type="number"
                onChange={(e) =>
                  handleOldBreadChange(
                    e.target.name.replace("old_bread_", ""),
                    e.target.value
                  )
                }
                value={payload.old_bread.green}
              />
            </div>
          </div>
        </div>
      )}

      {/* Old Bread Toggle */}
      <div className="w-full flex items-center justify-between border rounded-lg p-3 bg-muted/50">
        <Label htmlFor="old-bread-toggle" className="text-sm font-medium">
          Old Bread
        </Label>
        <Switch
          id="old-bread-toggle"
          checked={showOldBread}
          onCheckedChange={() => {
            setShowOldBread((prev) => !prev);
            setPayload((prev) => ({
              ...prev,
              old_bread: { orange: "", blue: "", green: "" },
            }));
          }}
        />
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
