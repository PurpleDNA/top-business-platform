"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const PaymentHistory = ({
  payment_history,
}: {
  payment_history: { paid_at: string; amount_paid: number }[] | null;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const payments = payment_history || [];

  // Calculate pagination
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = payments.slice(startIndex, endIndex);

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
              Payment History
            </h3>
            <p className="text-xs text-foreground">Recent payments</p>
          </div>
        </div>
        <div className="border-t border-foreground/10"></div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-foreground">
                <th className="font-medium px-3 py-3">Date</th>
                <th className="font-medium px-3 py-3">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentPayments.length > 0 ? (
                currentPayments.map(
                  (
                    payment: { paid_at: string; amount_paid: number },
                    index: number
                  ) => (
                    <tr
                      className="hover:bg-foreground/5 transition rounded-md"
                      key={index}
                    >
                      <td className="px-3 py-3 text-foreground">
                        {payment?.paid_at}
                      </td>
                      <td className="px-3 py-3 text-foreground">
                        ₦{payment?.amount_paid}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-3 py-8 text-center text-foreground"
                  >
                    No payment history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {payments.length > itemsPerPage && (
          <div className="border-t border-foreground/10 px-4 py-3 flex items-center justify-between">
            <div className="text-xs text-foreground-400">
              Showing {startIndex + 1} to {Math.min(endIndex, payments.length)}{" "}
              of {payments.length} payments
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-neutral-900 border border-white/10 hover:bg-neutral-800 hover:border-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="text-xs text-neutral-400">
                {currentPage} / {totalPages}
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-neutral-900 border border-white/10 hover:bg-neutral-800 hover:border-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PaymentHistory;
