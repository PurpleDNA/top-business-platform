/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Customer,
  searchCustomers,
  updateCustomer,
  updateDebtStatus,
} from "@/app/services/customers";
import React, { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import {
  addPayment,
  distributePaymentAcrossSales,
} from "@/app/services/payments";
import { Input } from "@/components/ui/input";
import { LoaderCircle, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUnpaidSalesByCustomerId } from "@/app/services/sales";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateSale, fetchSaleById } from "@/app/services/sales";
import { Production } from "@/app/services/productions";

interface Props {
  customer?: Customer;
  latestProd: Production;
}

const validate = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  amountPaid: z.coerce.number().min(1, "Amount is required"),
  saleId: z.string(),
});

const PaymentCreateForm = ({ customer, latestProd }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState({
    customer: customer || undefined,
    sale: undefined as any,
  });
  const [payload, setPayload] = useState({
    customerId: selected?.customer?.id || "",
    amountPaid: "",
    saleId: "",
  });
  const [searchResults, setSearchResuls] = useState<Customer[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [customerSearchValue, setCustomerSearchValue] = useState(
    selected?.customer?.name || ""
  );
  const [unpaidSales, setUnpaidSales] = useState<any[]>([]);
  const [loadingSales, setLoadingSales] = useState(false);

  // Fetch unpaid sales when customer is selected
  useEffect(() => {
    const fetchUnpaidSales = async () => {
      if (selected.customer?.id) {
        setLoadingSales(true);
        try {
          const result = await getUnpaidSalesByCustomerId(selected.customer.id);
          setUnpaidSales(result.data || []);
        } catch (error) {
          console.error("Error fetching unpaid sales:", error);
          setUnpaidSales([]);
        } finally {
          setLoadingSales(false);
        }
      } else {
        setUnpaidSales([]);
      }
    };

    fetchUnpaidSales();
  }, [selected.customer?.id]);

  // Debounced search effect
  useEffect(() => {
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
  }, [customerSearchValue]);

  // Format date as dd/mm/yy
  const formatShortDate = (timestamp: any) => {
    if (!timestamp) return "No date";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };

  async function handleSelected(customer: Customer) {
    setSelected((prev) => ({
      ...prev,
      customer: customer,
    }));
    setPayload((prev) => ({
      ...prev,
      customerId: customer?.id,
    }));
  }

  function handleSaleSelected(sale: any) {
    setSelected((prev) => ({
      ...prev,
      sale: sale,
    }));
    setPayload((prev) => ({
      ...prev,
      saleId: sale?.id,
      // amountPaid: String(sale?.amount || ""),
    }));
  }

  const handleClick = (customer: Customer) => {
    handleSelected(customer);
    setCustomerSearchValue(customer.name);
    setSearchResuls([]);
    setShowResults(false);
  };

  const updateSaleStatus = async () => {
    const newRemaining = selected.sale?.remaining - Number(payload.amountPaid);
    console.log(
      "logging arguments and important things>>>>>>>>>",
      selected.sale?.amount,
      payload.amountPaid,
      newRemaining
    );

    if (newRemaining <= 0) {
      await updateSale(selected.sale?.id, { paid: true, remaining: 0 });
    } else {
      await updateSale(selected.sale?.id, { remaining: newRemaining });
    }
  };

  // useEffect(() => {
  //   updateSaleStatus("90026b33-2e21-44ca-aa97-fb60a161c3c8", 200);
  // }, []);

  async function handleSubmit(prevState: any, formData: FormData) {
    const values = {
      customerId: payload.customerId,
      amountPaid: formData.get("amount"),
      saleId: payload.saleId,
    };

    setErrors({});

    try {
      await validate.parseAsync(values);

      // If no specific sale is selected, distribute payment across unpaid sales
      if (!payload.saleId || payload.saleId === "") {
        const result = await distributePaymentAcrossSales(
          payload.customerId,
          Number(payload.amountPaid),
          latestProd.open ? latestProd.id : null
        );

        if (result.status === "SUCCESS") {
          const data = result.data!;
          toast.success(
            `Payment distributed! Cleared ${data.sales_fully_cleared} sale(s), updated ${data.sales_partially_paid}`
          );

          // Reset form after successful submission
          setPayload({
            customerId: "",
            amountPaid: "",
            saleId: "",
          });
          setCustomerSearchValue("");
          setSelected({
            customer: undefined,
            sale: undefined,
          });
          return result;
        } else {
          toast.error("Error distributing payment: " + result.error);
          return result;
        }
      }

      // If specific sale is selected, handle normally
      const [response_1, response_2] = await Promise.all([
        addPayment({
          customerId: payload.customerId,
          amountPaid: Number(payload.amountPaid),
          saleId: payload?.saleId,
          productionId: latestProd.open ? latestProd.id : null,
        }),
        await updateDebtStatus(
          payload.customerId,
          Number(payload.amountPaid),
          "addPayment"
        ),
      ]);

      if (payload.saleId) {
        await updateSaleStatus();
      }

      if (response_1.status === "SUCCESS" && response_2.status === "SUCCESS") {
        toast("Payment made successfully");
        // Reset form after successful submission
        setPayload({
          customerId: "",
          amountPaid: "",
          saleId: "",
        });
        setCustomerSearchValue("");
        setSelected({
          customer: undefined,
          sale: undefined,
        });
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
              setCustomerSearchValue(e.target.value);
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

      {/* Unpaid Sales Dropdown */}

      <div className="w-full">
        <label className="mb-1 text-sm">Unpaid Sales (Optional)</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center py-3 px-3 border rounded-md border-primary shadow ring font-semibold cursor-pointer">
              {loadingSales ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle size={14} className="animate-spin" />
                  Loading sales...
                </span>
              ) : selected.sale ? (
                <span>
                  {formatShortDate(selected.sale.created_at)} - ₦
                  {selected.sale.remaining}
                </span>
              ) : unpaidSales.length > 0 ? (
                "Select an unpaid sale"
              ) : (
                "No unpaid sales"
              )}
            </div>
          </DropdownMenuTrigger>
          {unpaidSales.length > 0 && (
            <DropdownMenuContent className="max-h-32 overflow-y-auto">
              {unpaidSales.map((sale) => (
                <DropdownMenuItem
                  key={sale.id}
                  onClick={() => handleSaleSelected(sale)}
                >
                  <div className="flex justify-between items-center w-full gap-4">
                    <span className="text-sm">
                      {formatShortDate(sale.created_at)}
                    </span>
                    <span className="font-semibold">₦{sale.remaining}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
        <span className="text-xs text-muted-foreground">
          {unpaidSales.length > 0 && `${unpaidSales.length} unpaid sale(s)`}
        </span>
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
