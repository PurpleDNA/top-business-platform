/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createNewSale } from "@/app/services/sales";
import React, { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LoaderCircle, UserRoundX } from "lucide-react";
import z from "zod";
import { toast } from "sonner";
import { formatDateTime, getTimeFrame } from "@/app/services/utils";
import { Production } from "@/app/services/productions";
import { addPayment } from "@/app/services/payments";
import { getBreadPriceMultipliers } from "@/app/services/bread_price";
import {
  Customer,
  searchCustomers,
  updateCustomer,
} from "@/app/services/customers";
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
  paid: z.boolean(),
  remaining: z.coerce.number(),
});

interface Props {
  productions?: Production[];
  customer?: Customer;
  production?: Production;
}

// Helper function to get color-specific CSS classes
const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; darkBg: string }> = {
    orange: {
      bg: "bg-orange-200",
      darkBg: "dark:bg-orange-500",
    },
    blue: {
      bg: "bg-blue-200",
      darkBg: "dark:bg-blue-500",
    },
    green: {
      bg: "bg-green-200",
      darkBg: "dark:bg-green-500",
    },
  };

  return (
    colorMap[color.toLowerCase()] || {
      bg: "bg-gray-200",
      darkBg: "dark:bg-gray-500",
    }
  );
};

const SalesCreateForm = ({ productions, customer, production }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [multipliers, setMultipliers] = useState<Record<string, number>>({
    orange: 1200,
    blue: 1000,
    green: 650,
  });
  const [selected, setSelected] = useState({
    production: production
      ? production
      : productions && productions[0]
      ? productions[0]
      : undefined,
    customer: customer || undefined,
  });

  // Initialize dynamic quantity object based on multipliers
  const initialQuantity: { [key: string]: number } = {};
  Object.keys(multipliers).forEach((color) => {
    initialQuantity[color] = 0;
  });

  const [payload, setPayload] = useState({
    customer_id: selected?.customer?.id || "",
    production_id: selected?.production?.id || "",
    amount: "",
    amount_paid: "",
    paid: false,
    remaining: 0,
    quantity: initialQuantity,
  });
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [quantity, setQuantity] = useState<{
    [key: string]: string;
  }>({
    orange: "",
    blue: "",
    green: "",
  });
  const [searchResults, setSearchResuls] = useState<Customer[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [customerSearchValue, setCustomerSearchValue] = useState(
    selected?.customer?.name || ""
  );
  const [shouldSearch, setShouldSearch] = useState(false);
  const [isOverpayment, setIsOverpayment] = useState(false);

  // Fetch multipliers on component mount
  useEffect(() => {
    const fetchMultipliers = async () => {
      const prices = await getBreadPriceMultipliers();
      setMultipliers(prices);

      // Initialize quantity state with dynamic colors
      const initialQuantity: { [key: string]: string } = {};
      Object.keys(prices).forEach((color) => {
        initialQuantity[color] = "";
      });
      setQuantity(initialQuantity);
    };
    fetchMultipliers();
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Don't search if customer was selected from dropdown or preloaded
    if (!shouldSearch) {
      return;
    }

    // If search is too short, clear results immediately
    if (customerSearchValue.length < 3) {
      setSearchResuls([]);
      setShowResults(false);
      setSearching(false);
      return;
    }

    // Debounce the search
    setSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const results = (await searchCustomers(
          customerSearchValue
        )) as Customer[];
        // Only update if the search value hasn't changed
        if (customerSearchValue.length >= 3) {
          setSearchResuls(results);
          setShowResults(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setSearching(false);
      }
    }, 300); // 300ms debounce

    // Cleanup function to cancel pending searches
    return () => {
      clearTimeout(timeoutId);
      setSearching(false);
    };
  }, [customerSearchValue, shouldSearch]);

  const handleClick = (customer: Customer) => {
    handleSelected("customer", null, customer);
    setShouldSearch(false); // Prevent search when selecting from dropdown
    setCustomerSearchValue(customer.name);
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
      customer_id: payload.customer_id,
      production_id: payload.production_id,
      amount: formData.get("amount"),
      paid: payload.paid,
      remaining: payload.remaining,
    };

    setErrors({});

    try {
      await validate.parseAsync(values);
      const response = await createNewSale(payload);

      await addPayment({
        customerId: payload.customer_id,
        amountPaid: Number(payload.amount),
        productionId: null,
        saleId: response.res?.id,
        type: "on_demand",
      });

      if (response.status === "SUCCESS") {
        toast("Sale has been created successfully");

        // Build dynamic reset objects
        const resetQuantity: { [key: string]: number } = {};
        const resetQuantityStrings: { [key: string]: string } = {};
        Object.keys(multipliers).forEach((color) => {
          resetQuantity[color] = 0;
          resetQuantityStrings[color] = "";
        });

        // Reset form after successful submission
        setPayload({
          customer_id: "",
          production_id: selected?.production?.id || "",
          amount: "",
          paid: false,
          remaining: 0,
          amount_paid: "",
          quantity: resetQuantity,
        });
        setAmountPaid("");
        setQuantity(resetQuantityStrings);
        setCustomerSearchValue("");
        setShouldSearch(false);
        setIsOverpayment(false);
        setSelected((prev) => ({
          ...prev,
          customer: undefined,
        }));
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
    // update quantity state and compute total from the updated quantities
    setQuantity((prevQty) => {
      const updatedQty = {
        ...prevQty,
        [name]: value,
      };

      const total = Object.entries(updatedQty).reduce((sum, [key, val]) => {
        const multiplier = multipliers[key] || 0;
        return sum + Number(val || 0) * multiplier;
      }, 0);

      // Build dynamic quantity object
      const dynamicQuantity: { [key: string]: number } = {};
      Object.keys(multipliers).forEach((color) => {
        dynamicQuantity[color] = Number(updatedQty[color] || 0);
      });

      setPayload((prev) => ({
        ...prev,
        amount: String(total),
        quantity: dynamicQuantity,
        remaining: prev.paid
          ? 0
          : total - (amountPaid ? Number(amountPaid) : 0),
      }));

      return updatedQty;
    });
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    status: "",
    error: "",
  });
  function setDate(): string {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0"); // 01–31
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-based → +1
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  return (
    <form action={formAction} className="flex flex-col gap-4 items-center my-5">
      <div className="w-full">
        <div className="flex justify-around items-center">
          {Object.keys(multipliers).map((color) => {
            const colorClasses = getColorClasses(color);
            return (
              <div key={color} className="flex flex-col items-center gap-1">
                <span className="text-sm capitalize">{color}</span>
                <Input
                  className={`w-[60px] h-[60px] ${colorClasses.bg} text-center no-spinners ${colorClasses.darkBg}`}
                  name={color}
                  type="number"
                  value={quantity[color] || ""}
                  onChange={(e) =>
                    handleQuantityChange(e.target.name, e.target.value)
                  }
                />
              </div>
            );
          })}
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
          value={payload.amount}
          readOnly
        />
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
        )}
      </div>
      <div className="w-full relative">
        <label htmlFor="customer_id" className="text-sm">
          Customer
        </label>
        <div className="relative">
          <Input
            type="text"
            placeholder="search customer"
            name="customer"
            className="w-full mt-1 py-6 rounded-lg text-center ring  font-semibold"
            onChange={(e) => {
              setShouldSearch(true); // Enable search when user types
              setCustomerSearchValue(e.target.value);
            }}
            value={customerSearchValue}
          />

          {searching && (
            <LoaderCircle
              size={18}
              color="#368ffc"
              className="absolute top-1/2 -translate-y-1/2 right-4 animate-spin"
            />
          )}
        </div>
        {showResults && (
          <div className="max-h-32 min-h-20 overflow-y-auto w-max p-3 shadow border rounded-md mt-4 border-primary absolute z-20 bg-background justify-self-center flex items-center flex-col justify-center text-foreground">
            {searchResults.length > 0 ? (
              searchResults?.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleClick(result)}
                  className="px-2 py-1 hover:bg-blue-100 transition-colors duration-200 w-2xs border-b cursor-pointer rounded-md text-center"
                >
                  {result.name}
                </div>
              ))
            ) : (
              <div className="w-2xs rounded-md flex gap-2 justify-center items-center bg-background">
                No customers found <UserRoundX size={18} />
              </div>
            )}
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
      <div className="w-full flex items-center justify-between border rounded-lg p-3 bg-muted/50">
        <Label htmlFor="paid-switch" className="text-sm font-medium">
          Paid in Full
        </Label>
        <Switch
          id="paid-switch"
          checked={payload.paid}
          onCheckedChange={(isPaid) => {
            setPayload((prev) => ({
              ...prev,
              paid: isPaid,
              amount_paid: isPaid ? prev.amount : amountPaid,
              remaining: isPaid ? 0 : Number(prev.amount) - Number(amountPaid),
            }));
            if (isPaid) {
              setAmountPaid("");
              setIsOverpayment(false);
            }
          }}
        />
        {errors.paid && (
          <p className="text-red-500 text-xs mt-1">{errors.paid}</p>
        )}
      </div>

      {/* Conditionally render amountPaid input when not paid in full */}
      {!payload.paid && (
        <div className="w-full transition-all animate-collapsible-down">
          <label htmlFor="amountPaid" className="text-sm">
            Amount Paid
          </label>
          <Input
            type="number"
            placeholder="Amount paid"
            name="amountPaid"
            className={`w-full mt-1 no-spinners ${
              isOverpayment ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
            onChange={(e) => {
              const paidAmount = e.target.value;
              const isOver = Number(paidAmount) > Number(payload.amount);
              setIsOverpayment(isOver);
              setAmountPaid(paidAmount);
              const remaining =
                Number(payload.amount) - Number(paidAmount || 0);
              setPayload((prev) => ({
                ...prev,
                remaining: remaining >= 0 ? remaining : 0,
                amount_paid: paidAmount,
              }));
            }}
            value={amountPaid}
          />
          {isOverpayment && (
            <p className="text-red-500 text-xs mt-1">
              Amount paid cannot exceed total amount
            </p>
          )}
          {!isOverpayment && payload.remaining > 1 && (
            <p className="text-xs mt-1 text-muted-foreground">
              Remaining: ₦{payload.remaining}
            </p>
          )}
        </div>
      )}

      <Button
        className="bg-primary font-bungee cursor-pointer"
        disabled={isPending || isOverpayment}
        type="submit"
      >
        Create{isPending && <LoaderCircle size={15} className="animate-spin" />}
      </Button>
    </form>
  );
};

export default SalesCreateForm;
