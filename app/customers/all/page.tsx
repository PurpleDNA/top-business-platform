import { fetchAllCustomers, Customer } from "@/app/services/customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CustomerRow from "@/app/components/customer/CustomerRow";

const AllCustomersPage = async () => {
  const customers = (await fetchAllCustomers()) as Customer[];

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
              <CustomerRow customers={customers} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllCustomersPage;
