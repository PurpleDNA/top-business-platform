import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, FileText, Calendar, TrendingUp, Mail } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      icon: UserPlus,
      label: "Add Customer",
      description: "Create new customer profile",
      variant: "default" as const,
    },
    {
      icon: FileText,
      label: "New Invoice",
      description: "Generate invoice for client",
      variant: "outline" as const,
    },
    {
      icon: Calendar,
      label: "Schedule Meeting",
      description: "Book customer appointment",
      variant: "outline" as const,
    },
    {
      icon: TrendingUp,
      label: "View Reports",
      description: "Analyze business metrics",
      variant: "outline" as const,
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
              key={action.label}
              variant={action.variant}
              className="w-full justify-start h-auto p-4"
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};