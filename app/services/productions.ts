"use server";
import supabase from "@/client";

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
    return { status: "SUCCESS", error: "", res: ProductionData[0] };
  } catch (error) {
    console.log("create production error>>>>>>>>, error");
    throw new Error(String(error));
  }
};
