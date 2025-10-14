import { fetchAllCustomers, Customer } from "@/app/services/customers";
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
import { Eye, Edit, Phone, ArrowLeft } from "lucide-react";
import Link from "next/link";

const AllCustomersPage = async () => {
  const customers = (await fetchAllCustomers()) as Customer[];

  const getDebtStatusVariant = (hasDebt: boolean, totalDebt: number) => {
    if (!hasDebt || totalDebt === 0) {
      return "default";
    }
    if (totalDebt > 10000) {
      return "destructive";
    }
    return "secondary";
  };

  const getDebtStatusText = (hasDebt: boolean, totalDebt: number) => {
    if (!hasDebt || totalDebt === 0) {
      return "Debt Free";
    }
    if (totalDebt > 10000) {
      return "High Debt";
    }
    return "Active Debt";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
                All Customers
              </h1>
            </div>
            <p className="text-muted-foreground">
              Total: {customers.length} customers
            </p>
          </div>
          <Link href="/customers/new">
            <Button className="bg-primary">Add New Customer</Button>
          </Link>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Customer List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  No customers found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start by adding your first customer
                </p>
                <Link href="/customers/new">
                  <Button className="mt-4">Add Customer</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Total Debt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="hover:bg-muted/50 cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {customer.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {customer.phone_number}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {customer.total_debt > 0
                            ? `₦${customer.total_debt.toLocaleString()}`
                            : "₦0"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getDebtStatusVariant(
                              customer.has_debt,
                              customer.total_debt
                            )}
                          >
                            {getDebtStatusText(
                              customer.has_debt,
                              customer.total_debt
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(customer.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/customers/page/${customer.id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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

export default AllCustomersPage;
