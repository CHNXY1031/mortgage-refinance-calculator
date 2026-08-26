"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  Building2,
  Check,
  Clipboard,
  Clock3,
  DollarSign,
  Info,
  LineChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { calculateRefinance } from "@/lib/mortgageCalculator";
import { cn } from "@/lib/utils";

interface RefinanceCalculatorProps {
  initialBalance?: number;
  initialCurrentRate?: number;
  initialNewRate?: number;
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const currencyPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function FieldLabel({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label className="text-sm font-bold text-navy">{children}</label>
      {hint ? <span className="text-xs font-medium text-slateink/65">{hint}</span> : null}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step = 1,
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min: number;
  max: number;
  step?: number;
  ariaLabel: string;
}) {
  return (
    <div className="flex h-11 items-center rounded-lg border border-navy/15 bg-white px-3 transition focus-within:border-emerald focus-within:ring-2 focus-within:ring-emerald/15">
      {prefix ? <span className="mr-1 text-sm font-bold text-slateink/60">{prefix}</span> : null}
      <input
        type="number"
        aria-label={ariaLabel}
        className="min-w-0 flex-1 bg-transparent text-right font-bold tabular-nums text-navy outline-none"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          if (Number.isFinite(nextValue)) {
            onChange(Math.min(max, Math.max(min, nextValue)));
          }
        }}
      />
      {suffix ? <span className="ml-1 text-sm font-bold text-slateink/60">{suffix}</span> : null}
    </div>
  );
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border-l border-white/15 pl-4 first:border-0 first:pl-0">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">{label}</p>
      <p className={cn("mt-2 text-xl font-extrabold tabular-nums", accent && "text-emerald")}>
        {value}
      </p>
    </div>
  );
}

