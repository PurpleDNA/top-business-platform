import supabase from "@/client";

interface Customer {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  debt_free: boolean;
  total_debt: number;
  payment_history: {
    date: string;
    amount_paid: number;
  }[];
  created_at: string;
}

export const fetchAllCustomers = async (): Promise<Customer[] | []> => {
  try {
    const { data: customers, error } = await supabase
      .from("customers")
      .select("*");

    if (error) {
      console.error("Error fetching customers:", error);
      return [];
    }

    return customers;
  } catch (error) {
    console.error("Unexpected error in fetchAllCustomers:", error);
    return [];
  }
};

export const fetchCustomerById = async (id: string) => {
  try {
    const { data: customer, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching customer by ID:", error);
      return null;
    }

    return customer;
  } catch (error) {
    console.error("Unexpected error in fetchCustomerById:", error);
    return null;
  }
};

export const fetchCustomerTotalSpent = async (customerId: string) => {
  try {
    const { data, error } = await supabase.rpc(
      "calculate_customer_total_spent",
      {
        customer_uuid: customerId,
      }
    );
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching total customer spent:", error);
    return 0;
  }
};
