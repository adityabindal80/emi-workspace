"use client";

import { useMemo, useState } from "react";
import { AmortizationRow } from "@/types";
import { formatCurrency } from "@/lib/format";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  schedule: AmortizationRow[];
};

const ROWS_PER_PAGE = 10;

export default function AmortizationSchedule({ schedule }: Props) {
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"table" | "chart">("table");

  const totalPages = Math.ceil(schedule.length / ROWS_PER_PAGE);

  const visibleRows = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    return schedule.slice(start, start + ROWS_PER_PAGE);
  }, [schedule, page]);

  const chartData = useMemo(() => {
    return schedule.map((row) => ({
      month: row.month,
      Principal: Math.round(row.principalPaid),
      Interest: Math.round(row.interestPaid),
    }));
  }, [schedule]);
function exportCSV() {
  const headers = [
    "Month",
    "EMI",
    "Principal Paid",
    "Interest Paid",
    "Balance Remaining",
  ];

  const rows = schedule.map((row) => [
    row.month,
    Math.round(row.emi),
    Math.round(row.principalPaid),
    Math.round(row.interestPaid),
    Math.round(row.balanceRemaining),
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "amortization-schedule.csv";
  link.click();

  URL.revokeObjectURL(url);
}
  return (
    <section className="mt-6 rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Amortization Schedule</h2>
<button
  onClick={exportCSV}
  className="rounded-lg border px-4 py-2 text-sm"
>
  Export CSV
</button>
        <div className="rounded-xl border bg-slate-100 p-1">
          <button
            onClick={() => setView("table")}
            className={`rounded-lg px-4 py-2 text-sm ${
              view === "table" ? "bg-white shadow-sm" : "text-slate-500"
            }`}
          >
            Table
          </button>

          <button
            onClick={() => setView("chart")}
            className={`rounded-lg px-4 py-2 text-sm ${
              view === "chart" ? "bg-white shadow-sm" : "text-slate-500"
            }`}
          >
            Chart
          </button>
        </div>
      </div>

      {view === "table" ? (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-left text-slate-600">
                  <th className="p-3">Month</th>
                  <th className="p-3">EMI</th>
                  <th className="p-3">Principal Paid</th>
                  <th className="p-3">Interest Paid</th>
                  <th className="p-3">Balance Remaining</th>
                </tr>
              </thead>

              <tbody>
                {visibleRows.map((row) => (
                  <tr
                    key={row.month}
                    className={
                      row.isBreakEven
                        ? "border-b bg-emerald-50 font-semibold"
                        : "border-b"
                    }
                  >
                    <td className="p-3">
                      {row.month}
                      {row.isBreakEven && (
                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                          Break-even
                        </span>
                      )}
                    </td>
                    <td className="p-3">{formatCurrency(row.emi)}</td>
                    <td className="p-3 text-indigo-600">{formatCurrency(row.principalPaid)}</td>
                    <td className="p-3 text-amber-600">{formatCurrency(row.interestPaid)}</td>
                    <td className="p-3 ">{formatCurrency(row.balanceRemaining)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="mt-5 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="Principal" stackId="a" fill="#4f46e5" />
              <Bar dataKey="Interest" stackId="a" fill="#cbd5e1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}