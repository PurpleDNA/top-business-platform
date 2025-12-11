"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import {
  fetchAllSalesWithDetails,
  SaleWithDetails,
} from "@/app/services/sales";
import { fetchAllCustomers, Customer } from "@/app/services/customers";
import { fetchAllProductions, Production } from "@/app/services/productions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EditSaleModal } from "@/app/components/sales/EditSaleModal";
import { DeleteSaleDialog } from "@/app/components/sales/DeleteSaleDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePathname, useSearchParams } from "next/navigation";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatQuantity = (quantity: { [key: string]: number }) => {
  return Object.entries(quantity)
    .map(([color, qty]) => `${color[0].toUpperCase()}: ${qty}`)
    .join(" | ");
};

function AllSalesContent() {
  const [onPageCache, setOnPageCache] = useState<SaleWithDetails[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productions, setProductions] = useState<Production[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [selectedProduction, setSelectedProduction] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [editingSale, setEditingSale] = useState<SaleWithDetails | null>(null);
  const [deletingSale, setDeletingSale] = useState<{
    id: string;
    customerName: string;
  } | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const fetchedBatches = useRef(new Set<number>());

  // Fetch customers and productions once
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [customersData, productionsData] = await Promise.all([
        fetchAllCustomers(),
        fetchAllProductions(),
      ]);
      setCustomers(customersData as Customer[]);
      setProductions(productionsData as Production[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fetch sales in batches of 50
  useEffect(() => {
    // Pages 1-5 -> batch 1, Pages 6-10 -> batch 2, etc.
    const batchNumber = Math.floor((page - 1) / 5) + 1;

    const fetchBatch = async () => {
      const salesData = await fetchAllSalesWithDetails(batchNumber, 50);

      setOnPageCache((prev) => {
        // Create a copy of the cache
        const newCache = [...prev];
        // Calculate where to insert this batch
        const startIndex = (batchNumber - 1) * 50;
        // Insert the fetched data at the correct position
        newCache.splice(startIndex, salesData.length, ...salesData);
        return newCache;
      });
    };

    // Only fetch if we haven't fetched this batch before
    if (!fetchedBatches.current.has(batchNumber)) {
      fetchBatch();
      fetchedBatches.current.add(batchNumber);
    }
  }, [page]);

  // Filter the entire cache first (so customers with sales across multiple pages show together)
  const filteredAllSales = useMemo(() => {
    return onPageCache.filter((sale) => {
      const customerMatch =
        selectedCustomer === "all" || sale.customer_id === selectedCustomer;
      const productionMatch =
        selectedProduction === "all" ||
        sale.production_id === selectedProduction;
      return customerMatch && productionMatch;
    });
  }, [onPageCache, selectedCustomer, selectedProduction]);

  // Then paginate the filtered results (show 10 per page)
  const paginatedSales = useMemo(() => {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredAllSales.slice(startIndex, endIndex);
  }, [filteredAllSales, page]);

  // Use paginatedSales as filteredSales for display
  const filteredSales = paginatedSales;

  // Calculate totals from ALL filtered sales, not just current page
  const totalSalesAmount = filteredAllSales.reduce(
    (sum, sale) => sum + sale.amount,
    0
  );
  const totalOutstanding = filteredAllSales.reduce(
    (sum, sale) => sum + sale.outstanding,
    0
  );
  const paidSalesCount = filteredAllSales.filter((sale) => sale.paid).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading sales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
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
                All Sales
              </h1>
            </div>
            <p className="text-muted-foreground lg:hidden">
              Total: {filteredSales.length} sales
            </p>
          </div>
          <Link href="/sale/new">
            <Button className="bg-primary hidden lg:flex">
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Sale
            </Button>
            <Button className="bg-primary lg:hidden">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Customer</label>
            <Select
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Production</label>
            <Select
              value={selectedProduction}
              onValueChange={setSelectedProduction}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Productions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Productions</SelectItem>
                {productions.map((production) => (
                  <SelectItem key={production.id} value={production.id}>
                    {formatDate(production.created_at)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards - Hidden on Mobile */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{totalSalesAmount.toLocaleString()}
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
              <div className="text-2xl font-bold text-destructive">
                ₦{totalOutstanding.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Table View */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Sales History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No sales found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters or create a new sale
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Production</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {sale.customers?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(
                          sale.productions?.created_at || sale.created_at
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₦{sale.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {sale.remaining > 0 ? (
                          <span className="text-destructive font-medium">
                            ₦{sale.remaining.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">₦0</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sale.paid ? "default" : "destructive"}>
                          {sale.paid ? "Paid" : "Unpaid"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(sale.created_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-background"
                          >
                            <Link href={`/customers/page/${sale.customer_id}`}>
                                <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                View Customer
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              onClick={() => setEditingSale(sale)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Sale
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                setDeletingSale({
                                  id: sale.id,
                                  customerName:
                                    sale.customers?.name || "Unknown",
                                })
                              }
                            >
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

        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
          {filteredSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No sales found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div>
              {filteredSales.map((sale) => (
                <div
                  key={sale.id}
                  className="border-b border-muted py-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium">
                        {sale.customers?.name || "Unknown"}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatQuantity(sale.quantity_bought)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(sale.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <h3 className="font-semibold text-lg">
                        ₦{sale.amount.toLocaleString()}
                      </h3>
                      <span
                        className={`text-xs ${
                          sale.paid ? "text-green-500" : "text-destructive"
                        }`}
                      >
                        {sale.paid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
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
                         <Link href={`/customers/page/${sale.customer_id}`}>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                View Customer
                            </DropdownMenuItem>
                         </Link>
                        <DropdownMenuItem onClick={() => setEditingSale(sale)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            setDeletingSale({
                              id: sale.id,
                              customerName: sale.customers?.name || "Unknown",
                            })
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredAllSales.length > 0 && (
          <div className="flex flex-col items-center gap-2 pt-4">
            <div className="flex items-center gap-2">
              <Link
                href={`${pathname}?page=${Math.max(1, page - 1)}`}
                onClick={(e) => {
                  if (page === 1) e.preventDefault();
                }}
              >
                <Button variant="outline" size="sm" disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                {page} / {Math.ceil(filteredAllSales.length / 10)}
              </span>
              <Link
                href={`${pathname}?page=${page + 1}`}
                onClick={(e) => {
                  if (page >= Math.ceil(filteredAllSales.length / 10))
                    e.preventDefault();
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(filteredAllSales.length / 10)}
                >
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingSale && (
        <EditSaleModal
          sale={{
            id: editingSale.id,
            amount: editingSale.amount,
            amount_paid: editingSale.amount_paid,
            outstanding: editingSale.outstanding,
            quantity_bought: editingSale.quantity_bought,
          }}
          open={!!editingSale}
          onOpenChange={(open) => !open && setEditingSale(null)}
        />
      )}

      {deletingSale && (
        <DeleteSaleDialog
          saleId={deletingSale.id}
          customerName={deletingSale.customerName}
          open={!!deletingSale}
          onOpenChange={(open) => !open && setDeletingSale(null)}
        />
      )}
    </div>
  );
}

export default function AllSalesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading sales...</p>
        </div>
      }
    >
      <AllSalesContent />
    </Suspense>
  );
}
