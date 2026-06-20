import { AmortizationRow, Prepayment } from "@/types";

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
) {
  const r = annualRate / 12 / 100;

  if (principal <= 0 || tenureMonths <= 0) return 0;

  if (r === 0) {
    return principal / tenureMonths;
  }

  const emi =
    (principal * r * Math.pow(1 + r, tenureMonths)) /
    (Math.pow(1 + r, tenureMonths) - 1);

  return emi;
}

export function calculateTotalPayable(
  emi: number,
  tenureMonths: number
) {
  return emi * tenureMonths;
}

export function calculateTotalInterest(
  principal: number,
  totalPayable: number
) {
  return totalPayable - principal;
}

export function calculateSplit(
  principal: number,
  totalPayable: number,
  totalInterest: number
) {
  if (totalPayable <= 0) {
    return {
      principalPercent: 0,
      interestPercent: 0,
    };
  }

  return {
    principalPercent: (principal / totalPayable) * 100,
    interestPercent: (totalInterest / totalPayable) * 100,
  };
}

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number
): AmortizationRow[] {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const monthlyRate = annualRate / 12 / 100;

  let balance = principal;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;
  let breakEvenFound = false;

  const schedule: AmortizationRow[] = [];

  for (let month = 1; month <= tenureMonths; month++) {
    const interestPaid = balance * monthlyRate;
    let principalPaid = emi - interestPaid;

    if (principalPaid > balance) {
      principalPaid = balance;
    }

    balance = balance - principalPaid;

    cumulativePrincipal += principalPaid;
    cumulativeInterest += interestPaid;

    const isBreakEven =
      !breakEvenFound && cumulativePrincipal > cumulativeInterest;

    if (isBreakEven) {
      breakEvenFound = true;
    }

    schedule.push({
      month,
      emi,
      principalPaid,
      interestPaid,
      balanceRemaining: Math.max(balance, 0),
      cumulativePrincipal,
      cumulativeInterest,
      isBreakEven,
    });

    if (balance <= 0) break;
  }

  return schedule;
}

export function generatePrepaymentSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  prepayments: Prepayment[]
) {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const monthlyRate = annualRate / 12 / 100;

  const originalSchedule = generateAmortizationSchedule(
    principal,
    annualRate,
    tenureMonths
  );

  const originalInterest = originalSchedule.reduce(
    (sum, row) => sum + row.interestPaid,
    0
  );

  const prepaymentMap = prepayments.reduce<Record<number, number>>((acc, item) => {
    if (item.month >= 1 && item.month <= tenureMonths && item.amount > 0) {
      acc[item.month] = (acc[item.month] || 0) + item.amount;
    }
    return acc;
  }, {});

  let balance = principal;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;
  let breakEvenFound = false;

  const schedule: AmortizationRow[] = [];

  for (let month = 1; month <= tenureMonths; month++) {
    const extraPayment = Math.min(prepaymentMap[month] || 0, balance);
    balance -= extraPayment;
    cumulativePrincipal += extraPayment;

    if (balance <= 0) {
      schedule.push({
        month,
        emi: 0,
        principalPaid: extraPayment,
        interestPaid: 0,
        balanceRemaining: 0,
        cumulativePrincipal,
        cumulativeInterest,
        isBreakEven: !breakEvenFound && cumulativePrincipal > cumulativeInterest,
      });
      break;
    }

    const interestPaid = balance * monthlyRate;
    let principalPaid = emi - interestPaid;

    if (principalPaid > balance) {
      principalPaid = balance;
    }

    balance -= principalPaid;
    cumulativePrincipal += principalPaid;
    cumulativeInterest += interestPaid;

    const isBreakEven =
      !breakEvenFound && cumulativePrincipal > cumulativeInterest;

    if (isBreakEven) breakEvenFound = true;

    schedule.push({
      month,
      emi,
      principalPaid: principalPaid + extraPayment,
      interestPaid,
      balanceRemaining: Math.max(balance, 0),
      cumulativePrincipal,
      cumulativeInterest,
      isBreakEven,
    });

    if (balance <= 0) break;
  }

  const newInterest = schedule.reduce((sum, row) => sum + row.interestPaid, 0);

  return {
    schedule,
    newTenure: schedule.length,
    tenureReduced: tenureMonths - schedule.length,
    interestSaved: originalInterest - newInterest,
  };
}