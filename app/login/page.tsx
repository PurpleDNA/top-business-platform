"use client";

import React, { useState } from "react";
import LoginForm from "@/app/components/login/LoginForm";
import SignupForm from "@/app/components/login/SignupForm";
import { useIsMobile } from "../hooks/use-mobile";

const page = () => {
  // const isMobile  = useIsMobile()
  // const [state, setState] = useState("login")
  return (
    <div className="min-h-screen py-10 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-32 bg-gradient-to-br from-slate-50 via-amber-50 to-purple-200">
      <SignupForm />
      <LoginForm />
    </div>
  );
};

export default page;
