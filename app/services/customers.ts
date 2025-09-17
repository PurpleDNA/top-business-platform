/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import supabase from "@/client";
import { toast } from "sonner";
export interface Customer {
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
  updated_at: string;
}

interface Create {
  name: string;
  phoneNumber: string;
  hasDebt: boolean;
  debtAmount?: string;
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

export const createCustomer = async (payload: Create) => {
  try {
    const { data: customerData, error } = await supabase
      .from("customers")
      .insert({
        name: payload.name,
        phone_number: payload.phoneNumber,
        debt_free: !payload.hasDebt,
        total_debt: Number(payload.debtAmount) || 0,
      })
      .select();

    if (error) {
      throw new Error("Create Customer Error");
    }
    return { status: "SUCCESS", error: "", res: customerData[0] };
  } catch (error) {
    console.log("create customer error>>>>>>>>", error);
    throw new Error("Unexpected Error Occured");
  }
};

export const searchCustomers = async (searchTerm: string) => {
  if (!searchTerm || searchTerm.length < 2) {
    return []; // Don't search for very short terms
  }

  try {
    const { data, error } = await supabase.rpc("search_customers", {
      search_term: searchTerm,
    });

    if (error) {
      console.error("Error searching customers:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};
