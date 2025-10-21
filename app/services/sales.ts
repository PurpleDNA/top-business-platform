import supabase from "@/client";

interface CreateSale {
  customer_id: string;
  production_id: string;
  amount: string;
  paid: boolean;
  remaining: number;
}

interface Sale {
  customer_id: string;
  production_id: string;
  amount: number;
  paid: boolean;
  remaining: number;
  outstanding?: number;
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

export const fetchSaleById = async (saleId: string) => {
  try {
    const { data: sale, error } = await supabase
      .from("sales")
      .select("*")
      .eq("id", saleId);

    if (error) {
      throw new Error("Error fetching sale by ID:", error);
    }

    return sale;
  } catch (error) {
    console.error("Unexpected error in fetchSaleById:", error);
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

export const createNewSale = async (payload: CreateSale) => {
  try {
    const { data: saleData, error } = await supabase
      .from("sales")
      .insert({
        customer_id: payload.customer_id,
        production_id: payload.production_id,
        amount: Number(payload.amount),
        paid: payload.paid,
        remaining: payload.remaining,
        outstanding: payload.remaining,
      })
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

export const updateSale = async (saleId: string, payload: Sale) => {
  try {
    const { data: updatedSale, error } = await supabase
      .from("sales")
      .update(payload)
      .eq("id", saleId)
      .select();

    if (error) {
      throw new Error("update sale error");
    }
    console.log(updateSale);
    return { status: "SUCCESS", error: "", data: updatedSale };
  } catch (error) {
    console.log("update sale error >>>>>>", error);
    throw new Error("Unexpected Error Occured");
  }
};
