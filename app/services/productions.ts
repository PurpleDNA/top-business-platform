"use server";
import supabase from "@/client";
import { revalidateTag } from "next/cache";
import { getBreadPriceMultipliers } from "./bread_price";

export interface Production {
  id: string;
  quantity: {
    blue: number;
    green: number;
    orange: number;
    [key: string]: number; // allows future extensions
  };
  old_bread: {
    blue: number;
    green: number;
    orange: number;
    [key: string]: number; // allows future extensions
  };
  remaining_bread: {
    blue: number;
    green: number;
    orange: number;
    [key: string]: number; // allows future extensions
  };
  total: number;
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
  old_bread: {
    orange: string;
    blue: string;
    green: string;
  };
}

export const createProduction = async (payload: Create) => {
  try {
    const quantity = Object.fromEntries(
      Object.entries(payload.quantity).map(([key, value]) => [
        key,
        Number(value),
      ])
    );

    const old_bread = Object.fromEntries(
      Object.entries(payload.old_bread).map(([key, value]) => [
        key,
        Number(value),
      ])
    );

    // Calculate remaining_bread: sum of quantity and old_bread for each property
    const remaining_bread: { [key: string]: number } = {};
    Object.keys(quantity).forEach((key) => {
      remaining_bread[key] = (quantity[key] || 0) + (old_bread[key] || 0);
    });

    const { data: ProductionData, error } = await supabase
      .from("productions")
      .insert({
        quantity: quantity,
        total: Number(payload.total),
        old_bread: old_bread,
        remaining_bread: remaining_bread,
        open: true,
      })
      .select();

    if (error) {
      throw new Error("Create Production Error");
    }
    await revalidateTag("last10", {});

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
  customer_id: string;
  customers: {
    id: string;
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
        customer_id,
        customers!customer_id (
          id,
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
        customer_id: sale.customer_id,
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
  customer_id: string;
  customers: {
    id: string;
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
        customer_id,
        customers!customer_id (
          id,
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
        customer_id: payment.customer_id,
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

    await revalidateTag("productions", {});

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

    await revalidateTag("productions", {});

    return { status: "SUCCESS", data: updatedProduction[0] };
  } catch (error) {
    console.error("Unexpected error in updateProduction:", error);
    return { status: "ERROR", error: String(error) };
  }
};

export const updateRemainingBread = async (
  productionId: string,
  soldQuantity: { orange?: number; blue?: number; green?: number }
) => {
  try {
    const production = await getProductionById(productionId);

    if (!production || !production.remaining_bread) {
      console.error("Production not found or has no remaining_bread");
      return { status: "ERROR", error: "Production not found" };
    }

    const currentRemaining = production.remaining_bread;
    const newRemaining: { [key: string]: number } = {};

    Object.keys(currentRemaining).forEach((key) => {
      const current = currentRemaining[key] || 0;
      const sold = soldQuantity[key as keyof typeof soldQuantity] || 0;
      newRemaining[key] = Math.max(0, current - sold); // Ensure never negative
    });

    const { data: updatedProduction, error } = await supabase
      .from("productions")
      .update({ remaining_bread: newRemaining })
      .eq("id", productionId)
      .select();

    if (error) {
      console.error("Error updating remaining_bread:", error);
      throw new Error("Failed to update remaining_bread");
    }

    await revalidateTag("productions", {});

    return {
      status: "SUCCESS",
      data: updatedProduction[0],
      previousRemaining: currentRemaining,
      newRemaining,
    };
  } catch (error) {
    console.error("Unexpected error in updateRemainingBread:", error);
    return { status: "ERROR", error: String(error) };
  }
};

/**
 * Calculate the total monetary value of bread quantities based on current bread prices
 * @param breadQuantities - Object containing quantities by color (e.g., { orange: 10, blue: 5, green: 3 })
 * @returns Total monetary value
 */
export const calculateBreadTotal = async (
  breadQuantities: { [key: string]: number } | null | undefined
): Promise<number> => {
  try {
    if (!breadQuantities) return 0;

    // Get current bread prices
    const breadPrices = await getBreadPriceMultipliers();

    // Calculate total by multiplying each quantity by its price
    let total = 0;
    Object.entries(breadQuantities).forEach(([color, quantity]) => {
      const price = breadPrices[color.toLowerCase()] || 0;
      total += quantity * price;
    });

    return total;
  } catch (error) {
    console.error("Error calculating bread total:", error);
    return 0;
  }
};
