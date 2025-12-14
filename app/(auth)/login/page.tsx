import LoginForm from "@/app/components/login/LoginForm";
import SignupForm from "@/app/components/login/SignupForm";
import { getUser } from "@/app/services/roles";

export default async function LoginPage() {
  const user = await getUser();

  return (
    <div className="min-h-screen py-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-32 bg-gradient-to-br from-slate-50 via-amber-50 to-purple-200 dark:from-slate-900 dark:via-purple-950 dark:to-slate-950">
      <SignupForm />
      <LoginForm user={user} />
    </div>
  );
}
