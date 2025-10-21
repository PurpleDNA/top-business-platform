"use server";
import supabase from "@/client";
import { revalidateTag } from "next/cache";

export interface Production {
  id: string;
  quantity: {
    blue: number;
    green: number;
    orange: number;
    [key: string]: number; // allows future extensions
  };
  total: number;
  break_even: boolean;
  short_or_excess: boolean;
  expenses_total: number;
  cash: number;
  created_at: string;
  updated_at: string;
  open: boolean;
}

interface Create {
  quantity: {
    orange: string;
    blue: string;
    green: string;
  };
  total: string;
  expenses_total?: string;
  outstanding?: string;
}

export const createProduction = async (payload: Create) => {
  try {
    const quantity = Object.fromEntries(
      Object.entries(payload.quantity).map(([key, value]) => [
        key,
        Number(value),
      ])
    );
    const { data: ProductionData, error } = await supabase
      .from("productions")
      .insert({
        quantity: quantity,
        total: Number(payload.total),
        expenses_total: Number(payload.expenses_total || 0),
        outstanding: Number(payload.outstanding || 0),
        production: true,
      })
      .select();

    if (error) {
      throw new Error("Create Production Error");
    }
    revalidateTag("last10");

    return { status: "SUCCESS", error: "", res: ProductionData[0] };
  } catch (error) {
    console.log("create production error>>>>>>>>, error");
    throw new Error(String(error));
  }
};

export const getLatestProduction = async () => {
  try {
    const { data: lastProduction } = await supabase
      .from("productions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    return lastProduction;
  } catch (error) {
    console.log("getLatestProduction Error>>>>>>>", error);
    throw new Error(String(error));
  }
};

export const getLast10Productions = async () => {
  try {
    const { data: last10 } = await supabase
      .from("productions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    return last10;
  } catch (error) {
    console.log("getLatestProduction Error>>>>>>>", error);
    throw new Error(String(error));
  }
};

export const getProductionById = async (id: string) => {
  try {
    const { data: production, error } = await supabase
      .from("productions")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching production by ID:", error);
      return null;
    }

    return production;
  } catch (error) {
    console.error("Unexpected error in fetchProductionById:", error);
    return null;
  }
};

export const fetchAllProductions = async (): Promise<Production[] | []> => {
  try {
    const { data: productions, error } = await supabase
      .from("productions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching productions:", error);
      return [];
    }

    return productions;
  } catch (error) {
    console.error("Unexpected error in fetchAllProductions:", error);
    return [];
  }
};

interface SaleWithCustomer {
  outstanding: number;
  paid: boolean;
  customers: {
    name: string;
  };
}

export const getProductionOutstanding = async (productionId: string) => {
  try {
    const { data: outstanding, error } = await supabase
      .from("sales")
      .select(
        `
        outstanding,
        paid,
        customers!customer_id (
          name
        )
      `
      )
      .eq("production_id", productionId)
      .gt("outstanding", 0)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching production outstanding:", error);
      return null;
    }

    // Transform the data to return a cleaner structure
    const transformed =
      (outstanding as unknown as SaleWithCustomer[])?.map((sale) => ({
        customer_name: sale.customers?.name || "Unknown",
        outstanding: sale.outstanding,
        paid: sale.paid,
      })) || [];

    return transformed;
  } catch (error) {
    console.error("Unexpected error in getProductionOutstanding:", error);
    return null;
  }
};

interface PaymentWithCustomer {
  amount_paid: number;
  customers: {
    name: string;
  } | null;
}

export const getProductionPaidOutstanding = async (productionId: string) => {
  try {
    const { data: payments, error } = await supabase
      .from("payments")
      .select(
        `
        amount_paid,
        customers!customer_id (
          name
        )
      `
      )
      .eq("production_id", productionId)
      .order("paid_at", { ascending: false });

    if (error) {
      console.error("Error fetching production paid outstanding:", error);
      return null;
    }

    // Transform the data to return a cleaner structure
    const transformed =
      (payments as unknown as PaymentWithCustomer[])?.map((payment) => ({
        customer_name: payment.customers?.name || "Unknown",
        amount: payment.amount_paid,
      })) || [];

    return transformed;
  } catch (error) {
    console.error("Unexpected error in getProductionPaidOutstanding:", error);
    return null;
  }
};

export const toggleProdStatus = async (productionId: string) => {
  try {
    // First, get the current status
    const { data: production, error: fetchError } = await supabase
      .from("productions")
      .select("open")
      .eq("id", productionId)
      .single();

    if (fetchError) {
      console.error("Error fetching production status:", fetchError);
      throw new Error("Failed to fetch production status");
    }

    // Toggle the open status
    const newStatus = !production.open;

    // Update the production with the new status
    const { data: updatedProduction, error: updateError } = await supabase
      .from("productions")
      .update({ open: newStatus })
      .eq("id", productionId)
      .select();

    if (updateError) {
      console.error("Error updating production status:", updateError);
      throw new Error("Failed to update production status");
    }

    revalidateTag("productions");

    return { status: "SUCCESS", data: updatedProduction, newStatus };
  } catch (error) {
    console.error("Unexpected error in toggleProdStatus:", error);
    return { status: "ERROR", error: String(error) };
  }
};

export const updateProduction = async (
  productionId: string,
  payload: Partial<Production>
) => {
  try {
    const { data: updatedProduction, error } = await supabase
      .from("productions")
      .update(payload)
      .eq("id", productionId)
      .select();

    if (error) {
      console.error("Error updating production:", error);
      throw new Error("Failed to update production");
    }

    revalidateTag("productions");

    return { status: "SUCCESS", data: updatedProduction[0] };
  } catch (error) {
    console.error("Unexpected error in updateProduction:", error);
    return { status: "ERROR", error: String(error) };
  }
};
