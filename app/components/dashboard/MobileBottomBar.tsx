"use client";

import {
  Users,
  Factory,
  Home,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MobileBottomBar = () => {
  const pathname = usePathname();

  // Hide on login page
  if (pathname === "/login") {
    return null;
  }

  const actions = [
    {
      icon: Home,
      label: "Dashboard",
      to: "/",
    },
    {
      icon: Users,
      label: "Customers",
      to: "/customers/all",
    },
    {
      icon: Factory,
      label: "Productions",
      to: "/productions/all",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border shadow-lg">
      <div className="flex items-center justify-around px-2 py-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isActive = pathname === action.to;

          return (
            <Link
              key={action.label}
              href={action.to}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
