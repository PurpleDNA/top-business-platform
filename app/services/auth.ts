/* eslint-disable @typescript-eslint/no-explicit-any */
import supabase from "@/client";

export const createUser = async (authData: any, payload: any) => {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: payload.email,
        first_name: payload.firstName,
        last_name: payload.lastName,
        display_name: `${payload.firstName} ${payload.lastName}`,
        role: "user", // default role
      });
    if (userError) {
      throw new Error("User profile error:", userError);
    }
  } catch (error) {
    console.log(error);
  }
};
