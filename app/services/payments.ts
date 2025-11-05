"use server";
import supabase from "@/client";
import { revalidateTag } from "next/cache";
import { fetchSaleById, Sale } from "./sales";

export interface Payment {
  id: number;
  paid_at: string;
  customer_id: string;
  production_id: string;
  amount: number;
  sale_id: string;
  type: string;
}

export interface Create {
  customerId: string;
  amountPaid: number;
  saleId?: string;
  productionId: string | null;
  type: string;
}

export async function getPaymentById(paymentId: string) {
  try {
    const { data: payment, error } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (error) {
      console.error("Error fetching payment by ID:", error);
      return null;
    }

    return payment;
  } catch (error) {
    console.error("Unexpected error in getPaymentById:", error);
    return null;
  }
}

export interface PaymentWithDetails {
  id: string;
  amount: number;
  paid_at: string;
  customer_id: string;
  production_id: string | null;
  sale_id: string | null;
  type: string;
  customers: {
    id: string;
    name: string;
  };
  productions: {
    id: string;
    created_at: string;
  } | null;
}

export async function getAllPaymentsWithDetails() {
  try {
    const { data: payments, error } = await supabase
      .from("payments")
      .select(
        `
        id,
        amount,
        paid_at,
        customer_id,
        production_id,
        sale_id,
        type,
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
      .order("paid_at", { ascending: false });

    if (error) {
      console.error("Error fetching payments with details:", error);
      return [];
    }

    return (payments as unknown as PaymentWithDetails[]) || [];
  } catch (error) {
    console.error("Unexpected error in getAllPaymentsWithDetails:", error);
    return [];
  }
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
        sale_id: payload.saleId,
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
      type: "after",
    });

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

export const updatePayment = async (
  paymentId: string,
  payload: Partial<Create>
) => {
  try {
    const payment = (await getPaymentById(paymentId)) as unknown as Payment;

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (!payload.amountPaid) {
      throw new Error("Amount paid is required for update");
    }

    const oldAmount = payment.amount;
    const newAmount = payload.amountPaid;

    // Payment has no sale_id (distributed payment)
    if (!payment.sale_id) {
      // Calculate the difference
      const difference = newAmount - oldAmount;

      if (difference < 0) {
        const amountToReverse = Math.abs(difference);
        const { error: reverseError } = await supabase.rpc("reverse_payment", {
          p_customer_id: payment.customer_id,
          p_amount_to_reverse: amountToReverse,
        });

        if (reverseError) {
          console.error("Reverse Payment Error:", reverseError);
          throw new Error("Failed to reverse payment: " + reverseError.message);
        }
      } else if (difference > 0) {
        // New value is greater: distribute the additional amount
        const { error: distributeError } = await supabase.rpc(
          "distribute_payment_across_sales",
          {
            p_customer_id: payment.customer_id,
            p_amount_paid: difference,
          }
        );

        if (distributeError) {
          console.error("Distribute Payment Error:", distributeError);
          throw new Error(
            "Failed to distribute payment: " + distributeError.message
          );
        }
      }
    } else {
      // Payment has a sale_id (single sale payment)
      const difference = newAmount - oldAmount;
      const sale = (await fetchSaleById(payment.sale_id)) as unknown as Sale;

      if (!sale) {
        throw new Error("Sale not found");
      }

      const newSaleAmountPaid = sale.amount_paid + difference;
      const newOutstanding = sale.amount - newSaleAmountPaid;

      const { error: updateSaleError } = await supabase
        .from("sales")
        .update({
          amount_paid: newSaleAmountPaid,
          outstanding:
            payment.type === "on_demand" ? newOutstanding : sale.outstanding,
        })
        .eq("id", payment.sale_id);

      if (updateSaleError) {
        throw new Error("Failed to update sale amount paid");
      }
    }

    // Update the payment record
    const { data: updatedPayment, error } = await supabase
      .from("payments")
      .update({ amount: newAmount })
      .eq("id", paymentId)
      .select();

    if (error) {
      throw new Error("Failed to update payment");
    }

    revalidateTag("payments", {});
    revalidateTag("customers", {});
    revalidateTag("productions", {});
    revalidateTag("sales", {});

    return { status: "SUCCESS", error: "", data: updatedPayment };
  } catch (error) {
    console.log("update payment error >>>>>>", error);
    throw new Error("Unexpected Error Occured");
  }
};

export const deletePayment = async (paymentId: string) => {
  try {
    const payment = (await getPaymentById(paymentId)) as unknown as Payment;

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Payment has no sale_id (distributed payment)
    if (!payment.sale_id) {
      // Reverse the entire payment using RPC function
      const { error: reverseError } = await supabase.rpc("reverse_payment", {
        p_customer_id: payment.customer_id,
        p_amount_to_reverse: payment.amount,
      });

      if (reverseError) {
        console.error("Reverse Payment Error:", reverseError);
        throw new Error("Failed to reverse payment: " + reverseError.message);
      }
    } else {
      const { data: sale, error: getSaleError } = await supabase
        .from("sales")
        .select("amount, amount_paid")
        .eq("id", payment.sale_id)
        .single();

      if (getSaleError) {
        throw new Error("Failed to fetch sale");
      }

      // Deduct the payment amount from the sale's amount_paid
      const newAmountPaid = (sale.amount_paid || 0) - payment.amount;
      const newOutstanding = sale.amount - newAmountPaid;

      // Update the sale
      const { error: updateSaleError } = await supabase
        .from("sales")
        .update({
          amount_paid: newAmountPaid,
          outstanding: newOutstanding,
        })
        .eq("id", payment.sale_id);

      if (updateSaleError) {
        throw new Error("Failed to update sale after payment deletion");
      }
    }

    // Delete the payment
    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", paymentId);

    if (error) {
      throw new Error("Delete Payment Error");
    }

    revalidateTag("payments", {});
    revalidateTag("customers", {});
    revalidateTag("productions", {});
    revalidateTag("sales", {});

    return { status: "SUCCESS", error: "" };
  } catch (error) {
    console.log("delete payment error >>>>>>", error);
    throw new Error("Unexpected Error Occured");
  }
};
