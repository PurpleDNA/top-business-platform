"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface RemainingBreadDropdownProps {
  quantity: {
    orange: number;
    blue: number;
    green: number;
    [key: string]: number;
  };
  oldBread: {
    orange: number;
    blue: number;
    green: number;
    [key: string]: number;
  };
  soldBread: {
    orange: number;
    blue: number;
    green: number;
    [key: string]: number;
  };
  remainingBreadTotal: number;
}

export const RemainingBreadDropdown = ({
  quantity,
  oldBread,
  soldBread,
  remainingBreadTotal,
}: RemainingBreadDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate remaining bread: quantity + old_bread - sold_bread
  const remainingBread: { [key: string]: number } = {};
  Object.keys(quantity).forEach((color) => {
    remainingBread[color] =
      (quantity[color] || 0) + (oldBread[color] || 0) - (soldBread[color] || 0);
  });

  // Convert remaining_bread object to array for easier display
  const breadItems = Object.entries(remainingBread).map(([color, quantity]) => ({
    color,
    quantity,
  }));

  // Calculate total units
  const totalUnits = breadItems.reduce((sum, item) => sum + item.quantity, 0);

  // Color styling helper
  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
    };
    return colorMap[color.toLowerCase()] || "bg-gray-500";
  };

  return (
    <Card>
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-lg font-semibold">
          Remaining Bread
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {totalUnits} {totalUnits === 1 ? "unit" : "units"}
          </span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          {breadItems.length === 0 || totalUnits === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No remaining bread</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {breadItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 border"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-3 w-3 rounded-full ${getColorClass(
                          item.color
                        )}`}
                      ></div>
                      <span className="font-medium capitalize">
                        {item.color}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {item.quantity.toLocaleString()} units
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="font-semibold text-sm">
                    Total Value
                  </span>
                  <span className="font-bold text-lg">
                    ₦{remainingBreadTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
};
