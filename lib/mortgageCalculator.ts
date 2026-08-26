export interface MortgageInputs {
  currentBalance: number;
  currentAnnualRate: number;
  currentRemainingYears: number;
  newAnnualRate: number;
  newLoanYears: number;
  closingCosts: number;
  extraMonthlyPayment?: number;
}

export interface AmortizationSummary {
  scheduledMonthlyPayment: number;
  actualMonths: number;
  totalInterest: number;
  totalPaid: number;
}

export interface MortgageResults {
  oldMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlyPaymentSavings: number;
  breakEvenMonths: number | null;
  lifetimeInterestSaved: number;
  oldLoan: AmortizationSummary;
  newLoan: AmortizationSummary;
}

const MONTHS_PER_YEAR = 12;
const PERCENT = 100;
const EPSILON = 0.005;

function assertNonNegative(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a finite, non-negative number.`);
  }
}

function assertPositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a finite number greater than zero.`);
  }
}

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  assertPositive(principal, "Principal");
  assertNonNegative(annualRate, "Annual rate");
  assertPositive(years, "Loan term");

  const months = Math.round(years * MONTHS_PER_YEAR);
  const monthlyRate = annualRate / PERCENT / MONTHS_PER_YEAR;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const growth = (1 + monthlyRate) ** months;
  return principal * ((monthlyRate * growth) / (growth - 1));
}

export function calculateAmortization(
  principal: number,
  annualRate: number,
  years: number,
  extraMonthlyPayment = 0,
): AmortizationSummary {
  assertNonNegative(extraMonthlyPayment, "Extra monthly payment");

  const scheduledMonthlyPayment = calculateMonthlyPayment(
    principal,
    annualRate,
    years,
  );
  const monthlyRate = annualRate / PERCENT / MONTHS_PER_YEAR;
  const maximumMonths = Math.round(years * MONTHS_PER_YEAR);
  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;

  while (balance > EPSILON && month < maximumMonths) {
    const interest = balance * monthlyRate;
    const plannedPayment = scheduledMonthlyPayment + extraMonthlyPayment;
    const payment = Math.min(plannedPayment, balance + interest);
    const principalPayment = payment - interest;

    if (principalPayment <= 0) {
      throw new RangeError("Monthly payment does not cover accrued interest.");
    }

    balance = Math.max(0, balance - principalPayment);
    totalInterest += interest;
    totalPaid += payment;
    month += 1;
  }

  return {
    scheduledMonthlyPayment,
    actualMonths: month,
    totalInterest,
    totalPaid,
  };
}

export function calculateRefinance(
  inputs: MortgageInputs,
): MortgageResults {
  assertPositive(inputs.currentBalance, "Current loan balance");
  assertNonNegative(inputs.currentAnnualRate, "Current annual rate");
  assertPositive(inputs.currentRemainingYears, "Current remaining term");
  assertNonNegative(inputs.newAnnualRate, "New annual rate");
  assertPositive(inputs.newLoanYears, "New loan term");
  assertNonNegative(inputs.closingCosts, "Closing costs");

  const oldLoan = calculateAmortization(
    inputs.currentBalance,
    inputs.currentAnnualRate,
    inputs.currentRemainingYears,
  );
  const newLoan = calculateAmortization(
    inputs.currentBalance,
    inputs.newAnnualRate,
    inputs.newLoanYears,
    inputs.extraMonthlyPayment ?? 0,
  );
  const monthlyPaymentSavings =
    oldLoan.scheduledMonthlyPayment - newLoan.scheduledMonthlyPayment;
  const breakEvenMonths =
    monthlyPaymentSavings > 0
      ? Math.ceil(inputs.closingCosts / monthlyPaymentSavings)
      : null;

  return {
    oldMonthlyPayment: oldLoan.scheduledMonthlyPayment,
    newMonthlyPayment: newLoan.scheduledMonthlyPayment,
    monthlyPaymentSavings,
    breakEvenMonths,
    lifetimeInterestSaved: oldLoan.totalInterest - newLoan.totalInterest,
    oldLoan,
    newLoan,
  };
}
