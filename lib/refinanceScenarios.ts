export const LOAN_AMOUNTS = [
  200_000,
  300_000,
  400_000,
  500_000,
  600_000,
  800_000,
] as const;

export const RATE_SCENARIOS = [
  [7.5, 6.5],
  [7.5, 6.25],
  [7.5, 6.0],
  [7.25, 6.25],
  [7.25, 6.0],
  [7.25, 5.75],
  [7.0, 6.25],
  [7.0, 6.0],
  [7.0, 5.75],
  [7.0, 5.5],
  [6.8, 6.0],
  [6.8, 5.75],
  [6.8, 5.5],
  [6.8, 5.3],
  [6.75, 5.75],
  [6.75, 5.5],
  [6.75, 5.25],
  [6.5, 5.75],
  [6.5, 5.5],
  [6.5, 5.25],
  [6.5, 5.0],
  [6.25, 5.5],
  [6.25, 5.25],
  [6.25, 5.0],
  [6.0, 5.25],
  [6.0, 5.0],
  [6.0, 4.8],
] as const;

export interface RefinanceScenario {
  amount: number;
  currentRate: number;
  newRate: number;
  amountSlug: string;
  ratesSlug: string;
}

export function amountToSlug(amount: number) {
  return `${amount / 1000}k`;
}

export function ratesToSlug(currentRate: number, newRate: number) {
  return `${currentRate}-to-${newRate}`;
}

export const REFINANCE_SCENARIOS: RefinanceScenario[] = LOAN_AMOUNTS.flatMap(
  (amount) =>
    RATE_SCENARIOS.map(([currentRate, newRate]) => ({
      amount,
      currentRate,
      newRate,
      amountSlug: amountToSlug(amount),
      ratesSlug: ratesToSlug(currentRate, newRate),
    })),
);

export function findScenario(amountSlug: string, ratesSlug: string) {
  return REFINANCE_SCENARIOS.find(
    (scenario) =>
      scenario.amountSlug === amountSlug && scenario.ratesSlug === ratesSlug,
  );
}
