/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createNewSale } from "@/app/services/sales";
import { getLatestProduction } from "@/app/services/productions";
import React, { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import z from "zod";
import { toast } from "sonner";
import { formatDateTime, getTimeFrame } from "@/app/services/utils";
import { Production } from "@/app/services/productions";
import { Customer, searchCustomers } from "@/app/services/customers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const validate = z.object({
  customer_id: z.string().min(1, "Customer ID is required"),
  production_id: z.string().min(1, "Production ID is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  paid: z.string().transform((v) => v === "true"),
});

const multipliers: Record<string, number> = {
  orange: 1200,
  blue: 1000,
  green: 650,
};

interface Props {
  productions?: Production[];
  customer?: Customer;
  production_id?: string;
}

const SalesCreateForm = ({ productions, customer, production_id }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState({
    production: productions && productions[0] ? productions[0] : null,
    customer: customer || { name: "" },
  });
  const [payload, setPayload] = useState({
    customer_id: customer?.id || "",
    production_id: production_id || "",
    amount: "",
    paid: false,
  });
  const [quantity, setQuantity] = useState({
    orange: 0,
    blue: 0,
    green: 0,
  });
  const [searchResults, setSearchResuls] = useState<Customer[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // const [active, setActive] = useState({
  //   producion: false,
  //   customer: false,
  // });

  const handleSearch = async (search: string) => {
    if (search.length < 3) {
      setSearchResuls([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    try {
      const results = (await searchCustomers(search)) as Customer[];
      setSearchResuls(results);
      setShowResults(true);
    } catch (error) {
      console.log(error);
    } finally {
      // setShowResults(false);
    }
  };

  const handleClick = (customer: Customer) => {
    handleSelected("customer", null, customer);
    setSearchResuls([]);
    setShowResults(false);
  };

  async function handleSelected(
    name: string,
    production: Production | null,
    customer: Customer | null
  ) {
    if (name === "production" && production) {
      setSelected((prev) => ({
        ...prev,
        production,
      }));
      setPayload((prev) => ({
        ...prev,
        production_id: production.id,
      }));
    } else if (name === "customer" && customer) {
      setSelected((prev) => ({
        ...prev,
        customer: customer,
      }));
      setPayload((prev) => ({
        ...prev,
        customer_id: customer.id,
      }));
    }
  }

  async function handleSubmit(prevState: any, formData: FormData) {
    const values = {
      customer_id: formData.get("customer_id"),
      production_id: formData.get("production_id"),
      amount: formData.get("amount"),
      paid: formData.get("paid"),
    };

    setErrors({});

    try {
      await validate.parseAsync(values);
      const response = await createNewSale(payload);

      if (response.status === "SUCCESS") {
        toast("Customer has been created successfully");
        return response;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast.error("Validation error, check your input");
        return { status: "ERROR", error: fieldErrors };
      } else {
        toast("Unexpected error occured");
      }
    }
  }

  function handleQuantityChange(name: string, value: string) {
    // ensure numeric quantity
    const num = Number(value) || 0;

    // update quantity state and compute total from the updated quantities
    setQuantity((prevQty) => {
      const updatedQty = {
        ...prevQty,
        [name]: num,
      };

      const total = Object.entries(updatedQty).reduce((sum, [key, val]) => {
        const multiplier = multipliers[key] || 0;
        return sum + Number(val || 0) * multiplier;
      }, 0);

      setPayload((prev) => ({
        ...prev,
        amount: String(total),
      }));

      return updatedQty;
    });
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    status: "",
    error: "",
  });

  useEffect(() => {
    const ISYNC = async () => {
      const latestProduction = await getLatestProduction();

      if (latestProduction) {
        setPayload((prev) => ({
          ...prev,
          production_id:
            productions && productions[0]?.id ? productions[0].id : "",
        }));
      }
    };

    ISYNC();
  }, [productions]);

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
              value={String(quantity.orange)}
              onChange={(e) =>
                handleQuantityChange(e.target.name, e.target.value)
              }
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm ">blue</span>
            <Input
              className="w-[60px] h-[60px] bg-blue-200 text-center no-spinners dark:bg-blue-500"
              name="blue"
              type="number"
              value={String(quantity.blue)}
              onChange={(e) =>
                handleQuantityChange(e.target.name, e.target.value)
              }
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm ">green</span>
            <Input
              className="w-[60px] h-[60px] bg-green-200 text-center no-spinners dark:bg-green-500"
              name="green"
              type="number"
              value={String(quantity.green)}
              onChange={(e) =>
                handleQuantityChange(e.target.name, e.target.value)
              }
            />
          </div>
        </div>
      </div>
      <div className="w-full transition-all animate-collapsible-down">
        <label htmlFor="amount" className="text-sm">
          Amount
        </label>
        <Input
          type="number"
          placeholder="amount"
          name="amount"
          className="w-full mt-1 no-spinners"
          onChange={(e) => {
            setPayload((prev) => ({
              ...prev,
              amount: e.target.value,
            }));
            // clear quantities when typing manually into amount
            setQuantity({ orange: 0, blue: 0, green: 0 });
          }}
          value={payload.amount}
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
        )}
      </div>
      <div className="w-full">
        <label htmlFor="customer_id" className="text-sm">
          Customer
        </label>
        <Input
          type="text"
          placeholder="search customer"
          name="customer"
          className="w-full mt-1 py-6 rounded-lg text-center ring  font-semibold "
          onChange={(e) => {
            handleSearch(e.target.value);
            setSelected((prev) => ({
              ...prev,
              customer: { ...prev.customer, name: e.target.value },
            }));
          }}
          value={selected?.customer?.name}
        />
        {showResults && (
          <div className="max-h-32 min-h-20 overflow-y-auto  w-max mx-auto p-3 shadow border-b border-r rounded-md mt-2 border-primary">
            {searchResults?.map((result) => (
              <div
                key={result.id}
                onClick={() => handleClick(result)}
                className="px-2 py-1 hover:bg-blue-100 transition-colors duration-200 w-2xs border-b cursor-pointer rounded-md text-center"
              >
                {result.name}
              </div>
            ))}
          </div>
        )}
        {errors.customer_id && (
          <p className="text-red-500 text-xs mt-1">{errors.customer_id}</p>
        )}
      </div>
      <div className="w-full">
        <label className="mb-1 text-sm">Production</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center py-3 px-3 border rounded-md border-primary shadow ring font-semibold">
              {formatDateTime(selected.production?.created_at)}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-32 overflow-y-auto">
            {productions?.map((production) => (
              <DropdownMenuItem
                key={production.id}
                onClick={() => handleSelected("production", production, null)}
              >
                {formatDateTime(production.created_at)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>{" "}
        <span className="text-xs text-primary">
          {getTimeFrame(selected.production?.created_at)}
        </span>
        {errors.production_id && (
          <p className="text-red-500 text-xs mt-1">{errors.production_id}</p>
        )}
      </div>
      <div className="mr-auto">
        <label htmlFor="paid" className="text-sm">
          Paid
        </label>
        <Input
          type="checkbox"
          name="paid"
          className="h-8 w-8 mt-1"
          onChange={(e) =>
            setPayload((prev) => ({ ...prev, paid: e.target.checked }))
          }
          checked={payload.paid}
        />
        {errors.paid && (
          <p className="text-red-500 text-xs mt-1">{errors.paid}</p>
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

export default SalesCreateForm;
