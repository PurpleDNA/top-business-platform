"use client";

import { User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your personal information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg">JD</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="h-4 w-4" />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or GIF. Max 2MB
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  defaultValue="John"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  defaultValue="Doe"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                defaultValue="john@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 xxx xxx xxxx"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                placeholder="Top Business"
                className="mt-1"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button className="w-full">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
