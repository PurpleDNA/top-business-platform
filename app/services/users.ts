/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/supabase/server";
import { adminAuthClient } from "./admin-client";
import { revalidatePath } from "next/cache";
import { isSuperAdmin } from "./roles";

export type UserRole = "super-admin" | "admin" | "user";

export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: string;
  last_sign_in_at?: string;
  created_at?: string;
}

export async function getUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data as UserData[];
}

export async function createUser(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}) {
  try {
    // 1. Strict Authorization Check
    const allowed = await isSuperAdmin();
    if (!allowed) {
      throw new Error("Unauthorized: Only Super Admins can create users.");
    }

    // 2. Create User in Supabase Auth (using Admin Client)
    const { data: authData, error: authError } =
      await adminAuthClient.auth.admin.createUser({
        email: payload.email,
        password: payload.password,
        email_confirm: true,
        user_metadata: {
          display_name: `${payload.firstName} ${payload.lastName}`,
          first_name: payload.firstName,
          last_name: payload.lastName,
        },
      });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create user");

    // 3. Create Profile in 'users' table (using Admin Client to bypass RLS/Policy constraints if needed,
    // although RLS allows Super Admin insert, using Admin Client is safer for consistency)
    const { error: profileError } = await adminAuthClient.from("users").insert({
      id: authData.user.id,
      email: payload.email,
      first_name: payload.firstName,
      last_name: payload.lastName,
      display_name: `${payload.firstName} ${payload.lastName}`,
      role: payload.role,
    });

    if (profileError) {
      // Rollback auth user creation if profile fails?
      // Ideally yes, but for now we throw.
      await adminAuthClient.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    revalidatePath("/settings/roles");
    return { success: true };
  } catch (error: any) {
    console.error("Create User Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUser(
  id: string,
  payload: {
    firstName: string;
    lastName: string;
    role: UserRole;
  }
) {
  try {
    const allowed = await isSuperAdmin();
    if (!allowed) {
      throw new Error("Unauthorized");
    }

    // Update 'users' table
    const { error: profileError } = await adminAuthClient
      .from("users")
      .update({
        first_name: payload.firstName,
        last_name: payload.lastName,
        display_name: `${payload.firstName} ${payload.lastName}`,
        role: payload.role,
      })
      .eq("id", id);

    if (profileError) throw profileError;

    // Update Auth Metadata (optional but good for consistency)
    await adminAuthClient.auth.admin.updateUserById(id, {
      user_metadata: {
        first_name: payload.firstName,
        last_name: payload.lastName,
        display_name: `${payload.firstName} ${payload.lastName}`,
      },
    });

    revalidatePath("/settings/roles");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(id: string) {
  try {
    const allowed = await isSuperAdmin();
    if (!allowed) {
      throw new Error("Unauthorized");
    }

    // Deleting from Auth automatically handles the database if cascading is set up.
    // However, usually we need to delete from Auth.
    const { error } = await adminAuthClient.auth.admin.deleteUser(id);

    if (error) throw error;

    // If no cascade, we manually delete from users table (Admin Client)
    // const { error: dbError } = await adminAuthClient.from("users").delete().eq("id", id);

    revalidatePath("/settings/roles");
    return { success: true };
  } catch (error: any) {
    console.log("ERROR>>>>>>>>>>>", error);
    return { success: false, error: error.message };
  }
}
