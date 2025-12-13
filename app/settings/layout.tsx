"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsList } from "./components/SettingsList";
import { useAuth } from "../providers/auth-provider";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isSettingsHome = pathname === "/settings";
  const {isSuper} = useAuth();
  return (
    <div className="h-full bg-background">
      {/* Desktop Layout - Split View */}
      <div className="hidden md:flex h-full">
        {/* Left Sidebar - Settings List */}
        <div className="w-80 border-r border-border overflow-y-auto scrollbar-hide">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Manage your account and preferences
            </p>
            <SettingsList isSuper={isSuper}/>
          </div>
        </div>

        {/* Right Content - Selected Setting */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-6">{children}</div>
        </div>
      </div>

      {/* Mobile Layout - Full Page */}
      <div className="md:hidden">
        {isSettingsHome ? (
          /* Settings List View */
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">Settings</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Manage your account and preferences
            </p>
            <SettingsList isSuper={isSuper} />
          </div>
        ) : (
          /* Setting Detail View with Back Button */
          <div>
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center gap-3 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/settings")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold">Back to Settings</h2>
            </div>
            <div className="p-4">{children}</div>
          </div>
        )}
      </div>
    </div>
  );
}
