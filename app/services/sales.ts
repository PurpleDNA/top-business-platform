import supabase from "@/client";

interface Sale {
  customer_id: string;
  production_id: string;
  amount: number;
  paid: boolean;
}

export const fetchAllSales = async () => {
  try {
    const { data: sales, error } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });
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

export const fetchSalesByProductionId = async (productionId: string) => {
  try {
    const { data: sales, error } = await supabase
      .from("sales")
      .select("*")
      .eq("production_id", productionId);

    if (error) {
      throw error;
    }

    return sales;
  } catch (error) {
    console.error("Unexpected error in fetchSalesByProductionId:", error);
  }
};

export const createNewSale = async (payload: Sale) => {
  try {
    const { data: saleData, error } = await supabase
      .from("sales")
      .insert(payload)
      .select();

    if (error) {
      throw new Error("Create Customer Error");
    }
    return { status: "SUCCESS", error: "", res: saleData[0] };
  } catch (error) {
    console.log("create sale error>>>>>>", error);
    throw new Error("Unexpected Error Occured");
  }
};
