"use server";
import supabase from "@/client";

export interface Payments {
  id: string;
  paidAt: string;
  customerId: string;
  amountPaid: number;
}

export interface Create {
  customerId: string;
  amountPaid: number;
  saleId?: string;
}

export async function getPaymentsByCustomerID(
  customerId: string,
  limit: number = 10,
  page: number = 1
) {
  try {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .eq("customer_id", customerId)
      .order("paid_at", { ascending: false })
      .range(start, end)
      .select();

    if (error) {
      console.error("Error fetching customer by ID:", error);
      return null;
    }

    return payments;
  } catch (error) {
    console.error("Unexpected error in fetchCustomerById:", error);
    return null;
  }
}

export async function addPayment(payload: Create) {
  try {
    const { data: paymentData, error } = await supabase
      .from("payments")
      .insert({
        amount_paid: payload.amountPaid,
        customer_id: payload.customerId,
      })
      .select();

    if (error) {
      console.error("Add Payment Error:", error);
      throw new Error("Database Error Occured");
    }
    return { status: "SUCCESS", error: "", res: paymentData[0] };
  } catch (error) {
    console.error("Unexpected error in Add Payment:", error);
    throw error;
  }
}
