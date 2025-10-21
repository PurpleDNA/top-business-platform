import React from "react";
import {
  getProductionById,
  getProductionOutstanding,
} from "@/app/services/productions";
import { OutstandingSection } from "@/app/components/productions/OutstandingSection";
import { ProductionToggle } from "@/app/components/productions/ProductionToggle";
import { ExpenseDropdown } from "@/app/components/productions/ExpenseDropdown";
import { ExpenseModal } from "@/app/components/productions/ExpenseModal";
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
  const outstandingList = await getProductionOutstanding(id);
  const expenses = await getExpensesByProdId(id);

  console.log(outstandingList);

  if (!production) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Production Not Found
          </h1>
          <p className="text-neutral-400 mb-4">
            The production record you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/productions/all"
            className="text-indigo-400 hover:text-indigo-300"
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
    break_even,
    short_or_excess,
    expenses_total,
    cash,
    created_at,
  } = production;

  // Calculate profit/loss
  const profitLoss = total - expenses_total;
  const isProfitable = profitLoss > 0;

  // Calculate total quantity
  const totalQuantity = quantity.blue + quantity.green + quantity.orange;

  // Format production ID (show first 8 chars)
  const shortId = id.substring(0, 8).toUpperCase();

  return (
    <div className="bg-neutral-950 text-neutral-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 scrollbar-hide">
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 bg-neutral-950/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/productions/all"
                  className="h-8 w-8 rounded-md bg-neutral-900 border border-white/10 flex items-center justify-center hover:bg-neutral-800 transition"
                >
                  <ArrowLeft className="h-4 w-4 text-neutral-200" />
                </Link>
                <div className="h-8 w-8 rounded-md bg-neutral-900 border border-white/10 flex items-center justify-center">
                  <Factory className="h-4 w-4 text-neutral-200" />
                </div>
                <div className="text-sm text-neutral-400">
                  Production Dashboard
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <ProductionToggle
                  productionId={id}
                  initialOpenStatus={production.open}
                />
                <ExpenseModal productionId={id} />
                <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-neutral-900/70 border border-white/10 hover:bg-neutral-900 hover:border-white/20 transition">
                  Export
                </button>
                <Link
                  href={{ pathname: "/sale/new", query: { production_id: id } }}
                >
                  <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-neutral-900 transition">
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
            <section className="xl:col-span-1 rounded-xl border border-white/10 bg-neutral-950/40">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-lg ring-1 ring-white/10 bg-gradient-to-br from-blue-500 via-green-500 to-orange-500 flex items-center justify-center text-white font-semibold text-lg">
                    <Factory className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl tracking-tight font-semibold text-white">
                        Production #{shortId}
                      </h1>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md ${
                          break_even
                            ? "bg-green-500/10 text-green-500 ring-1 ring-green-300/20"
                            : "bg-red-500/10 text-red-500 ring-1 ring-red-300/20"
                        }`}
                      >
                        {break_even ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <AlertTriangle size={12} />
                        )}
                        {break_even ? "Break Even" : "Loss"}
                      </span>
                      {/* {short_or_excess && (
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md ${
                            short_amount > 0
                              ? "bg-amber-500/10 text-amber-500 ring-1 ring-amber-300/20"
                              : "bg-blue-500/10 text-blue-500 ring-1 ring-blue-300/20"
                          }`}
                        >
                          {short_amount > 0 ? "Shortage" : "Excess"}
                        </span>
                      )} */}
                    </div>
                    <h2>{formatDateTime(created_at)}</h2>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Product Quantities Breakdown */}
                <div className="mb-4 rounded-lg bg-neutral-900/50 ring-1 ring-white/10 p-4">
                  <dt className="text-xs text-neutral-400 mb-3">
                    Product Breakdown
                  </dt>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-neutral-300">Blue</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {quantity.blue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-neutral-300">Green</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {quantity.green.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-neutral-300">Orange</span>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {quantity.orange.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-neutral-900/50 ring-1 ring-white/10 p-4">
                    <dt className="text-xs text-neutral-400 flex items-center gap-2">
                      <Package className="h-3 w-3" />
                      Total Units
                    </dt>
                    <dd className="mt-1 text-sm text-white font-semibold">
                      {totalQuantity.toLocaleString()}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-neutral-900/50 ring-1 ring-white/10 p-4">
                    <dt className="text-xs text-neutral-400 flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Total Value
                    </dt>
                    <dd className="mt-1 text-sm text-white font-semibold">
                      ₦{total.toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Metrics Section */}
            <section className="xl:col-span-2 space-y-6">
              {/* Outstanding Section */}
              <div className="mt-6">
                <OutstandingSection productionId={id} />
              </div>

              {/* Expenses Section */}
              <div className="mt-6">
                <ExpenseDropdown data={expenses} />
              </div>

              {/* Financial Summary */}
              <div className="rounded-xl bg-neutral-950/40 border border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight text-white">
                      Financial Summary
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Production financials overview
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Revenue */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-neutral-300">
                        Total Revenue
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>

                  {/* Expenses */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-neutral-300">
                        Total Expenses
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      ₦{expenses_total.toLocaleString()}
                    </span>
                  </div>

                  {/* Net Profit */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      {isProfitable ? (
                        <TrendingUp className="h-4 w-4 text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-sm text-neutral-300">
                        Net Profit/Loss
                      </span>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isProfitable ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isProfitable ? "+" : ""}₦{profitLoss.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Production Status */}
              <div className="rounded-xl bg-neutral-950/40 border border-white/10 p-6">
                <h2 className="text-base font-semibold tracking-tight text-white mb-4">
                  Production Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`rounded-lg p-4 ${
                      break_even
                        ? "bg-green-500/10 ring-1 ring-green-500/20"
                        : "bg-red-500/10 ring-1 ring-red-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {break_even ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          break_even ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        Break Even Status
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {break_even ? "Achieved" : "Not Achieved"}
                    </p>
                  </div>

                  <div
                    className={`rounded-lg p-4 ${
                      short_or_excess
                        ? "bg-amber-500/10 ring-1 ring-amber-500/20"
                        : "bg-blue-500/10 ring-1 ring-blue-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-medium text-amber-400">
                        Inventory Status
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {/* {short_or_excess
                        ? short_amount > 0
                          ? "Shortage"
                          : "Excess"
                        : "Balanced"} */}
                    </p>
                  </div>

                  <div className="rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Factory className="h-4 w-4 text-indigo-400" />
                      <span className="text-xs font-medium text-indigo-400">
                        Production Efficiency
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {((cash / total) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto px-6 py-8 text-xs text-neutral-500">
          © 2025 Top Business Platform — Production Management
        </footer>
      </div>
    </div>
  );
};

export default page;
