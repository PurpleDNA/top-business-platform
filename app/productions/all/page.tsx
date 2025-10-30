import { fetchAllProductions, Production } from "@/app/services/productions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory, ArrowLeft, Plus, LockOpen, Lock } from "lucide-react";
import Link from "next/link";
import ProductionsTable from "@/app/components/productions/ProductionsTable";

const AllProductionsPage = async () => {
  const productions = (await fetchAllProductions()) as Production[];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-lg lg:text-3xl font-bold tracking-tight">
                All Productions
              </h1>
            </div>
            <p className="text-muted-foreground lg:hidden">
              Total: {productions.length} production batches
            </p>
          </div>
          <Link href="/production/new">
            <Button className="bg-primary hidden lg:flex">
              <Factory className="h-4 w-4 mr-2" />
              New Production
            </Button>
            <Button className="bg-primary lg:hidden">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats Cards - Hidden on Mobile */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-6">
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
                Total Productions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Table View */}
        <Card className="hidden lg:block">
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
              <ProductionsTable productions={productions} />
            )}
          </CardContent>
        </Card>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
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
            <div>
              {productions.map((production) => (
                <Link
                  href={`/production/page/${production.id}`}
                  key={production.id}
                >
                  <div
                    key={production.id}
                    className="border-b border-muted py-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-medium">
                          {formatDate(production.created_at)}
                        </h3>
                        {production.open ? (
                          <LockOpen className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        O: {production.quantity.orange} | B:{" "}
                        {production.quantity.blue} | G:{" "}
                        {production.quantity.green}
                      </p>
                    </div>
                    <h3 className="font-semibold text-lg">
                      ₦{production.total.toLocaleString()}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductionsPage;
