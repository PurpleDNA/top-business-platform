"use server";
import supabase from "@/client";
import { updateDebtStatus } from "./customers";

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
  productionId: string | null;
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
        production_id: payload.productionId,
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

export interface DistributePaymentResult {
  success: boolean;
  amount_paid: number;
  amount_applied: number;
  amount_remaining: number;
  sales_fully_cleared: number;
  sales_partially_paid: number;
  cleared_sale_ids: string[];
  updated_sale_ids: string[];
  old_debt: number;
  new_debt: number;
}

/**
 * Distributes a payment across multiple unpaid sales for a customer
 * Automatically clears oldest unpaid sales first
 * @param customerId - The customer's UUID
 * @param amountPaid - The amount being paid
 * @returns Summary of what was cleared/updated
 */
export async function distributePaymentAcrossSales(
  customerId: string,
  amountPaid: number,
  productionId: string | null = null
): Promise<{ status: string; error: string; data?: DistributePaymentResult }> {
  try {
    // Call the Supabase function
    const { data, error } = await supabase.rpc(
      "distribute_payment_across_sales",
      {
        p_customer_id: customerId,
        p_amount_paid: amountPaid,
      }
    );

    if (error) {
      console.error("Distribute Payment Error:", error);
      throw new Error("Failed to distribute payment: " + error.message);
    }

    // Also add to payments table
    await addPayment({
      customerId,
      amountPaid,
      productionId,
    });

    await updateDebtStatus(customerId, amountPaid, "addPayment");

    return {
      status: "SUCCESS",
      error: "",
      data: data as DistributePaymentResult,
    };
  } catch (error) {
    console.error("Unexpected error in distributePaymentAcrossSales:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unexpected error occurred";
    return {
      status: "ERROR",
      error: errorMessage,
    };
  }
}
