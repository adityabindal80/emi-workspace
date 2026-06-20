export type LoanInputs = {
  amount: number;
  rate: number;
  tenure: number;
};

export type AmortizationRow = {
  month: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  balanceRemaining: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
  isBreakEven: boolean;
};

export type Scenario = {
  id: string;
  name: string;
  amount: number;
  rate: number;
  tenure: number;
};

export type Prepayment = {
  id: string;
  month: number;
  amount: number;
};

export type Theme = "light" | "dark";

export type WorkspaceState = {
  loanInputs: LoanInputs;
  scenarios: Scenario[];
  prepayments: Prepayment[];
  mode: "single" | "compare" | "prepayment";
  theme: Theme;
};