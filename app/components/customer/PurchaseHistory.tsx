/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { formatDate } from "@/app/services/utils";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState } from "react";

const PurchaseHistory = ({ sales }: { sales: any[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate pagination
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = sales.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <section className="mt-6 rounded-xl bg-background border border-foreground/20">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Purchase History
            </h3>
            <p className="text-xs text-foreground">Recent purchases</p>
          </div>
        </div>
        <div className="border-t border-foreground/10"></div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-foreground">
                <th className="font-medium px-3 py-3">Date</th>
                <th className="font-medium px-3 py-3">Amount</th>
                <th className="font-medium px-3 py-3">Remaining</th>
                <th className="font-medium px-3 py-3 text-right pr-4">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentSales.length > 0 ? (
                currentSales.map(
                  (
                    sale: {
                      created_at: string;
                      amount: number;
                      paid: boolean;
                      remaining: number;
                    },
                    index: number
                  ) => (
                    <tr className="hover:bg-foreground/5 transition rounded-md" key={index}>
                      <td className="px-3 py-3 text-foreground">
                        {formatDate(sale.created_at)}
                      </td>
                      <td className="px-3 py-3 text-foreground">
                        ₦{sale.amount}
                      </td>
                      <td className="px-3 py-3 text-foreground">₦{sale.remaining}</td>
                      <td className="px-5 py-3 text-foreground text-right">
                        {sale.paid ? (
                          <Check
                            size={20}
                            color="white"
                            className="bg-green-500 p-1 rounded-full ml-auto"
                          />
                        ) : (
                          <X
                            size={20}
                            color="white"
                            className="bg-red-500 p-1 rounded-full ml-auto"
                          />
                        )}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-8 text-center text-foreground"
                  >
                    No purchase history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {sales.length > itemsPerPage && (
          <div className="border-t border-foreground/10 px-4 py-3 flex items-center justify-between">
            <div className="text-xs text-foreground-400">
              Showing {startIndex + 1} to {Math.min(endIndex, sales.length)} of{" "}
              {sales.length} purchases
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-neutral-900 border border-white/10 hover:bg-neutral-800 hover:border-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <div className="text-xs text-neutral-400">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-neutral-900 border border-white/10 hover:bg-neutral-800 hover:border-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PurchaseHistory;
