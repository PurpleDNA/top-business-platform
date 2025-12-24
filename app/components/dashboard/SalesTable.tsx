import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchAllSalesWithDetails, SaleWithDetails } from "@/app/services/sales";
import Link from "next/link";
import RecentSalesTable from "./RecentSalesTable";

export const SalesTable = async () => {
  // Fetch the 5 most recent sales
  const sales = (await fetchAllSalesWithDetails(1, 5)) as SaleWithDetails[];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Recent Sales
        </CardTitle>
        <Link href="/sales/all">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No sales yet</p>
            <Link href="/sale/new">
              <Button className="mt-4" size="sm">
                Record First Sale
              </Button>
            </Link>
          </div>
        ) : (
          <RecentSalesTable sales={sales} />
        )}
      </CardContent>
    </Card>
  );
};
