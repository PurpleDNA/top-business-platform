"use client";

import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const emailPreferences = [
  {
    id: "newsletter",
    label: "Newsletter",
    description: "Receive our weekly newsletter with tips and updates",
  },
  {
    id: "product-updates",
    label: "Product Updates",
    description: "Get notified about new features and improvements",
  },
  {
    id: "tips-tutorials",
    label: "Tips & Tutorials",
    description: "Learn how to get the most out of the platform",
  },
  {
    id: "special-offers",
    label: "Special Offers",
    description: "Receive exclusive promotions and discounts",
  },
];

const transactionalEmails = [
  {
    id: "receipts",
    label: "Transaction Receipts",
    description: "Email receipts for all transactions",
    disabled: true,
  },
  {
    id: "reminders",
    label: "Payment Reminders",
    description: "Automated reminders for outstanding payments",
  },
  {
    id: "reports",
    label: "Weekly Reports",
    description: "Summary of your weekly business activity",
  },
];

export default function EmailPreferencesPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Email Preferences</h2>
        <p className="text-sm text-muted-foreground">
          Manage what emails you receive from us
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Marketing Emails
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailPreferences.map((pref) => (
              <div
                key={pref.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex-1 pr-4">
                  <Label htmlFor={pref.id} className="font-medium cursor-pointer">
                    {pref.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {pref.description}
                  </p>
                </div>
                <Switch id={pref.id} defaultChecked />
              </div>
            ))}
            <div className="pt-2">
              <Button variant="outline" size="sm">
                Unsubscribe from all marketing
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactional Emails</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              These emails are important for the operation of your account
            </p>
            {transactionalEmails.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex-1 pr-4">
                  <Label
                    htmlFor={email.id}
                    className={`font-medium ${email.disabled ? "" : "cursor-pointer"}`}
                  >
                    {email.label}
                    {email.disabled && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (Required)
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {email.description}
                  </p>
                </div>
                <Switch
                  id={email.id}
                  defaultChecked
                  disabled={email.disabled}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
