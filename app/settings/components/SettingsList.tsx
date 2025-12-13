"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  DollarSign,
  Shield,
  Lock,
  Bell,
  User,
  Palette,
  Globe,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const SettingsList = ({ isSuper }: { isSuper: boolean }) => {
  const settingsItems = [
    ...(isSuper
      ? [
          {
            title: "Bread Pricing",
            description: "Manage bread prices and multipliers",
            href: "/settings/change_price",
            icon: DollarSign,
          },
          {
            title: "Manage Roles",
            description: "Configure user roles and permissions",
            href: "/settings/roles",
            icon: Shield,
          },
        ]
      : []),
    {
      title: "Change Password",
      description: "Update your account password",
      href: "/settings/password",
      icon: Lock,
    },
    {
      title: "Notifications",
      description: "Configure notification preferences",
      href: "/settings/notifications",
      icon: Bell,
    },
    {
      title: "Profile Settings",
      description: "Manage your profile information",
      href: "/settings/profile",
      icon: User,
    },
    {
      title: "Appearance",
      description: "Customize theme and display options",
      href: "/settings/appearance",
      icon: Palette,
    },
    {
      title: "Language & Region",
      description: "Set your language and regional preferences",
      href: "/settings/language",
      icon: Globe,
    },
    {
      title: "Email Preferences",
      description: "Manage email notifications and updates",
      href: "/settings/email",
      icon: Mail,
    },
  ];

  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {settingsItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg transition-colors group",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-primary-foreground" : "text-foreground"
                  )}
                >
                  {item.title}
                </p>
                <p
                  className={cn(
                    "text-xs truncate",
                    isActive
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
                  {item.description}
                </p>
              </div>
            </div>
            <ChevronRight
              className={cn(
                "h-4 w-4 flex-shrink-0 md:hidden",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
};
