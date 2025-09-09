/* eslint-disable @next/next/no-img-element */
import React from "react";
import {
  fetchCustomerById,
  fetchCustomerTotalSpent,
} from "@/app/services/customers";
import { fetchSalesByCustomerId } from "@/app/services/sales";
import { formatDate } from "@/app/services/utils";
import PaymentHistory from "@/app/components/customer/PaymentHistory";
import { AlertTriangle } from "lucide-react";
import PurchaseHistory from "@/app/components/customer/PurchaseHistory";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const {
    name,
    email,
    phone_number,
    created_at,
    debt_free,
    total_debt,
    payment_history,
  } = await fetchCustomerById(id);
  const sales = await fetchSalesByCustomerId(id);
  const total_spent = await fetchCustomerTotalSpent(id);

  return (
    <div className="bg-neutral-950 text-neutral-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200 scrollbar-hide">
      <div className="min-h-screen">
        {/* <!-- Topbar --> */}
        <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 bg-neutral-950/80 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-neutral-900 border border-white/10 flex items-center justify-center text-xs font-semibold tracking-tight text-neutral-200">
                  CX
                </div>
                <div className="text-sm text-neutral-400">
                  Customer Dashboard
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
                    {/* search icon */}
                  </div>
                  <input
                    type="text"
                    placeholder="Search customers"
                    className="w-72 pl-9 pr-3 py-2 text-sm rounded-md bg-neutral-900/70 border border-white/10 outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 placeholder:text-neutral-500 transition"
                  />
                </div>
                <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-neutral-900/70 border border-white/10 hover:bg-neutral-900 hover:border-white/20 transition">
                  {/* download icon */}
                  Export
                </button>
                <button className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-neutral-900 transition">
                  New Sale
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* <!-- Main --> */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* <!-- Customer Overview --> */}
            <section className="xl:col-span-1 rounded-xl border border-white/10 bg-neutral-950/40">
              <div className="p-5 border-b border-white/10">
                <div className="flex items-start gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=512&auto=format&fit=crop"
                    alt="Customer avatar"
                    className="h-14 w-14 rounded-lg object-cover ring-1 ring-white/10"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl tracking-tight font-semibold text-white">
                        {name}
                      </h1>
                      <span
                        id="debtStatusBadge"
                        className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md bg-amber-500/10 ${
                          debt_free ? `text-green-500` : `text-amber-500`
                        } ring-1 ring-amber-300/20`}
                      >
                        {!debt_free && <AlertTriangle size={12} />}
                        {debt_free ? "Debt Free" : "Has Debt"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-neutral-900/50 ring-1 ring-white/10 p-4">
                    <dt className="text-xs text-neutral-400 flex items-center gap-2">
                      {/* user2 icon */}
                      Username
                    </dt>
                    <dd className="mt-1 text-sm text-white">{name}</dd>
                  </div>
                  <div className="rounded-lg bg-neutral-900/50 ring-1 ring-white/10 p-4">
                    <dt className="text-xs text-neutral-400 flex items-center gap-2">
                      {/* phone icon */}
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm text-white">{phone_number}</dd>
                  </div>
                  <div className="rounded-lg bg-neutral-900/50 ring-1 ring-white/10 p-4">
                    <dt className="text-xs text-neutral-400 flex items-center gap-2">
                      {/* mail icon */}
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-white">
                      {email || "customer@email.com"}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-neutral-900/50 ring-1 ring-white/10 p-4">
                    <dt className="text-xs text-neutral-400 flex items-center gap-2">
                      {/* calendar icon */}
                      Member Since
                    </dt>
                    <dd className="mt-1 text-sm text-white">
                      {formatDate(created_at)}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* <!-- Metrics + Chart --> */}
            <section className="xl:col-span-2 space-y-6">
              {/* <!-- KPI Cards --> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-neutral-950/40 border border-white/10 p-4 hover:border-white/20 transition">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-400 flex items-center gap-2">
                      {/* wallet icon */}
                      Outstanding Debt
                    </p>
                    {/* <span className="text-[10px] text-neutral-500">Due</span> */}
                  </div>
                  <div
                    id="outstandingAmount"
                    data-amount="243.50"
                    className="mt-2 text-2xl tracking-tight font-semibold text-white"
                  >
                    ₦{total_debt}
                  </div>
                </div>

                <div className="rounded-xl bg-neutral-950/40 border border-white/10 p-4 hover:border-white/20 transition">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-400 flex items-center gap-2">
                      {/* clock icon */}
                      Last Purchase
                    </p>
                    <span className="text-[10px] text-neutral-500">
                      2 days ago
                    </span>
                  </div>
                  <div className="mt-2 text-2xl tracking-tight font-semibold text-white">
                    {sales.length > 0 ? `₦${sales[0].amount}` : "N/A"}
                  </div>
                </div>
                <div className="rounded-xl bg-neutral-950/40 border border-white/10 p-4 hover:border-white/20 transition">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-400 flex items-center gap-2">
                      {/* shopping bag icon */}
                      Total Orders
                    </p>
                    <span className="text-[10px] text-neutral-500">
                      All time
                    </span>
                  </div>
                  <div className="mt-2 text-2xl tracking-tight font-semibold text-white">
                    {sales.length}
                  </div>
                  {/* <div className="mt-1 text-xs text-emerald-400 inline-flex items-center gap-1">
                
                    +6 this quarter
                  </div> */}
                </div>

                <div className="rounded-xl bg-neutral-950/40 border border-white/10 p-4 hover:border-white/20 transition">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-400 flex items-center gap-2">
                      {/* circle-dollar-sign icon */}
                      Total Spent
                    </p>
                    <span className="text-[10px] text-neutral-500">
                      All time
                    </span>
                  </div>
                  <div className="mt-2 text-2xl tracking-tight font-semibold text-white">
                    ₦{total_spent}
                  </div>
                  <div className="mt-1 text-xs text-neutral-400">
                    Avg. ₦{total_spent / sales.length} / order
                  </div>
                </div>
              </div>

              {/* <!-- Chart + Debt Status --> */}
              <div className="grid grid-cols-1  gap-4">
                <div className="lg:col-span-2 rounded-xl bg-neutral-950/40 border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold tracking-tight text-white">
                        Monthly Purchases
                      </h2>
                      <p className="text-xs text-neutral-400">Last 6 months</p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs bg-neutral-900/70 border border-white/10 px-2.5 py-1 rounded-md">
                      {/* line chart icon */}
                      Updated now
                    </div>
                  </div>
                  {/* <!-- Wrapper to avoid canvas growth bug --> */}
                  <div className="mt-3">
                    <div className="h-48">
                      <canvas
                        id="purchasesChart"
                        className="w-full h-full"
                      ></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* <!-- Payment and Purchase History Table --> */}
          <PaymentHistory payment_history={payment_history} />
          <PurchaseHistory sales={sales} />
        </main>

        <footer className="max-w-7xl mx-auto px-6 py-8 text-xs text-neutral-500">
          © 2025 CX — Top Special
        </footer>
      </div>
    </div>
  );
};

export default page;
