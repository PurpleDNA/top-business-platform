"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, TrendingDown } from "lucide-react";
import { Production } from "@/app/services/productions";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getBreakEvenVariant = (breakEven: boolean) => {
  return breakEven ? "default" : "destructive";
};

const calculateProfit = (production: Production) => {
  return production.total - production.expenses_total;
};

const ProductionsTable = ({ productions }: { productions: Production[] }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Quantities</TableHead>
            <TableHead>Total Value</TableHead>
            <TableHead>Expenses</TableHead>
            <TableHead>Profit/Loss</TableHead>
            <TableHead>Outstanding</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productions.map((production) => {
            const profit = calculateProfit(production);
            const isProfit = profit >= 0;

            return (
              <TableRow
                key={production.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() =>
                  (window.location.href = `/production/page/${production.id}`)
                }
              >
                <TableCell className="font-medium">
                  {formatDate(production.created_at)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    {production.quantity.orange > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-orange-200 text-orange-900 dark:bg-orange-500/20 dark:text-orange-400"
                      >
                        O: {production.quantity.orange}
                      </Badge>
                    )}
                    {production.quantity.blue > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-200 text-blue-900 dark:bg-blue-500/20 dark:text-blue-400"
                      >
                        B: {production.quantity.blue}
                      </Badge>
                    )}
                    {production.quantity.green > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-green-200 text-green-900 dark:bg-green-500/20 dark:text-green-400"
                      >
                        G: {production.quantity.green}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  ₦{production.total.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  ₦{production.expenses_total.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div
                    className={`flex items-center gap-1 font-semibold ${
                      isProfit ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isProfit ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    ₦{Math.abs(profit).toLocaleString()}
                  </div>
                </TableCell>
                {/* <TableCell className="font-medium">
                  ₦{production.outstanding.toLocaleString()}
                </TableCell> */}
                <TableCell>
                  <Badge variant={getBreakEvenVariant(production.break_even)}>
                    {production.break_even ? "Break Even" : "Not Break Even"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add view functionality here if needed
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductionsTable;
