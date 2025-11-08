"use server";
import supabase from "@/client";
import { revalidateTag } from "next/cache";
import { checkProductionClosed } from "./productions";
import { toast } from "sonner";

export interface Expense {
  id: string;
  production_id: string;
  expense: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

interface CreateExpense {
  production_id: string;
  expense: string;
  amount: number;
}

export const createExpense = async (payload: CreateExpense) => {
  try {
    const { data: expenseData, error } = await supabase
      .from("expenses")
      .insert({
        production_id: payload.production_id,
        expense: payload.expense,
        amount: payload.amount,
      })
      .select();

    if (error) {
      console.error("Create Expense Error:", error);
      throw new Error("Failed to create expense");
    }

    await revalidateTag("expenses", {});

    return { status: "SUCCESS", error: "", data: expenseData[0] };
  } catch (error) {
    console.error("Unexpected error in createExpense:", error);
    throw new Error(String(error));
  }
};

export const updateExpense = async (
  expenseId: string,
  payload: Partial<CreateExpense>
) => {
  try {
    // First, get the expense to check its production_id
    const { data: existingExpense, error: fetchError } = await supabase
      .from("expenses")
      .select("production_id")
      .eq("id", expenseId)
      .single();

    if (fetchError || !existingExpense) {
      throw new Error("Expense not found");
    }

    // Check if production is closed
    const closureCheck = await checkProductionClosed(existingExpense.production_id);
    if (closureCheck.isClosed) {
      toast.error("Expense cannot be updated because the production is closed");
      throw new Error(
        `Expense cannot be updated because the production is closed`
      );
    }

    const { data: updatedExpense, error } = await supabase
      .from("expenses")
      .update(payload)
      .eq("id", expenseId)
      .select();

    if (error) {
      console.error("Update Expense Error:", error);
      throw new Error("Failed to update expense");
    }

    await revalidateTag("expenses", {});

    return { status: "SUCCESS", error: "", data: updatedExpense[0] };
  } catch (error) {
    console.error("Unexpected error in updateExpense:", error);
    throw new Error(String(error));
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    // First, get the expense to check its production_id
    const { data: existingExpense, error: fetchError } = await supabase
      .from("expenses")
      .select("production_id")
      .eq("id", expenseId)
      .single();

    if (fetchError || !existingExpense) {
      throw new Error("Expense not found");
    }

    // Check if production is closed
    const closureCheck = await checkProductionClosed(existingExpense.production_id);
    if (closureCheck.isClosed) {
      toast.error("Expense cannot be deleted because the production is closed");
      throw new Error(
        `Expense cannot be deleted because the production is closed`
      );
    }

    const { error } = await supabase.from("expenses").delete().eq("id", expenseId);

    if (error) {
      console.error("Delete Expense Error:", error);
      throw new Error("Failed to delete expense");
    }

    await revalidateTag("expenses", {});

    return { status: "SUCCESS", error: "" };
  } catch (error) {
    console.error("Unexpected error in deleteExpense:", error);
    throw new Error(String(error));
  }
};

export const getExpensesByProdId = async (
  productionId: string
): Promise<Expense[]> => {
  try {
    const { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("production_id", productionId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching expenses:", error);
      return [];
    }

    return expenses || [];
  } catch (error) {
    console.error("Unexpected error in getExpensesByProdId:", error);
    return [];
  }
};
