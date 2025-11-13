"use server";

import supabase from "@/client";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { addPayment } from "./payments";
import { checkProductionClosed } from "./productions";
import { toast } from "sonner";

interface CreateSale {
  customer_id: string;
  production_id: string;
  amount: string;
  paid: boolean;
  remaining: number;
  quantity?: {
    [key: string]: number;
  };
  amount_paid: string;
}

export interface Sale {
  customer_id: string;
  production_id: string;
  amount: number;
  paid: boolean;
  remaining: number;
  outstanding?: number;
  amount_paid: number;
  quantity_bought: {
    [key: string]: number;
  };
}

export const fetchAllSales = async (page: number, limit: number) => {
  const offset = page * limit;
  try {
    const { data: sales, error } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) {
      console.error("Error fetching sales:", error);
      return [];
    }
    return sales;
  } catch (error) {
    console.error("Unexpected error in fetchAllSales:", error);
    return [];
  }
};

export interface SaleWithDetails {
  id: string;
  amount: number;
  paid: boolean;
  outstanding: number;
  amount_paid: number;
  created_at: string;
  customer_id: string;
  production_id: string;
  quantity_bought: { [key: string]: number };
  customers: {
    id: string;
    name: string;
  };
  productions: {
    id: string;
    created_at: string;
  };
}

export const fetchAllSalesWithDetails = unstable_cache(
  async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    try {
      const { data: sales, error } = await supabase
        .from("sales")
        .select(
          `
        id,
        amount,
        paid,
        outstanding,
        amount_paid,
        created_at,
        customer_id,
        production_id,
        quantity_bought,
        customers!customer_id (
          id,
          name
        ),
        productions!production_id (
          id,
          created_at
        )
      `
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error("Error fetching sales with details:", error);
        return [];
      }

      return (sales as unknown as SaleWithDetails[]) || [];
    } catch (error) {
      console.error("Unexpected error in fetchAllSalesWithDetails:", error);
      return [];
    }
  },
  [],
  {
    tags: ["sales"],
    revalidate: 300,
  }
);

export const fetchSalesByCustomerId = async (customerId: string) => {
  try {
    const { data: sales, error } = await supabase
      .from("sales")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sales by customer ID:", error);
      return [];
    }

    return sales;
  } catch (error) {
    console.error("Unexpected error in fetchSalesByCustomerId:", error);
    return [];
  }
};

export const fetchSaleById = async (saleId: string) => {
  try {
    const { data: sale, error } = await supabase
      .from("sales")
      .select("*")
      .eq("id", saleId)
      .single();

    if (error) {
      throw new Error("Error fetching sale by ID:", error);
    }

    return sale;
  } catch (error) {
    console.error("Unexpected error in fetchSaleById:", error);
    return [];
  }
};

interface SaleWithCustomer {
  id: string;
  amount: number;
  paid: boolean;
  outstanding: number;
  created_at: string;
  customer_id: string;
  production_id: string;
  customers: {
    id: string;
    name: string;
  };
  quantity_bought: { [key: string]: number };
}

export const fetchSalesByProductionId = unstable_cache(
  async (productionId: string) => {
    try {
      const { data: sales, error } = await supabase
        .from("sales")
        .select(
          `
        *,
        customers!customer_id (
          id,
          name
        )
      `
        )
        .eq("production_id", productionId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching sales with customer:", error);
        return [];
      }

      return (sales as unknown as SaleWithCustomer[]) || [];
    } catch (error) {
      console.error("Unexpected error in fetchSalesByProductionId:", error);
      return [];
    }
  },
  [],
  {
    tags: ["salesByProd"],
    revalidate: 300,
  }
);

