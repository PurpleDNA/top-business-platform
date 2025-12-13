import { createClient } from "@/supabase/server";

export async function getCurrentUserRole() {
  const supabase = await createClient();
  const {
    data:{user},
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return userProfile?.role as string | null;
}

export async function isSuperAdmin() {
  const role = await getCurrentUserRole();
  return role === "super-admin";
}

export async function isAdmin() {
    const role = await getCurrentUserRole();
    return role === "admin" || role === "super-admin";
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data:{user},
  } = await supabase.auth.getUser();

  console.log("user>>>>>>>>",user)

  if (!user) return null;

  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return userProfile;
}