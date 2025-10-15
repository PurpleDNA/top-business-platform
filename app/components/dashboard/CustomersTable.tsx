import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchAllCustomers, Customer } from "@/app/services/customers";
import Link from "next/link";
import RecentsTable from "./RecentsTable";

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
          <RecentsTable customers={customers} />
        )}
      </CardContent>
    </Card>
  );
};
