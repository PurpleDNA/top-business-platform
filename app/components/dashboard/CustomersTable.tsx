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
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchAllCustomers, Customer } from "@/app/services/customers";
import Link from "next/link";

const getStatusVariant = (hasDebt: boolean, totalDebt: number) => {
  if (!hasDebt || totalDebt === 0) {
    return "default";
  }
  if (totalDebt > 10000) {
    return "destructive";
  }
  return "secondary";
};

const getStatusText = (hasDebt: boolean, totalDebt: number) => {
  if (!hasDebt || totalDebt === 0) {
    return "Debt Free";
  }
  if (totalDebt > 10000) {
    return "High Debt";
  }
  return "Active";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const CustomersTable = async () => {
  const allCustomers = (await fetchAllCustomers()) as Customer[];
  // Get the 5 most recent customers
  const customers = allCustomers.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Recent Customers
        </CardTitle>
        <Link href="/customers/all">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No customers yet</p>
            <Link href="/customers/new">
              <Button className="mt-4" size="sm">
                Add Your First Customer
              </Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Debt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {customer.phone_number}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₦{customer.total_debt.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusVariant(
                        customer.has_debt,
                        customer.total_debt
                      )}
                    >
                      {getStatusText(customer.has_debt, customer.total_debt)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(customer.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-background"
                      >
                        <DropdownMenuItem asChild>
                          <Link href={`/customers/page/${customer.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
