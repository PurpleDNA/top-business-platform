import { getUsers } from "@/app/services/users";
import { getCurrentUserRole } from "@/app/services/roles";
import { createClient } from "@/supabase/server";
import UserManagementClient from "./client";

export default async function ManageRolesPage() {
  const users = await getUsers();
  // We fetch the current user role to determine what UI elements to show
  const role = await getCurrentUserRole();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <div className="max-w-6xl mx-auto py-8">
      <UserManagementClient 
        initialUsers={users} 
        currentUserRole={role} 
        currentUserId={user?.id}
      />
    </div>
  );
}
