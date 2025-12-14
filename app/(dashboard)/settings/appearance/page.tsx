"use client";

import { Palette, Monitor, Sun, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Clean and bright interface",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Follow system preference",
    },
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Customize how the app looks and feels
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Preference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label className="text-sm mb-3 block">Choose your theme</Label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = theme === themeOption.value;

              return (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-8 w-8",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <div className="text-center">
                    <p className="font-medium text-sm">{themeOption.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {themeOption.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="font-medium">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce spacing between elements
                </p>
              </div>
              <div className="text-sm text-muted-foreground">Coming soon</div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="font-medium">Font Size</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust text size across the app
                </p>
              </div>
              <div className="text-sm text-muted-foreground">Coming soon</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
