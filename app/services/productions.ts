"use server";
import supabase from "@/client";
import { revalidateTag } from "next/cache";

export interface Production {
  id: string;
  quantity: {
    blue: number;
    green: number;
    orange: number;
    [key: string]: number; // allows future extensions
  };
  total: number;
  break_even: boolean;
  short_or_excess: boolean;
  short_amount: number;
  excess_amount: number;
  expenses_total: number;
  cash: number;
  outstanding: number;
  created_at: string;
  updated_at: string;
  paid_outstanding: number;
}

interface Create {
  quantity: {
    orange: string;
    blue: string;
    green: string;
  };
  total: string;
  expenses_total?: string;
  outstanding?: string;
}

export const createProduction = async (payload: Create) => {
  try {
    const quantity = Object.fromEntries(
      Object.entries(payload.quantity).map(([key, value]) => [
        key,
        Number(value),
      ])
    );
    const { data: ProductionData, error } = await supabase
      .from("productions")
      .insert({
        quantity: quantity,
        total: Number(payload.total),
        expenses_total: Number(payload.expenses_total || 0),
        outstanding: Number(payload.outstanding || 0),
      })
      .select();

    if (error) {
      throw new Error("Create Production Error");
    }
    revalidateTag("last10");

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

export const getLast10Productions = async () => {
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
};

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