export default function RefinanceCalculator({
  initialBalance = 350_000,
  initialCurrentRate = 6.8,
  initialNewRate = 5.3,
}: RefinanceCalculatorProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [currentRate, setCurrentRate] = useState(initialCurrentRate);
  const [remainingYears, setRemainingYears] = useState(25);
  const [newRate, setNewRate] = useState(initialNewRate);
  const [newTerm, setNewTerm] = useState(30);
  const [closingCosts, setClosingCosts] = useState(4200);
  const [extraPayment, setExtraPayment] = useState(200);
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () =>
      calculateRefinance({
        currentBalance: balance,
        currentAnnualRate: currentRate,
        currentRemainingYears: remainingYears,
        newAnnualRate: newRate,
        newLoanYears: newTerm,
        closingCosts,
        extraMonthlyPayment: extraPayment,
      }),
    [
      balance,
      closingCosts,
      currentRate,
      extraPayment,
      newRate,
      newTerm,
      remainingYears,
    ],
  );

  const maximumInterest = Math.max(
    result.oldLoan.totalInterest,
    result.newLoan.totalInterest,
    1,
  );
  const breakEvenLabel =
    result.breakEvenMonths === null
      ? "No monthly-payment break-even"
      : result.breakEvenMonths === 0
        ? "Break-Even Immediately"
        : `Break-Even in ${result.breakEvenMonths} Months`;

  const copyBreakdown = async () => {
    const breakdown = [
      "Mortgage Refinance Break-Even Analysis",
      `Current balance: ${currency.format(balance)}`,
      `Current loan: ${currentRate.toFixed(2)}% with ${remainingYears} years remaining`,
      `New loan: ${newRate.toFixed(2)}% for ${newTerm} years`,
      `Closing costs: ${currency.format(closingCosts)}`,
      `Old monthly payment: ${currencyPrecise.format(result.oldMonthlyPayment)}`,
      `New monthly payment: ${currencyPrecise.format(result.newMonthlyPayment)}`,
      `Monthly payment savings: ${currencyPrecise.format(result.monthlyPaymentSavings)}`,
      `Break-even: ${result.breakEvenMonths === null ? "Not reached from monthly payment savings" : `${result.breakEvenMonths} months`}`,
      `Estimated lifetime interest savings: ${currency.format(result.lifetimeInterestSaved)}`,
      `Optional extra monthly payment: ${currency.format(extraPayment)}`,
      "Educational estimate; confirm loan terms and fees with a licensed lender.",
    ].join("\n");

    await navigator.clipboard.writeText(breakdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="calculator" className="scroll-mt-6 py-10 lg:py-16" aria-labelledby="calculator-heading">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 flex max-w-2xl items-center gap-3 text-sm font-bold text-slateink">
          <span className="h-px w-10 bg-emerald" />
          Live mortgage analysis
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="animate-rise rounded-[26px] border border-navy/10 bg-[#f5f2e9] p-5 shadow-float lg:col-span-5 lg:p-7">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald">Loan inputs</p>
                <h2 id="calculator-heading" className="mt-2 font-[var(--font-dm-serif)] text-3xl text-navy">
                  Your refinance profile
                </h2>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-navy/10 bg-white text-ocean">
                <LineChart className="size-5" aria-hidden="true" />
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <FieldLabel hint={currency.format(balance)}>Current loan balance</FieldLabel>
                <NumberInput
                  value={balance}
                  onChange={setBalance}
                  prefix="$"
                  min={50_000}
                  max={2_000_000}
                  step={5000}
                  ariaLabel="Current loan balance"
                />
                <input
                  className="mt-3 w-full"
                  type="range"
                  aria-label="Current loan balance slider"
                  value={balance}
                  min={50_000}
                  max={2_000_000}
                  step={5000}
                  onChange={(event) => setBalance(Number(event.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Current rate</FieldLabel>
                  <NumberInput
                    value={currentRate}
                    onChange={setCurrentRate}
                    suffix="%"
                    min={0}
                    max={15}
                    step={0.05}
                    ariaLabel="Current mortgage interest rate"
                  />
                </div>
                <div>
                  <FieldLabel>Years remaining</FieldLabel>
                  <NumberInput
                    value={remainingYears}
                    onChange={setRemainingYears}
                    suffix="yr"
                    min={1}
                    max={40}
                    ariaLabel="Years remaining on current loan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>New rate</FieldLabel>
                  <NumberInput
                    value={newRate}
                    onChange={setNewRate}
                    suffix="%"
                    min={0}
                    max={15}
                    step={0.05}
                    ariaLabel="New mortgage interest rate"
                  />
                </div>
                <div>
                  <FieldLabel>New loan term</FieldLabel>
                  <select
                    aria-label="New loan term"
                    className="h-11 w-full rounded-lg border border-navy/15 bg-white px-3 font-bold text-navy outline-none transition focus:border-emerald focus:ring-2 focus:ring-emerald/15"
                    value={newTerm}
                    onChange={(event) => setNewTerm(Number(event.target.value))}
                  >
                    <option value={10}>10 years</option>
                    <option value={15}>15 years</option>
                    <option value={20}>20 years</option>
                    <option value={30}>30 years</option>
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel hint={currency.format(closingCosts)}>Closing costs</FieldLabel>
                <NumberInput
                  value={closingCosts}
                  onChange={setClosingCosts}
                  prefix="$"
                  min={0}
                  max={30_000}
                  step={100}
                  ariaLabel="Refinance closing costs"
                />
                <input
                  className="mt-3 w-full"
                  type="range"
                  aria-label="Closing costs slider"
                  value={closingCosts}
                  min={0}
                  max={30_000}
                  step={100}
                  onChange={(event) => setClosingCosts(Number(event.target.value))}
                />
              </div>

              <div>
                <FieldLabel hint="Optional">Extra monthly payment</FieldLabel>
                <NumberInput
                  value={extraPayment}
                  onChange={setExtraPayment}
                  prefix="$"
                  min={0}
                  max={5000}
                  step={25}
                  ariaLabel="Extra monthly principal payment"
                />
              </div>
            </div>
          </div>

          <div className="animate-rise lg:col-span-7 lg:-mt-8 lg:pt-0" style={{ animationDelay: "100ms" }} aria-live="polite">
            <div className="overflow-hidden rounded-[30px] bg-navy text-white shadow-[0_30px_90px_-38px_rgba(7,26,43,0.85)]">
              <div className="relative overflow-hidden border-b border-white/10 px-6 py-7 sm:px-9 sm:py-9">
                <div className="absolute -right-16 -top-20 size-64 rounded-full bg-emerald/15 blur-3xl" />
                <div className="relative flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald text-navy">
                    <Clock3 className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald">Your key decision point</p>
                    <p className="mt-2 font-[var(--font-dm-serif)] text-4xl leading-tight sm:text-5xl">
                      {breakEvenLabel}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                      {result.breakEvenMonths === null
                        ? "The proposed loan does not lower the required monthly principal-and-interest payment."
                        : `After month ${result.breakEvenMonths}, cumulative required-payment savings exceed your ${currency.format(closingCosts)} in closing costs.`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 px-6 py-6 sm:px-9">
                <Metric label="Old payment" value={currencyPrecise.format(result.oldMonthlyPayment)} />
                <Metric label="New payment" value={currencyPrecise.format(result.newMonthlyPayment)} />
                <Metric label="Save monthly" value={currencyPrecise.format(result.monthlyPaymentSavings)} accent />
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.25fr_.75fr]">
              <div className="rounded-[24px] border border-navy/10 bg-white p-6 shadow-float sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-slateink/60">
                      <DollarSign className="size-4 text-emerald" aria-hidden="true" />
                      Lifetime interest savings
                    </p>
                    <p className={cn("mt-3 text-4xl font-extrabold tabular-nums tracking-tight", result.lifetimeInterestSaved >= 0 ? "text-navy" : "text-[#b4432f]")}>
                      {currency.format(result.lifetimeInterestSaved)}
                    </p>
                  </div>
                  <ArrowDownRight className="size-6 text-emerald" aria-hidden="true" />
                </div>

                <div className="mt-7 space-y-5" aria-label="Lifetime interest comparison chart">
                  {[
                    { label: "Keep current loan", value: result.oldLoan.totalInterest, color: "bg-slateink/35" },
                    { label: "Refinance", value: result.newLoan.totalInterest, color: "bg-emerald" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex justify-between gap-4 text-xs font-bold text-slateink">
                        <span>{item.label}</span>
                        <span className="tabular-nums">{currency.format(item.value)}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-navy/5">
                        <div
                          className={cn("h-full rounded-full transition-[width] duration-500", item.color)}
                          style={{ width: `${Math.max(3, (item.value / maximumInterest) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-xl bg-ivory px-4 py-3 text-xs leading-5 text-slateink">
                  <Info className="mt-0.5 size-4 shrink-0 text-ocean" aria-hidden="true" />
                  Extra payments affect payoff time and lifetime interest, but not the required-payment break-even formula.
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[24px] border border-navy/10 bg-ocean p-6 text-white shadow-float">
                  <Sparkles className="size-5 text-emerald" aria-hidden="true" />
                  <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.14em] text-white/50">New payoff time</p>
                  <p className="mt-2 text-3xl font-extrabold tabular-nums">
                    {(result.newLoan.actualMonths / 12).toFixed(1)} years
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/60">With {currency.format(extraPayment)} extra each month</p>
                </div>
                <button
                  type="button"
                  onClick={copyBreakdown}
                  className="group flex items-center justify-between gap-3 rounded-[20px] border border-navy/15 bg-white px-5 py-4 text-left text-sm font-extrabold text-navy transition hover:-translate-y-0.5 hover:border-emerald hover:shadow-float focus:outline-none focus:ring-2 focus:ring-emerald/30"
                >
                  <span>{copied ? "Breakdown copied" : "Copy Refinance Breakdown"}</span>
                  {copied ? <Check className="size-5 text-emerald" aria-hidden="true" /> : <Clipboard className="size-5 text-slateink transition group-hover:text-emerald" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div id="rates" className="mt-6 rounded-[24px] border border-emerald/25 bg-[#e9f7f0] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-emerald shadow-sm">
                  <Building2 className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-extrabold text-navy">Compare Top Refinance Rates</p>
                  <p className="mt-1 text-sm leading-5 text-slateink">Review personalized lender offers before you lock a rate.</p>
                </div>
              </div>
              <span className="mt-4 inline-flex rounded-full border border-emerald/30 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#087653] sm:mt-0">
                Partner marketplace
              </span>
            </div>

            <div className="mt-5 flex items-start gap-3 text-xs leading-5 text-slateink/70">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Estimates include principal and interest only and are not a loan offer or financial advice.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
