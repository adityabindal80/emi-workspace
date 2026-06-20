"use client";

import { Scenario } from "@/types";
import {
  calculateEMI,
  calculateTotalInterest,
  calculateTotalPayable,
} from "@/lib/emi";
import { formatCurrency } from "@/lib/format";

type Props = {
  scenarios: Scenario[];
  onChange: (scenarios: Scenario[]) => void;
};

export default function ComparisonMode({ scenarios, onChange }: Props) {
  const results = scenarios.map((scenario) => {
    const emi = calculateEMI(scenario.amount, scenario.rate, scenario.tenure);
    const totalPayable = calculateTotalPayable(emi, scenario.tenure);
    const totalInterest = calculateTotalInterest(scenario.amount, totalPayable);

    return {
      ...scenario,
      emi,
      totalPayable,
      totalInterest,
    };
  });

  const bestTotal = Math.min(...results.map((item) => item.totalPayable));

  function updateScenario(
    id: string,
    field: keyof Omit<Scenario, "id" | "name">,
    value: number
  ) {
    onChange(
      scenarios.map((scenario) =>
        scenario.id === id ? { ...scenario, [field]: value } : scenario
      )
    );
  }

  return (
<section className="mt-6 rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
          <h2 className="text-lg font-semibold">Loan Comparison</h2>
      <p className="mt-1 text-sm text-slate-500">
        Compare up to 3 loan scenarios side by side.
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {results.map((scenario) => {
          const isBest = scenario.totalPayable === bestTotal;

          return (
            <div
              key={scenario.id}
              className={`rounded-2xl border p-4 ${
                isBest ? "border-emerald-400 bg-emerald-50" : "bg-slate-50"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">{scenario.name}</h3>

                {isBest && (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                    Lowest Cost
                  </span>
                )}
              </div>

              <CompareInput
                label="Amount"
                value={scenario.amount}
                min={10000}
                max={5000000}
                step={10000}
                prefix="₹"
                onChange={(value) =>
                  updateScenario(scenario.id, "amount", value)
                }
              />

              <CompareInput
                label="Rate"
                value={scenario.rate}
                min={1}
                max={36}
                step={0.1}
                suffix="%"
                onChange={(value) => updateScenario(scenario.id, "rate", value)}
              />

              <CompareInput
                label="Tenure"
                value={scenario.tenure}
                min={1}
                max={84}
                step={1}
                suffix="mo"
                onChange={(value) =>
                  updateScenario(scenario.id, "tenure", value)
                }
              />

              <div className="mt-5 space-y-3 border-t pt-4 text-sm">
                <ResultRow label="Monthly EMI" value={formatCurrency(scenario.emi)} />
                <ResultRow
                  label="Total Interest"
                  value={formatCurrency(scenario.totalInterest)}
                />
                <ResultRow
                  label="Total Payable"
                  value={formatCurrency(scenario.totalPayable)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CompareInput({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-slate-500">{label}</label>
        <div className="flex items-center rounded-lg border bg-white px-2 py-1">
          {prefix && <span className="text-xs text-slate-400">{prefix}</span>}
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
  const rawValue = Number(e.target.value);
  const clampedValue = Math.min(Math.max(rawValue, min), max);
  onChange(clampedValue);
}}
            className="w-24 bg-transparent text-right text-sm font-semibold outline-none"
          />
          {suffix && <span className="ml-1 text-xs text-slate-400">{suffix}</span>}
        </div>
      </div>

      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}