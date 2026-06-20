"use client";

import { LoanInputs, Prepayment } from "@/types";
import { generatePrepaymentSchedule } from "@/lib/emi";
import { formatCurrency } from "@/lib/format";

type Props = {
  loanInputs: LoanInputs;
  prepayments: Prepayment[];
  onChange: (prepayments: Prepayment[]) => void;
};

export default function PrepaymentPlanner({
  loanInputs,
  prepayments,
  onChange,
}: Props) {
  const result = generatePrepaymentSchedule(
    loanInputs.amount,
    loanInputs.rate,
    loanInputs.tenure,
    prepayments
  );

  function addPrepayment() {
    onChange([
      ...prepayments,
      {
        id: crypto.randomUUID(),
        month: 12,
        amount: 100000,
      },
    ]);
  }

  function updatePrepayment(id: string, field: "month" | "amount", value: number) {
    onChange(
      prepayments.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function removePrepayment(id: string) {
    onChange(prepayments.filter((item) => item.id !== id));
  }

  return (
<section className="mt-6 rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
          <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Prepayment Planner</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add lump-sum payments and see interest saved.
          </p>
        </div>

        <button
          onClick={addPrepayment}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Add Prepayment
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <InfoCard label="New Tenure" value={`${result.newTenure} months`} />
        <InfoCard label="Tenure Reduced" value={`${result.tenureReduced} months`} />
        <InfoCard label="Interest Saved" value={formatCurrency(result.interestSaved)} />
      </div>

      <div className="mt-5 space-y-3">
        {prepayments.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            No prepayments added yet.
          </p>
        ) : (
          prepayments.map((item) => (
            <div
              key={item.id}
              className="grid gap-3 rounded-xl border bg-slate-50 p-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <div>
                <label className="text-xs font-medium text-slate-500">
                  Month
                </label>
                <input
                  type="number"
                  min={1}
                  max={loanInputs.tenure}
                  value={item.month}
                  onChange={(e) =>
                    updatePrepayment(item.id, "month", Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">
                  Amount
                </label>
                <input
                  type="number"
                  min={1}
                  value={item.amount}
                  onChange={(e) =>
                    updatePrepayment(item.id, "amount", Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2 outline-none"
                />
              </div>

              <button
                onClick={() => removePrepayment(item.id)}
                className="self-end rounded-lg border px-4 py-2 text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4 text-slate-900">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}