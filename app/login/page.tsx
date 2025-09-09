import React from "react";
import LoginForm from "@/app/components/login/LoginForm";
import SignupForm from "@/app/components/login/SignupForm";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gap-32 bg-gradient-to-br from-slate-50 via-amber-50 to-purple-200">
      <SignupForm />
      <LoginForm />
    </div>
  );
};

export default page;
