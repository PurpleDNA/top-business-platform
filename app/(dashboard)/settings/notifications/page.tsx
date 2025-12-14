"use client";

import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const notificationSettings = [
  {
    category: "Production",
    items: [
      {
        id: "prod-created",
        label: "New Production Created",
        description: "Get notified when a new production is added",
      },
      {
        id: "prod-complete",
        label: "Production Completed",
        description: "Alert when production is marked complete",
      },
    ],
  },
  {
    category: "Sales",
    items: [
      {
        id: "sale-created",
        label: "New Sale Recorded",
        description: "Notification for each new sale",
      },
      {
        id: "payment-received",
        label: "Payment Received",
        description: "Alert when payment is received",
      },
      {
        id: "outstanding-reminder",
        label: "Outstanding Payment Reminders",
        description: "Daily reminders for pending payments",
      },
    ],
  },
  {
    category: "System",
    items: [
      {
        id: "sys-updates",
        label: "System Updates",
        description: "Important system and feature updates",
      },
      {
        id: "security-alerts",
        label: "Security Alerts",
        description: "Notifications about security events",
      },
    ],
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Notification Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your notification preferences
        </p>
      </div>

      <div className="space-y-6">
        {notificationSettings.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {section.category} Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex-1 pr-4">
                    <Label htmlFor={item.id} className="font-medium cursor-pointer">
                      {item.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch id={item.id} defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
