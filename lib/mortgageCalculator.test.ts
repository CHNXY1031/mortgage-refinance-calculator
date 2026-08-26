import { describe, expect, it } from "vitest";

import {
  calculateAmortization,
  calculateMonthlyPayment,
  calculateRefinance,
} from "./mortgageCalculator";

describe("mortgage calculator", () => {
  it("calculates the standard fixed-rate monthly payment", () => {
    expect(calculateMonthlyPayment(350_000, 6.8, 25)).toBeCloseTo(2429.25, 2);
  });

  it("supports zero-percent loans", () => {
    expect(calculateMonthlyPayment(120_000, 0, 10)).toBe(1000);
  });

  it("uses closing costs divided by monthly savings for break-even", () => {
    const result = calculateRefinance({
      currentBalance: 350_000,
      currentAnnualRate: 6.8,
      currentRemainingYears: 25,
      newAnnualRate: 5.3,
      newLoanYears: 30,
      closingCosts: 4200,
      extraMonthlyPayment: 200,
    });

    expect(result.oldMonthlyPayment).toBeCloseTo(2429.25, 2);
    expect(result.newMonthlyPayment).toBeCloseTo(1943.57, 2);
    expect(result.breakEvenMonths).toBe(
      Math.ceil(4200 / result.monthlyPaymentSavings),
    );
    expect(result.breakEvenMonths).toBe(9);
  });

  it("returns no break-even when the required payment does not decrease", () => {
    const result = calculateRefinance({
      currentBalance: 300_000,
      currentAnnualRate: 4,
      currentRemainingYears: 30,
      newAnnualRate: 5,
      newLoanYears: 15,
      closingCosts: 5000,
    });

    expect(result.monthlyPaymentSavings).toBeLessThan(0);
    expect(result.breakEvenMonths).toBeNull();
  });

  it("extra payments reduce interest and payoff time", () => {
    const withoutExtra = calculateAmortization(350_000, 5.3, 30);
    const withExtra = calculateAmortization(350_000, 5.3, 30, 200);

    expect(withExtra.actualMonths).toBeLessThan(withoutExtra.actualMonths);
    expect(withExtra.totalInterest).toBeLessThan(withoutExtra.totalInterest);
  });

  it("rejects invalid financial inputs", () => {
    expect(() => calculateMonthlyPayment(-1, 6, 30)).toThrow(RangeError);
    expect(() => calculateMonthlyPayment(100_000, -1, 30)).toThrow(RangeError);
  });
});
