"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchAllSalesWithDetails, SaleWithDetails } from "@/app/services/sales";
import { fetchAllCustomers, Customer } from "@/app/services/customers";
import { fetchAllProductions, Production } from "@/app/services/productions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Plus, User, Factory, MoreHorizontal, Edit, Trash2 } from "lucide-react";
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

export default function AllSalesPage() {
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [salesData, customersData, productionsData] = await Promise.all([
        fetchAllSalesWithDetails(),
        fetchAllCustomers(),
        fetchAllProductions(),
      ]);
      setSales(salesData);
      setCustomers(customersData as Customer[]);
      setProductions(productionsData as Production[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const customerMatch =
        selectedCustomer === "all" || sale.customer_id === selectedCustomer;
      const productionMatch =
        selectedProduction === "all" || sale.production_id === selectedProduction;
      return customerMatch && productionMatch;
    });
  }, [sales, selectedCustomer, selectedProduction]);

  const totalSalesAmount = filteredSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalOutstanding = filteredSales.reduce((sum, sale) => sum + sale.outstanding, 0);
  const paidSalesCount = filteredSales.filter((sale) => sale.paid).length;

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
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
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
            <Select value={selectedProduction} onValueChange={setSelectedProduction}>
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

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Paid / Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {paidSalesCount} / {filteredSales.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Table View */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sales History</CardTitle>
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
                    <TableHead>Outstanding</TableHead>
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
                        {formatDate(sale.productions?.created_at || sale.created_at)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₦{sale.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {sale.outstanding > 0 ? (
                          <span className="text-destructive font-medium">
                            ₦{sale.outstanding.toLocaleString()}
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
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background">
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
                                  customerName: sale.customers?.name || "Unknown",
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
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem
                          onClick={() => setEditingSale(sale)}
                        >
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
      </div>

      {/* Modals */}
      {editingSale && (
        <EditSaleModal
          sale={{
            id: editingSale.id,
            amount: editingSale.amount,
            amount_paid: editingSale.amount_paid,
            outstanding: editingSale.outstanding,
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