export const createNewSale = async (payload: CreateSale) => {
  try {
    // 1. Create the sale record
    const { data: saleData, error } = await supabase
      .from("sales")
      .insert({
        customer_id: payload.customer_id,
        production_id: payload.production_id,
        amount: Number(payload.amount),
        amount_paid: payload.amount_paid || 0,
        outstanding: payload.remaining,
        quantity_bought: payload.quantity,
      })
      .select("*")
      .single();

    if (error) {
      console.log(error);
      throw new Error("Create Sale Error");
    }

    revalidatePath("/sales/all");
    revalidateTag("sales", {});
    revalidateTag("salesByProd", {});

    return { status: "SUCCESS", error: "", res: saleData[0] };
  } catch (error) {
    console.log("create sale error>>>>>>", error);
    throw new Error("Unexpected Error Occured");
  }
};

export const getUnpaidSalesByCustomerId = async (customerId: string) => {
  try {
    const { data: unpaidSales, error } = await supabase
      .from("sales")
      .select("*")
      .eq("customer_id", customerId)
      .eq("paid", false)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("get unpaid sales error");
    }
    return { status: "SUCCESS", error: "", data: unpaidSales };
  } catch (error) {
    console.log("get unpaid sales error >>>>>>", error);
    throw new Error("Unexpected Error Occured");
  }
};

export const updateSale = async (
  saleId: string,
  payload: Partial<Sale>,
  from?: string
) => {
  try {
    // First, get the sale to check its production_id
    const { data: existingSale, error: fetchError } = await supabase
      .from("sales")
      .select("production_id")
      .eq("id", saleId)
      .single();

    if (fetchError || !existingSale) {
      throw new Error("Sale not found");
    }

    // Check if production is closed
    const closureCheck = await checkProductionClosed(
      existingSale.production_id
    );
    if (closureCheck.isClosed) {
      toast.error("Sale cannot be updated because the production is closed");
      throw new Error(
        `Sale cannot be updated because the production is closed`
      );
    }

    const { data: updatedSale, error: updateSaleError } = await supabase
      .from("sales")
      .update(payload)
      .eq("id", saleId)
      .select("*")
      .single();

    if (updateSaleError) {
      throw new Error("update sale error");
    }

    if (payload.amount_paid && !from) {
      const { data: updatedPayment, error: updatePaymentError } = await supabase
        .from("payments")
        .update({ amount_paid: payload.amount_paid })
        .eq("sale_id", saleId)
        .eq("type", "on_demand")
        .select("*");

      console.log("updatedPayment>>>>>>>>>>>>>>>", updatedPayment);
      if (updatePaymentError) {
        throw new Error("update payment error");
      }

      if (!updatedPayment || updatedPayment.length === 0) {
        console.log("No payment found with that sale_id");
        addPayment({
          customerId: updatedSale.customer_id,
          amountPaid: updatedSale.amount_paid,
          saleId: updatedSale.id,
          productionId: null,
          type: "on_demand",
        });
        console.log("running no payment found");
        return;
      }
    }

    revalidateTag("sales", {});
    revalidateTag("customers", {});
    revalidateTag("productions", {});

    return { status: "SUCCESS", error: "", data: updatedSale };
  } catch (error) {
    console.log("update sale error >>>>>>", error);
    throw new Error("Unexpected Error Occured");
  }
};

export const deleteSale = async (saleId: string) => {
  try {
    // First, get the sale to check its production_id
    const { data: existingSale, error: fetchError } = await supabase
      .from("sales")
      .select("production_id")
      .eq("id", saleId)
      .single();

    if (fetchError || !existingSale) {
      throw new Error("Sale not found");
    }

    // Check if production is closed
    const closureCheck = await checkProductionClosed(
      existingSale.production_id
    );
    if (closureCheck.isClosed) {
      toast.error("Sale cannot be deleted because the production is closed");
      throw new Error(
        `Sale cannot be deleted because the production is closed`
      );
    }

    const { error } = await supabase.from("sales").delete().eq("id", saleId);

    if (error) {
      throw new Error("Delete Sale Error");
    }

    revalidateTag("sales", {});
    revalidateTag("customers", {});
    revalidateTag("productions", {});

    return { status: "SUCCESS", error: "" };
  } catch (error) {
    console.log("delete sale error >>>>>>", error);
    throw new Error("Unexpected Error Occured");
  }
};
