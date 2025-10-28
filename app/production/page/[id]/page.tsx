/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  getProductionById,
  getProductionOutstanding,
  getProductionPaidOutstanding,
  calculateBreadTotal,
} from "@/app/services/productions";
import { OutstandingSection } from "@/app/components/productions/OutstandingSection";
import { ProductionToggle } from "@/app/components/productions/ProductionToggle";
import { ExpenseDropdown } from "@/app/components/productions/ExpenseDropdown";
import { RemainingBreadDropdown } from "@/app/components/productions/RemainingBreadDropdown";
import { ExpenseModal } from "@/app/components/productions/ExpenseModal";
import { CashInput } from "@/app/components/productions/CashInput";
import { getExpensesByProdId } from "@/app/services/expenses";
import { formatDate, formatDateTime } from "@/app/services/utils";
import {
  Factory,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Package,
  Wallet,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const production = await getProductionById(id);
  const outstandingList = (await getProductionOutstanding(id)) || [];
  const paidOutstandingList = (await getProductionPaidOutstanding(id)) || [];
  const expenses = await getExpensesByProdId(id);

  if (!production) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Production Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The production record you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/productions/all"
            className="text-primary hover:text-primary/80"
          >
            Back to Productions
          </Link>
        </div>
      </div>
    );
  }

  const {
    quantity,
    total,
    cash,
    created_at,
    old_bread,
    remaining_bread,
  } = production;

  // Calculate old_bread & remaining_bread monetary value
  const oldBreadTotal = await calculateBreadTotal(old_bread);
  const remainingBreadTotal = await calculateBreadTotal(remaining_bread);

  const isOldBread = Object.values(old_bread).some((color) => {
    return color != 0;
  });

  console.log(isOldBread);

  // Calculate total value (production total + old_bread value)
  const totalValue = total + oldBreadTotal;

  // Calculate total expenses from expenses table
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate outstanding amounts
  const totalOutstanding = outstandingList.reduce(
    (sum, item) => sum + (item.outstanding || 0),
    0
  );

  // Calculate paid outstanding total from the paidOutstandingList
  const totalPaidOutstanding = paidOutstandingList.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  // Financial calculations
  // Money we have: cash + expenses + outstanding + remaining bread value
  const totalMoneyIn = cash + totalExpenses + totalOutstanding + remainingBreadTotal;

  // Subtract paid outstanding (money that was paid back)
  const adjustedTotal = totalMoneyIn - totalPaidOutstanding;

  // Compare with revenue to see if we're short, excess, or balanced
  const difference = adjustedTotal - total;

  const isShort = difference < 0;
  const isExcess = difference > 0;
  const isBalanced = difference === 0;

  // Determine status badge configuration
  const getStatusConfig = () => {
    if (isBalanced) {
      return {
        label: "Balanced",
        icon: CheckCircle2,
        className: "bg-blue-500/10 text-blue-500 ring-1 ring-blue-300/20",
      };
    } else if (isShort) {
      return {
        label: "Short",
        icon: TrendingDown,
        className: "bg-red-500/10 text-red-500 ring-1 ring-red-300/20",
      };
    } else {
      return {
        label: "Excess",
        icon: TrendingUp,
        className: "bg-green-500/10 text-green-500 ring-1 ring-green-300/20",
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  // Calculate total quantity
  const totalQuantity =
    quantity.blue +
    quantity.green +
    quantity.orange +
    old_bread.blue +
    old_bread.green +
    old_bread.orange;

  // Format production ID (show first 8 chars)
  const shortId = id.substring(0, 8).toUpperCase();

  return (
    <div className="bg-background text-foreground antialiased selection:bg-primary/20 scrollbar-hide">
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/80 border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/productions/all"
                  className="h-8 w-8 rounded-md bg-muted border border-border flex items-center justify-center hover:bg-accent transition"
                >
                  <ArrowLeft className="h-4 w-4 text-foreground" />
                </Link>
                <div className="h-8 w-8 rounded-md bg-muted border border-border flex items-center justify-center">
                  <Factory className="h-4 w-4 text-foreground" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Production Dashboard
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <ProductionToggle
                  productionId={id}
                  initialOpenStatus={production.open}
                />
                <ExpenseModal productionId={id} />
                <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-muted border border-border hover:bg-accent transition">
                  Export
                </button>
                <Link
                  href={{ pathname: "/sale/new", query: { production_id: id } }}
                >
                  <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition">
                    New Sale
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Production Overview */}
            <section className="xl:col-span-1 rounded-xl border border-border bg-card">
              <div className="p-5 border-b border-border">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-lg ring-1 ring-border bg-gradient-to-br from-blue-500 via-green-500 to-orange-500 flex items-center justify-center text-white font-semibold text-lg">
                    <Factory className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl tracking-tight font-semibold text-foreground">
                        Production #{shortId}
                      </h1>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md ${statusConfig.className}`}
                      >
                        <StatusIcon size={12} />
                        {statusConfig.label}
                      </span>
                    </div>
                    <h2>{formatDateTime(created_at)}</h2>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Product Quantities Breakdown */}
                <div
                  className={`grid grid-cols-1 ${
                    isOldBread && "md:grid-cols-2"
                  } gap-4`}
                >
                  <div className="mb-4 rounded-lg bg-muted/50 ring-1 ring-border p-4">
                    <dt className="text-xs text-muted-foreground mb-3">
                      Production
                    </dt>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm text-foreground">Blue</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {quantity.blue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm text-foreground">Green</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {quantity.green.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                          <span className="text-sm text-foreground">
                            Orange
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {quantity.orange.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOldBread && (
                    <div className="mb-4 rounded-lg bg-muted/50 ring-1 ring-border p-4">
                      <dt className="text-xs text-muted-foreground mb-3">
                        Old Bread
                      </dt>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm text-foreground">
                              Blue
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {old_bread.blue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-foreground">
                              Green
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {old_bread.green.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                            <span className="text-sm text-foreground">
                              Orange
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {old_bread.orange.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted/50 ring-1 ring-border p-4">
                    <dt className="text-xs text-muted-foreground flex items-center gap-2">
                      <Package className="h-3 w-3" />
                      Total Units
                    </dt>
                    <dd className="mt-1 text-sm text-foreground font-semibold">
                      {totalQuantity.toLocaleString()}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-muted/50 ring-1 ring-border p-4">
                    <dt className="text-xs text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Total Value
                    </dt>
                    <dd className="mt-1 text-sm text-foreground font-semibold">
                      ₦{totalValue.toLocaleString()}
                    </dd>
                  </div>
                  {/* Cash Collected */}
                  <div className="mt-6">
                    <CashInput productionId={id} initialCash={cash} />
                  </div>
                </dl>
              </div>
            </section>

            {/* Metrics Section */}
            <section className="xl:col-span-2 space-y-6">
              {/* Outstanding Section */}
              <div className="mt-6">
                <OutstandingSection
                  outstanding={outstandingList}
                  paidOutstanding={paidOutstandingList}
                />
              </div>

              {/* Expenses Section */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <ExpenseDropdown data={expenses} />
                <RemainingBreadDropdown
                  remainingBread={remaining_bread}
                  remainingBreadTotal={remainingBreadTotal}
                />
              </div>

              {/* Financial Summary */}
              <div className="rounded-xl bg-card border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                      Financial Summary
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Production financials overview
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Cash Collected */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-foreground">
                        Cash Collected
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      ₦{cash.toLocaleString()}
                    </span>
                  </div>

                  {/* Expenses */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-foreground">
                        Total Expenses
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      ₦{totalExpenses.toLocaleString()}
                    </span>
                  </div>

                  {/* Outstanding */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-foreground">
                        Outstanding
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      ₦{totalOutstanding.toLocaleString()}
                    </span>
                  </div>

                  {/* Remaining Bread */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-foreground">
                        Remaining Bread
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      ₦{remainingBreadTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Paid Outstanding */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-foreground">
                        Paid Outstanding
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      -₦{totalPaidOutstanding.toLocaleString()}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-center justify-between pb-3 border-b border-border bg-muted/50 px-3 py-2 rounded-lg">
                    <span className="text-sm font-semibold text-foreground">
                      Subtotal (Cash + Expenses + Outstanding + Remaining Bread - Paid)
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      ₦{adjustedTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Revenue */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-foreground">
                        Total Revenue
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      -₦{total.toLocaleString()}
                    </span>
                  </div>

                  {/* Final Balance */}
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      isBalanced
                        ? "bg-blue-500/10 ring-1 ring-blue-500/20"
                        : isShort
                        ? "bg-red-500/10 ring-1 ring-red-500/20"
                        : "bg-green-500/10 ring-1 ring-green-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isBalanced ? (
                        <CheckCircle2 className={`h-5 w-5 text-blue-400`} />
                      ) : isShort ? (
                        <TrendingDown className={`h-5 w-5 text-red-400`} />
                      ) : (
                        <TrendingUp className={`h-5 w-5 text-green-400`} />
                      )}
                      <span
                        className={`text-base font-semibold ${
                          isBalanced
                            ? "text-blue-400"
                            : isShort
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {isBalanced ? "Balanced" : isShort ? "Short" : "Excess"}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-bold ${
                        isBalanced
                          ? "text-blue-400"
                          : isShort
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {isBalanced
                        ? "₦0"
                        : `${isShort ? "-" : "+"}₦${Math.abs(
                            difference
                          ).toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto px-6 py-8 text-xs text-muted-foreground">
          © 2025 Top Business Platform — Production Management
        </footer>
      </div>
    </div>
  );
};

export default page;
