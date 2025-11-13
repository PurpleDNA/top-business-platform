"use server";
import supabase from "@/client";
import { revalidatePath, unstable_cache, updateTag } from "next/cache";
import { getBreadPriceMultipliers } from "./bread_price";
import { toast } from "sonner";

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
  sold_bread: {
    blue: number;
    green: number;
    orange: number;
    [key: string]: number; // allows future extensions
  };
  bread_price: {
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
  quantity: Record<string, string>;
  total: string;
  old_bread: Record<string, string>;
}

interface PaymentWithCustomer {
  amount_paid: number;
  customer_id: string;
  customers: {
    id: string;
    name: string;
  } | null;
}

interface SaleWithCustomer {
  outstanding: number;
  paid: boolean;
  customer_id: string;
  customers: {
    id: string;
    name: string;
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

    const sold_bread: { [key: string]: number } = {};
    Object.keys(quantity).forEach((key) => {
      sold_bread[key] = 0;
    });

    const { data: ProductionData, error } = await supabase
      .from("productions")
      .insert({
        quantity: quantity,
        total: Number(payload.total),
        old_bread: old_bread,
        sold_bread: sold_bread,
        open: true,
      })
      .select();

    if (error) {
      throw new Error("Create Production Error");
    }

    revalidatePath("/production/all");
    updateTag("productions");
    updateTag("last10");

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

export const getLast10Productions = unstable_cache(
  async () => {
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
  },
  [],
  { tags: ["last10"] }
);

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

/**
 * Check if a production is closed (not open)
 * @param productionId - The production ID to check
 * @returns Object with isClosed boolean and optional error message
 */
export const checkProductionClosed = async (
  productionId: string | null | undefined
) => {
  try {
    // If no production ID provided, it's valid (e.g., payments without production_id)
    if (!productionId) {
      return { isClosed: false, error: null };
    }

    const production = await getProductionById(productionId);

    if (!production) {
      return {
        isClosed: true,
        error: "Production not found",
      };
    }

    if (!production.open) {
      return {
        isClosed: true,
        error: "Production is closed",
      };
    }

    return { isClosed: false, error: null };
  } catch (error) {
    console.error("Error checking production closure:", error);
    return {
      isClosed: true,
      error: "Failed to verify production status",
    };
  }
};

export const fetchAllProductions = unstable_cache(
  async (): Promise<Production[] | []> => {
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
  },
  [],
  { tags: ["productions"] }
);

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

    // Prepare update payload
    const updatePayload: {
      open: boolean;
      bread_price?: { [key: string]: number };
    } = {
      open: newStatus,
    };

    // If closing the production (newStatus is false), set the current bread prices
    if (!newStatus) {
      const currentBreadPrices = await getBreadPriceMultipliers();
      updatePayload.bread_price = currentBreadPrices;
    }

    // Update the production with the new status and bread_price if closing
    const { data: updatedProduction, error: updateError } = await supabase
      .from("productions")
      .update(updatePayload)
      .eq("id", productionId)
      .select();

    if (updateError) {
      console.error("Error updating production status:", updateError);
      throw new Error("Failed to update production status");
    }

    updateTag("productions");

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
    // Check if production is closed
    const closureCheck = await checkProductionClosed(productionId);
    if (closureCheck.isClosed) {
      toast.error("Production cannot be updated because it is closed");
      throw new Error(`Production cannot be updated because it is closed`);
    }

    const { data: updatedProduction, error } = await supabase
      .from("productions")
      .update(payload)
      .eq("id", productionId)
      .select();

    if (error) {
      console.error("Error updating production:", error);
      throw new Error("Failed to update production");
    }
    revalidatePath("/productions/all");
    updateTag("productions");

    return { status: "SUCCESS", data: updatedProduction[0] };
  } catch (error) {
    console.error("Unexpected error in updateProduction:", error);
    return { status: "ERROR", error: String(error) };
  }
};

export const updateSoldBread = async (
  productionId: string,
  soldQuantity: { orange?: number; blue?: number; green?: number }
) => {
  try {
    const production = await getProductionById(productionId);

    if (!production || !production.sold_bread) {
      console.error("Production not found or has no sold_bread");
      return { status: "ERROR", error: "Production not found" };
    }

    const currentSold = production.sold_bread;
    const newSold: { [key: string]: number } = {};

    Object.keys(currentSold).forEach((key) => {
      const current = currentSold[key] || 0;
      const sold = soldQuantity[key as keyof typeof soldQuantity] || 0;
      newSold[key] = Math.max(0, current + sold);
    });

    const { data: updatedProduction, error } = await supabase
      .from("productions")
      .update({ sold_bread: newSold })
      .eq("id", productionId)
      .select();

    if (error) {
      console.error("Error updating sold_bread:", error);
      throw new Error("Failed to update sold_bread");
    }

    updateTag("productions");

    return {
      status: "SUCCESS",
      data: updatedProduction[0],
      previousSold: currentSold,
      newSold,
    };
  } catch (error) {
    console.error("Unexpected error in updateSoldBread:", error);
    return { status: "ERROR", error: String(error) };
  }
};

export const calculateBreadTotal = async (
  breadQuantities: { [key: string]: number } | null | undefined,
  production?: Production | null
): Promise<number> => {
  try {
    if (!breadQuantities) return 0;

    // Get bread prices from production.bread_price if available, otherwise get current prices
    let breadPrices: { [key: string]: number };

    if (production && production.bread_price) {
      breadPrices = production.bread_price;
    } else {
      // Fallback to current bread prices
      breadPrices = await getBreadPriceMultipliers();
    }

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

export const deleteProduction = async (productionId: string) => {
  try {
    // Check if production is closed
    const closureCheck = await checkProductionClosed(productionId);
    if (closureCheck.isClosed) {
      toast.error("Production cannot be deleted because it is closed");
      throw new Error(`Production cannot be deleted because it is closed`);
    }

    const { error } = await supabase
      .from("productions")
      .delete()
      .eq("id", productionId);

    if (error) {
      throw new Error("Delete Production Error");
    }
    revalidatePath("/productions/all");
    updateTag("productions");

    return { status: "SUCCESS", error: "" };
  } catch (error) {
    console.log("delete production error>>>>>>>>:", error);
    throw new Error("Unexpected Error Occured");
  }
};
