import {
  fetchAllProductions,
  Production,
} from "@/app/services/productions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Factory, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

const AllProductionsPage = async () => {
  const productions = (await fetchAllProductions()) as Production[];

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

  const getShortExcessVariant = (shortOrExcess: boolean, amount: number) => {
    if (!shortOrExcess) return "secondary";
    return amount > 0 ? "default" : "destructive";
  };

  const calculateProfit = (production: Production) => {
    return production.total - production.expenses_total;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">
                All Productions
              </h1>
            </div>
            <p className="text-muted-foreground">
              Total: {productions.length} production batches
            </p>
          </div>
          <Link href="/production/new">
            <Button className="bg-primary">
              <Factory className="h-4 w-4 mr-2" />
              New Production
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Production Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦
                {productions
                  .reduce((sum, prod) => sum + prod.total, 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦
                {productions
                  .reduce((sum, prod) => sum + prod.expenses_total, 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Outstanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦
                {productions
                  .reduce((sum, prod) => sum + prod.outstanding, 0)
                  .toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Productions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Production History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Factory className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No productions found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start by recording your first production batch
                </p>
                <Link href="/production/new">
                  <Button className="mt-4">
                    <Factory className="h-4 w-4 mr-2" />
                    New Production
                  </Button>
                </Link>
              </div>
            ) : (
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
                          className="hover:bg-muted/50"
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
                          <TableCell className="font-medium">
                            ₦{production.outstanding.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getBreakEvenVariant(
                                production.break_even
                              )}
                            >
                              {production.break_even
                                ? "Break Even"
                                : "Not Break Even"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllProductionsPage;
