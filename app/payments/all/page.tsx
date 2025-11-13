"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import {
  fetchAllPaymentsWithDetails,
  PaymentWithDetails,
} from "@/app/services/payments";
import { fetchAllCustomers, Customer } from "@/app/services/customers";
import { fetchAllProductions, Production } from "@/app/services/productions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  ArrowLeft,
  Plus,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EditPaymentModal } from "@/app/components/payments/EditPaymentModal";
import { DeletePaymentDialog } from "@/app/components/payments/DeletePaymentDialog";
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

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function AllPaymentsContent() {
  const [onPageCache, setOnPageCache] = useState<PaymentWithDetails[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productions, setProductions] = useState<Production[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [selectedProduction, setSelectedProduction] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [editingPayment, setEditingPayment] =
    useState<PaymentWithDetails | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<{
    id: string;
    customerName: string;
    amount: number;
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

  // Fetch payments in batches of 50
  useEffect(() => {
    // Pages 1-5 -> batch 1, Pages 6-10 -> batch 2, etc.
    const batchNumber = Math.floor((page - 1) / 5) + 1;

    const fetchBatch = async () => {
      const paymentsData = await fetchAllPaymentsWithDetails(batchNumber, 50);

      setOnPageCache((prev) => {
        // Create a copy of the cache
        const newCache = [...prev];
        // Calculate where to insert this batch
        const startIndex = (batchNumber - 1) * 50;
        // Insert the fetched data at the correct position
        newCache.splice(startIndex, paymentsData.length, ...paymentsData);
        return newCache;
      });
    };

    // Only fetch if we haven't fetched this batch before
    if (!fetchedBatches.current.has(batchNumber)) {
      fetchBatch();
      fetchedBatches.current.add(batchNumber);
    }
  }, [page]);

  // Filter the entire cache first (so customers with payments across multiple pages show together)
  const filteredAllPayments = useMemo(() => {
    return onPageCache.filter((payment) => {
      const customerMatch =
        selectedCustomer === "all" || payment.customer_id === selectedCustomer;
      const productionMatch =
        selectedProduction === "all" ||
        payment.production_id === selectedProduction;
      return customerMatch && productionMatch;
    });
  }, [onPageCache, selectedCustomer, selectedProduction]);

  // Then paginate the filtered results (show 10 per page)
  const paginatedPayments = useMemo(() => {
    const startIndex = (page - 1) * 10;
    const endIndex = startIndex + 10;
    return filteredAllPayments.slice(startIndex, endIndex);
  }, [filteredAllPayments, page]);

  // Use paginatedPayments as filteredPayments for display
  const filteredPayments = paginatedPayments;

  // Calculate totals from ALL filtered payments, not just current page
  const totalPaymentsAmount = filteredAllPayments.reduce(
    (sum, payment) => sum + payment.amount_paid,
    0
  );
  const distributedPaymentsCount = filteredAllPayments.filter(
    (payment) => !payment.sale_id
  ).length;
  const onDemandPaymentsCount = filteredAllPayments.filter(
    (payment) => payment.sale_id
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading payments...</p>
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
                All Payments
              </h1>
            </div>
            <p className="text-muted-foreground lg:hidden">
              Total: {filteredPayments.length} payments
            </p>
          </div>
          <Link href="/payment/new">
            <Button className="bg-primary hidden lg:flex">
              <Wallet className="h-4 w-4 mr-2" />
              New Payment
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
                Total Payments Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{totalPaymentsAmount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Distributed Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {distributedPaymentsCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                On-Demand Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {onDemandPaymentsCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Table View */}
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No payments found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters or create a new payment
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Production</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {payment.customers?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₦{payment.amount_paid.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.type == "on_demand"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {payment.type == "on_demand"
                            ? "On-Demand"
                            : "Paid-Out"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.productions
                          ? formatDate(payment.productions.created_at)
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(payment.paid_at)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatTime(payment.paid_at)}
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
                            <DropdownMenuItem
                              onClick={() => setEditingPayment(payment)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                setDeletingPayment({
                                  id: payment.id,
                                  customerName:
                                    payment.customers?.name || "Unknown",
                                  amount: payment.amount_paid,
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
          {filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No payments found
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div>
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="border-b border-muted py-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium">
                        {payment.customers?.name || "Unknown"}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(payment.paid_at)} •{" "}
                      {formatTime(payment.paid_at)}
                    </p>
                    <Badge
                      className="mt-1"
                      variant={payment.sale_id ? "default" : "secondary"}
                    >
                      {payment.sale_id ? "On-Demand" : "Distributed"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <h3 className="font-semibold text-lg">
                        ₦{payment.amount_paid.toLocaleString()}
                      </h3>
                      <span className="text-xs text-muted-foreground capitalize">
                        {payment.type}
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
                        <DropdownMenuItem
                          onClick={() => setEditingPayment(payment)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            setDeletingPayment({
                              id: payment.id,
                              customerName:
                                payment.customers?.name || "Unknown",
                              amount: payment.amount_paid,
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
        {filteredAllPayments.length > 0 && (
          <div className="flex flex-col items-center gap-2 pt-4">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((page - 1) * 10 + 1, filteredAllPayments.length)}-
              {Math.min(page * 10, filteredAllPayments.length)} of{" "}
              {filteredAllPayments.length} results
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`${pathname}?page=${Math.max(1, page - 1)}`}
                onClick={(e) => {
                  if (page === 1) e.preventDefault();
                }}
              >
                <Button variant="outline" size="sm" disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                Page {page} of {Math.ceil(filteredAllPayments.length / 10)}
              </span>
              <Link
                href={`${pathname}?page=${page + 1}`}
                onClick={(e) => {
                  if (page >= Math.ceil(filteredAllPayments.length / 10))
                    e.preventDefault();
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= Math.ceil(filteredAllPayments.length / 10)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingPayment && (
        <EditPaymentModal
          payment={{
            id: editingPayment.id,
            amount: editingPayment.amount_paid,
            type: editingPayment.type,
          }}
          open={!!editingPayment}
          onOpenChange={(open) => !open && setEditingPayment(null)}
        />
      )}

      {deletingPayment && (
        <DeletePaymentDialog
          paymentId={deletingPayment.id}
          customerName={deletingPayment.customerName}
          amount={deletingPayment.amount}
          open={!!deletingPayment}
          onOpenChange={(open) => !open && setDeletingPayment(null)}
        />
      )}
    </div>
  );
}

export default function AllPaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      }
    >
      <AllPaymentsContent />
    </Suspense>
  );
}
