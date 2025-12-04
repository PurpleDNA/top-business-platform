import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchAllProductions, Production } from "@/app/services/productions";
import { getBreadPriceMultipliers } from "@/app/services/bread_price";
import Link from "next/link";
import RecentProductionsTable from "./RecentProductionsTable";

export const ProductionsTable = async () => {
  const allProductions = (await fetchAllProductions()) as Production[];
  // Get the 5 most recent productions
  const productions = allProductions.slice(0, 5);
  const multipliers = await getBreadPriceMultipliers();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Recent Productions
        </CardTitle>
        <Link href="/productions/all">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {productions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No productions yet</p>
            <Link href="/production/new">
              <Button className="mt-4" size="sm">
                Add Your First Production
              </Button>
            </Link>
          </div>
        ) : (
          <RecentProductionsTable productions={productions} multipliers={multipliers} />
        )}
      </CardContent>
    </Card>
  );
};
