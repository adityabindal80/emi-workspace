"use client";

import { LoanInputs } from "@/types";

type Props = {
  values: LoanInputs;
  onChange: (values: LoanInputs) => void;
};

export default function LoanInputPanel({ values, onChange }: Props) {
  function updateField(field: keyof LoanInputs, value: number) {
    onChange({
      ...values,
      [field]: value,
    });
  }

  return (
    <section className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
      <h2 className="text-lg font-semibold">Loan Details</h2>
      <p className="mb-6 text-sm text-slate-500">
        Adjust values and watch EMI update instantly.
      </p>

      <InputSlider
        label="Loan Amount"
        prefix="₹"
        min={10000}
        max={5000000}
        step={10000}
        value={values.amount}
        onChange={(value) => updateField("amount", value)}
      />

      <InputSlider
        label="Interest Rate (p.a.)"
        suffix="%"
        min={1}
        max={36}
        step={0.1}
        value={values.rate}
        onChange={(value) => updateField("rate", value)}
      />

      <InputSlider
        label="Tenure"
        suffix="mo"
        min={1}
        max={84}
        step={1}
        value={values.tenure}
        onChange={(value) => updateField("tenure", value)}
      />
    </section>
  );
}

type InputSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
};

function InputSlider({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}: InputSliderProps) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-slate-700">{label}</label>

        <div className="flex items-center rounded-lg border bg-slate-50 px-3 py-2">
          {prefix && <span className="mr-1 text-slate-500">{prefix}</span>}

          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
           onChange={(e) => {
  const rawValue = Number(e.target.value);
  const clampedValue = Math.min(Math.max(rawValue, min), max);
  onChange(clampedValue);
}}
            className="w-28 bg-transparent text-right text-sm font-semibold outline-none"
          />

          {suffix && <span className="ml-1 text-slate-500">{suffix}</span>}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />

      <div className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{prefix ? `${prefix}${min}` : min}</span>
        <span>{prefix ? `${prefix}${max}` : max}</span>
      </div>
    </div>
  );
}