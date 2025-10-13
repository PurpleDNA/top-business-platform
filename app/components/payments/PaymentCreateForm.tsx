/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Customer,
  searchCustomers,
  updateCustomer,
  updateDebtStatus,
} from "@/app/services/customers";
import React, { useActionState, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { addPayment } from "@/app/services/payments";
import { Input } from "@/components/ui/input";
import { LoaderCircle, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  customer?: Customer;
}

const validate = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  amountPaid: z.coerce.number().min(1, "Amount is required"),
});

const PaymentCreateForm = ({ customer }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState({
    customer: customer || undefined,
  });
  const [payload, setPayload] = useState({
    customerId: selected?.customer?.id || "",
    amountPaid: "",
  });
  const [searchResults, setSearchResuls] = useState<Customer[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [customerSearchValue, setCustomerSearchValue] = useState(
    selected?.customer?.name || ""
  );

  const handleSearch = async (search: string) => {
    setCustomerSearchValue(search);

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
      setSearching(false);
    }
  };

  async function handleSelected(customer: Customer) {
    setSelected({
      customer: customer,
    });
    setPayload((prev) => ({
      ...prev,
      customerId: customer?.id,
    }));
  }

  const handleClick = (customer: Customer) => {
    handleSelected(customer);
    setCustomerSearchValue(customer.name);
    setSearchResuls([]);
    setShowResults(false);
  };

  async function handleSubmit(prevState: any, formData: FormData) {
    const values = {
      customerId: payload.customerId,
      amountPaid: formData.get("amount"),
    };

    setErrors({});

    try {
      await validate.parseAsync(values);
      const [response_1, response_2] = await Promise.all([
        addPayment({
          customerId: payload.customerId,
          amountPaid: Number(payload.amountPaid),
        }),
        await updateDebtStatus(payload.customerId, Number(payload.amountPaid)),
      ]);
      if (response_1.status === "SUCCESS" && response_2.status === "SUCESS") {
        toast("Payment made successfully");
        return { response_1, response_2 };
      }
      if (response_1.status === "EROOR" || response_2.status === "ERROR") {
        toast("Unexpected Error Occurred");
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

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    status: "",
    error: "",
  });

  return (
    <form action={formAction} className="flex flex-col gap-4 items-center my-5">
      <div className="w-full">
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
                amountPaid: e.target.value,
              }));
            }}
            value={payload.amountPaid}
          />
          {errors.amountPaid && (
            <p className="text-red-500 text-xs mt-1">{errors.amountPaid}</p>
          )}
        </div>
      </div>
      <div className="w-full relative">
        <label htmlFor="customer" className="text-sm">
          Customer
        </label>
        <div className="relative">
          <Input
            type="text"
            placeholder="search customer"
            name="customer"
            className="w-full mt-1 py-6 rounded-lg text-center ring  font-semibold"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            value={customerSearchValue}
          />
          {errors.customerId && (
            <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>
          )}

          {searching && (
            <LoaderCircle
              size={18}
              color="#368ffc"
              className="absolute top-1/2 -translate-y-1/2 right-4 animate-spin"
            />
          )}
        </div>
        {showResults && (
          <div className="max-h-32 min-h-20 overflow-y-auto w-max p-3 shadow border rounded-md mt-4 border-primary absolute z-20 bg-white justify-self-center flex items-center flex-col justify-center">
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
              <div className="w-2xs rounded-md flex gap-2 justify-center items-center ">
                No customers found <UserRoundX size={18} />
              </div>
            )}
          </div>
        )}
        {errors.customer && (
          <p className="text-red-500 text-xs mt-1">{errors.customer}</p>
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

export default PaymentCreateForm;
