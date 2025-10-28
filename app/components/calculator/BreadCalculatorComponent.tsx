"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw } from "lucide-react";

interface Props {
  multipliers: Record<string, number>;
}

export const BreadCalculatorComponent = ({ multipliers }: Props) => {
  const [quantity, setQuantity] = useState<{
    [key: string]: number | undefined;
  }>({
    orange: undefined,
    blue: undefined,
    green: undefined,
  });

  const [total, setTotal] = useState(0);

  const handleQuantityChange = (name: string, value: string) => {
    const num = Number(value) || 0;

    setQuantity((prevQty) => {
      const updatedQty = {
        ...prevQty,
        [name]: num,
      };

      const calculatedTotal = Object.entries(updatedQty).reduce(
        (sum, [key, val]) => {
          const multiplier = multipliers[key] || 0;
          return sum + Number(val || 0) * multiplier;
        },
        0
      );

      setTotal(calculatedTotal);
      return updatedQty;
    });
  };

  const handleReset = () => {
    setQuantity({
      orange: undefined,
      blue: undefined,
      green: undefined,
    });
    setTotal(0);
  };

  const breadTypes = [
    { name: "orange", label: "Orange", color: "bg-orange-200 dark:bg-orange-500" },
    { name: "blue", label: "Blue", color: "bg-blue-200 dark:bg-blue-500" },
    { name: "green", label: "Green", color: "bg-green-200 dark:bg-green-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculate Total
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bread Type Inputs */}
        <div className="flex justify-around items-center">
          {breadTypes.map((bread) => (
            <div key={bread.name} className="flex flex-col items-center gap-2">
              <span className="text-sm text-muted-foreground capitalize">
                {bread.label}
              </span>
              <Input
                className={`w-[80px] h-[80px] ${bread.color} text-center no-spinners text-xl font-semibold`}
                name={bread.name}
                type="number"
                value={quantity[bread.name] === undefined ? "" : quantity[bread.name]}
                onChange={(e) =>
                  handleQuantityChange(e.target.name, e.target.value)
                }
                placeholder="0"
              />
              <span className="text-xs text-muted-foreground">
                ₦{multipliers[bread.name]?.toLocaleString() || 0} each
              </span>
            </div>
          ))}
        </div>

        {/* Total Display */}
        <div className="p-6 rounded-lg bg-primary/10 border-2 border-primary">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
            <p className="text-4xl font-bold text-foreground">
              ₦{total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Breakdown */}
        {total > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Breakdown:</p>
            {Object.entries(quantity).map(([key, val]) => {
              if (!val || val === 0) return null;
              const amount = val * (multipliers[key] || 0);
              return (
                <div
                  key={key}
                  className="flex justify-between text-sm text-muted-foreground"
                >
                  <span className="capitalize">
                    {key}: {val} × ₦{multipliers[key]?.toLocaleString()}
                  </span>
                  <span className="font-medium">₦{amount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Reset Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Calculator
        </Button>
      </CardContent>
    </Card>
  );
};
