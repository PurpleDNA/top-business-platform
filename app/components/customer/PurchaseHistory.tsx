/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from "@/app/services/utils";
import { Check, X } from "lucide-react";
import React from "react";
const PurchaseHistory = async ({ sales }: { sales: any[] }) => {
  return (
    <div>
      <section className="mt-6 rounded-xl bg-neutral-950/40 border border-white/10">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              Purchase History
            </h3>
            <p className="text-xs text-neutral-400">Recent purchases</p>
          </div>
          {/* <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md bg-neutral-900 border border-white/10 hover:bg-neutral-800 hover:border-white/20 transition">
              filter icon
              Filters
            </button>
            <button className="inline-flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md bg-neutral-900 border border-white/10 hover:bg-neutral-800 hover:border-white/20 transition">
              colums 3 icon
              Columns
            </button>
          </div> */}
        </div>
        <div className="border-t border-white/10"></div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400">
                <th className="font-medium px-3 py-3">Date</th>
                <th className="font-medium px-3 py-3">Amount</th>
                <th className="font-medium px-3 py-3 text-right pr-4">Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sales.map(
                (
                  sale: { created_at: string; amount: number; paid: boolean },
                  index: number
                ) => (
                  <tr className="hover:bg-white/5 transition" key={index}>
                    <td className="px-3 py-3 text-neutral-400">
                      {formatDate(sale.created_at)}
                    </td>
                    <td className="px-3 py-3 text-neutral-100">
                      ₦{sale.amount}
                    </td>
                    <td className=" px-5 py-3 text-neutral-100 text-right">
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
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PurchaseHistory;
