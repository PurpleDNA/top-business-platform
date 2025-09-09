"use client";
import { useAuth } from "@/app/providers/auth-provider";
import React from "react";

const Hero = () => {
  const { profile } = useAuth();
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">
        Welcome back, {profile?.profile?.first_name} 👋
      </h1>
      <p className="text-muted-foreground">
        Here&apos;s what&apos;s happening with your business today.
      </p>
    </div>
  );
};

export default Hero;
