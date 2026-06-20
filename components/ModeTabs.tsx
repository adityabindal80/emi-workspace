"use client";

export type AppMode = "single" | "compare" | "prepayment";

type Props = {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
};

export default function ModeTabs({ mode, onChange }: Props) {
  const tabs: { label: string; value: AppMode }[] = [
    { label: "Single Mode", value: "single" },
    { label: "Compare Mode", value: "compare" },
    { label: "Prepayment", value: "prepayment" },
  ];

  return (
    <div className="mt-6 flex gap-2 rounded-2xl border bg-white p-2 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium ${
            mode === tab.value
              ? "bg-indigo-600 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}