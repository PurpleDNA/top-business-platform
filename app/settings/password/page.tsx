"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">Change Password</h2>
        <p className="text-sm text-muted-foreground">
          Update your account password for security
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative mt-1">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full">
                Update Password
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <h4 className="font-semibold text-sm mb-2">Password Requirements</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains at least one uppercase letter</li>
              <li>• Contains at least one number</li>
              <li>• Contains at least one special character</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
