"use client";

import { LoanInputs } from "@/types";
import { calculateEMI } from "@/lib/emi";
import { formatCurrency } from "@/lib/format";

type Props = {
  loanInputs: LoanInputs;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function unique(values: number[]) {
  return Array.from(new Set(values));
}

export default function SensitivityTable({ loanInputs }: Props) {
  const rateOffsets = [-3, -2, -1, 0, 1, 2, 3];
  const tenureOffsets = [-24, -12, -6, 0, 6, 12, 24];

  const rates = unique(
    rateOffsets.map((offset) => clamp(Number((loanInputs.rate + offset).toFixed(1)), 1, 36))
  );

  const tenures = unique(
    tenureOffsets.map((offset) => clamp(loanInputs.tenure + offset, 1, 84))
  );

  return (
    <section className="mt-6 rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
      <h2 className="text-lg font-semibold">What-If Sensitivity Table</h2>
      <p className="mt-1 text-sm text-slate-500">
        EMI changes across nearby interest rates and tenures.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border bg-slate-100 p-3 text-left">
                Tenure \ Rate
              </th>

              {rates.map((rate) => (
                <th key={rate} className="border bg-slate-100 p-3 text-right">
                  {rate}%
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tenures.map((tenure) => (
              <tr key={tenure}>
                <th className="border bg-slate-50 p-3 text-left font-semibold">
                  {tenure} mo
                </th>

                {rates.map((rate) => {
                  const isCurrent =
                    tenure === loanInputs.tenure && rate === loanInputs.rate;

                  const emi = calculateEMI(loanInputs.amount, rate, tenure);

                  return (
                    <td
                      key={`${tenure}-${rate}`}
                      className={`border p-3 text-right ${
                        isCurrent
                          ? "bg-indigo-600 font-bold text-white"
                          : "bg-white"
                      }`}
                    >
                      {formatCurrency(emi)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}