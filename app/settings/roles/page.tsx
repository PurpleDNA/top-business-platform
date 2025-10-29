"use client";

import { Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const roles = [
  {
    name: "Administrator",
    description: "Full access to all features and settings",
    users: 2,
    color: "bg-red-500",
  },
  {
    name: "Manager",
    description: "Can manage productions, sales, and view reports",
    users: 5,
    color: "bg-blue-500",
  },
  {
    name: "Staff",
    description: "Can create sales and view assigned productions",
    users: 12,
    color: "bg-green-500",
  },
  {
    name: "Viewer",
    description: "Read-only access to reports and data",
    users: 3,
    color: "bg-gray-500",
  },
];

export default function ManageRolesPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Manage Roles</h2>
          <p className="text-sm text-muted-foreground">
            Configure user roles and permissions
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full ${role.color} flex items-center justify-center`}>
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{role.users} users</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit Permissions
                </Button>
                <Button variant="outline" size="sm">
                  View Users
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
