"use client";

import { Globe, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá" },
  { code: "ig", name: "Igbo", nativeName: "Igbo" },
  { code: "ha", name: "Hausa", nativeName: "Hausa" },
];

const timezones = [
  "Africa/Lagos (UTC+01:00)",
  "Africa/Accra (UTC+00:00)",
  "Africa/Cairo (UTC+02:00)",
  "Europe/London (UTC+00:00)",
  "America/New_York (UTC-05:00)",
];

export default function LanguageRegionPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Language & Region</h2>
        <p className="text-sm text-muted-foreground">
          Set your language and regional preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-sm mb-3 block">Select your language</Label>
            <div className="grid gap-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-colors",
                    language.code === "en"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="text-left">
                    <p className="font-medium">{language.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {language.nativeName}
                    </p>
                  </div>
                  {language.code === "en" && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Timezone</Label>
              <select className="w-full p-2 rounded-lg border border-border bg-background">
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-sm mb-2 block">Currency Format</Label>
              <select className="w-full p-2 rounded-lg border border-border bg-background">
                <option value="ngn">₦ Nigerian Naira (NGN)</option>
                <option value="usd">$ US Dollar (USD)</option>
                <option value="eur">€ Euro (EUR)</option>
                <option value="gbp">£ British Pound (GBP)</option>
              </select>
            </div>

            <div>
              <Label className="text-sm mb-2 block">Date Format</Label>
              <select className="w-full p-2 rounded-lg border border-border bg-background">
                <option value="dmy">DD/MM/YYYY</option>
                <option value="mdy">MM/DD/YYYY</option>
                <option value="ymd">YYYY-MM-DD</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
