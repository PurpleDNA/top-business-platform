import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  UserPlus,
  FileText,
  CircleDollarSign,
  Mail,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";

export const QuickActions = () => {
  const actions = [
    {
      icon: UserPlus,
      label: "Add Customer",
      description: "Create new customer profile",
      variant: "default" as const,
      to: "/customers/new",
    },
    {
      icon: FileText,
      label: "New Production",
      description: "Create new production",
      variant: "outline" as const,
      to: "/production/new",
    },
    {
      icon: BriefcaseBusiness,
      label: "New Sale",
      description: "Create New Sale",
      variant: "outline" as const,
      to: "/sale/new",
    },
    {
      icon: CircleDollarSign,
      label: "New Payment",
      description: "Create New Payment",
      variant: "outline" as const,
      to: "payment/new",
    },
    {
      icon: Mail,
      label: "Send Campaign",
      description: "Email marketing campaign",
      variant: "outline" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              variant={action.variant}
              className="w-full justify-start h-auto p-4 text-background cursor-pointer"
              key={action.label}
            >
              <Link
                href={action.to || ""}
                className="p-4 h-auto justify-start w-full"
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-foreground" />
                  <div className="text-left">
                    <div className="font-medium text-foreground">
                      {action.label}
                    </div>
                    <div className="text-xs text-foreground mt-1">
                      {action.description}
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
