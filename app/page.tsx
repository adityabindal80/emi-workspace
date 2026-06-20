"use client";

import { useMemo, useState } from "react";
import AmortizationSchedule from "@/components/AmortizationSchedule";
import LoanInputPanel from "@/components/LoanInputPanel";
import ComparisonMode from "@/components/ComparisonMode";
import SensitivityTable from "@/components/SensitivityTable";
import PrepaymentPlanner from "@/components/PrepaymentPlanner";
import ModeTabs from "@/components/ModeTabs";
import useSharedWorkspace from "@/hooks/useSharedWorkspace";
import { DEFAULT_WORKSPACE_STATE } from "@/lib/constants";
import { WorkspaceState } from "@/types";
import usePresence from "@/hooks/usePresence";
import {
  calculateEMI,
  calculateSplit,
  calculateTotalInterest,
  calculateTotalPayable,
  generateAmortizationSchedule,
  generatePrepaymentSchedule,
} from "@/lib/emi";
import { formatCurrency } from "@/lib/format";

export default function Home() {
 
  const [workspace, setWorkspace] = useState<WorkspaceState>(
  DEFAULT_WORKSPACE_STATE
);
const { activeTabs } = usePresence();
const { tabId } = useSharedWorkspace({
  state: workspace,
  setState: setWorkspace,
});
const { loanInputs, scenarios, prepayments, mode ,theme} = workspace;

const results = useMemo(() => {
  const schedule = generateAmortizationSchedule(
  loanInputs.amount,
  loanInputs.rate,
  loanInputs.tenure
);
const prepaymentResult = generatePrepaymentSchedule(
  loanInputs.amount,
  loanInputs.rate,
  loanInputs.tenure,
  prepayments
);

const activeSchedule =
  prepayments.length > 0 ? prepaymentResult.schedule : schedule;
  const emi = calculateEMI(
    loanInputs.amount,
    loanInputs.rate,
    loanInputs.tenure
  );

  const totalPayable = calculateTotalPayable(emi, loanInputs.tenure);

  const totalInterest = calculateTotalInterest(
    loanInputs.amount,
    totalPayable
  );

  const split = calculateSplit(
    loanInputs.amount,
    totalPayable,
    totalInterest
  );

return {
  emi,
  totalPayable,
  totalInterest,
  split,
  schedule: activeSchedule,
};
}, [loanInputs, prepayments]);

  return (
    <main
  className={`min-h-screen ${
    theme === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-slate-100 text-slate-900"
  }`}
>
      <section className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-3xl font-bold">EMI Workspace</h1>
        <p className="mt-2 text-slate-600">
          Loan calculator with shared cross-tab workspace.
        </p>
<p>
  Tab ID: {tabId ? tabId.slice(0, 8) : "Loading..."}
</p>
<p className="mt-2 text-sm text-slate-500">
  Active Tabs: {activeTabs}
</p>
<button
  onClick={() =>
    setWorkspace((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }))
  }
  className="mt-4 rounded-lg border px-4 py-2 text-sm"
>
  Switch to {theme === "light" ? "Dark" : "Light"} Mode
</button>
        <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
          <LoanInputPanel values={loanInputs} onChange={(values) =>
  setWorkspace((prev) => ({
    ...prev,
    loanInputs: values,
  }))} />

          <section className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
            <h2 className="text-lg font-semibold">Summary</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <SummaryCard label="Monthly EMI" value={formatCurrency(results.emi)} />
              <SummaryCard
                label="Total Interest"
                value={formatCurrency(results.totalInterest)}
              />
              <SummaryCard
                label="Total Payable"
                value={formatCurrency(results.totalPayable)}
              />
            </div>
            <div className="mt-8">
  <div className="mb-2 flex items-center justify-between text-sm">
    <span className="font-medium text-slate-700">
      Principal vs Interest
    </span>
    <span className="text-slate-500">
      {results.split.principalPercent.toFixed(1)}% /{" "}
      {results.split.interestPercent.toFixed(1)}%
    </span>
  </div>

  <div className="h-4 overflow-hidden rounded-full bg-slate-200">
    <div
      className="h-full bg-indigo-600"
      style={{
        width: `${results.split.principalPercent}%`,
      }}
    />
  </div>

  <div className="mt-3 flex gap-6 text-sm text-slate-600">
    <div>
      <span className="mr-2 inline-block h-3 w-3 rounded-full bg-indigo-600" />
      Principal
    </div>
    <div>
      <span className="mr-2 inline-block h-3 w-3 rounded-full bg-slate-300" />
      Interest
    </div>
  </div>
</div>
          </section>
        </div>
        <ModeTabs mode={mode} onChange={(value) =>
  setWorkspace((prev) => ({
    ...prev,
    mode: value,
  }))} />
       {mode === "single" && (
        <>
          <SensitivityTable loanInputs={loanInputs} />
          <AmortizationSchedule schedule={results.schedule} />
        </>
      )}

      {mode === "compare" && (
        <ComparisonMode
          scenarios={scenarios}
          onChange={(values) =>
  setWorkspace((prev) => ({
    ...prev,
    scenarios: values,
  }))}
        />
      )}

      {mode === "prepayment" && (
        <>
          <PrepaymentPlanner
            loanInputs={loanInputs}
            prepayments={prepayments}
            onChange={(values) =>
  setWorkspace((prev) => ({
    ...prev,
    prepayments: values,
  }))}
          />

          <AmortizationSchedule
            schedule={results.schedule}
          />
        </>
      )}
    </section>
  </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}