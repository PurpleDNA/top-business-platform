import React from "react";

const PaymentHistory = async ({
  payment_history,
}: {
  payment_history: { date: string; amount_paid: number }[];
}) => {
  return (
    <div>
      <section className="mt-6 rounded-xl bg-neutral-950/40 border border-white/10">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              Payment History
            </h3>
            <p className="text-xs text-neutral-400">Recent payments</p>
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
                {/* <th className="font-medium px-3 py-3 text-right pr-4">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payment_history.map(
                (
                  payment: { date: string; amount_paid: number },
                  index: number
                ) => (
                  <tr className="hover:bg-white/5 transition" key={index}>
                    <td className="px-3 py-3 text-neutral-400">
                      {payment.date}
                    </td>
                    <td className="px-3 py-3 text-neutral-100">
                      ₦{payment.amount_paid}
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

export default PaymentHistory;
