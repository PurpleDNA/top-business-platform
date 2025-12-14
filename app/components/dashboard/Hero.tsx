"use client";
import React from "react";

const Hero = ({ profile }: { profile: Record<string, string> }) => {
  return (
    <div className="space-y-2">
      <h1 className="text-xl lg:text-3xl font-bold text-foreground">
        Welcome back, {profile?.first_name || "User"} 👋
      </h1>
      <p className="text-muted-foreground">
        Here&apos;s what&apos;s happening with your business today.
      </p>
    </div>
  );
};

export default Hero;
