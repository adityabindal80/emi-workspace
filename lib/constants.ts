import { WorkspaceState } from "@/types";

export const DEFAULT_WORKSPACE_STATE: WorkspaceState = {
  loanInputs: {
    amount: 1500000,
    rate: 11,
    tenure: 48,
  },

  scenarios: [
    {
      id: "a",
      name: "Scenario A",
      amount: 1500000,
      rate: 11,
      tenure: 24,
    },
    {
      id: "b",
      name: "Scenario B",
      amount: 1500000,
      rate: 11,
      tenure: 48,
    },
    {
      id: "c",
      name: "Scenario C",
      amount: 1500000,
      rate: 11,
      tenure: 60,
    },
  ],

  prepayments: [],

  mode: "single",

  theme: "light",
};