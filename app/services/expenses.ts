"use server";
import supabase from "@/client";
import { revalidateTag } from "next/cache";

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

    revalidateTag("expenses");

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
    const { data: updatedExpense, error } = await supabase
      .from("expenses")
      .update(payload)
      .eq("id", expenseId)
      .select();

    if (error) {
      console.error("Update Expense Error:", error);
      throw new Error("Failed to update expense");
    }

    revalidateTag("expenses");

    return { status: "SUCCESS", error: "", data: updatedExpense[0] };
  } catch (error) {
    console.error("Unexpected error in updateExpense:", error);
    throw new Error(String(error));
  }
};

export const deleteExpense = async (expenseId: string) => {
  try {
    const { error } = await supabase.from("expenses").delete().eq("id", expenseId);

    if (error) {
      console.error("Delete Expense Error:", error);
      throw new Error("Failed to delete expense");
    }

    revalidateTag("expenses");

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
