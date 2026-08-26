import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Calculator, ShieldCheck } from "lucide-react";

import RefinanceCalculator from "@/components/RefinanceCalculator";
import { REFINANCE_SCENARIOS } from "@/lib/refinanceScenarios";

const featuredScenarios = REFINANCE_SCENARIOS.filter((_, index) => index % 9 === 0).slice(0, 18);

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-y-0 right-0 w-2/5 bg-[radial-gradient(circle_at_center,rgba(24,185,129,0.22),transparent_68%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="lg:col-span-8 lg:col-start-1">
            <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald">
              <span className="h-px w-10 bg-emerald" />
              Independent mortgage decision tool
            </div>
            <h1 className="mt-7 max-w-5xl font-[var(--font-dm-serif)] text-5xl leading-[1.04] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              Mortgage Refinance <span className="text-emerald">Break-Even</span> Calculator
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              See exactly when your closing costs pay for themselves. Compare old and new monthly payments, model extra principal, and estimate lifetime interest savings.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#calculator" className="inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-extrabold text-navy transition hover:bg-[#3ed09a] focus:outline-none focus:ring-2 focus:ring-white/50">
                Calculate my break-even
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <span className="inline-flex items-center gap-2 px-2 py-3 text-sm font-bold text-white/70">
                <ShieldCheck className="size-4 text-emerald" aria-hidden="true" />
                Free · private · no signup
              </span>
            </div>
          </div>
          <aside className="self-end border-l border-white/15 pl-6 lg:col-span-3 lg:col-start-10 lg:mb-2" aria-label="Calculator formula summary">
            <Calculator className="size-5 text-emerald" aria-hidden="true" />
            <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.15em] text-white/45">Core formula</p>
            <p className="mt-2 font-[var(--font-dm-serif)] text-2xl leading-snug">Closing costs ÷ monthly savings</p>
            <p className="mt-3 text-sm leading-6 text-white/55">The first full month after cumulative savings recover your upfront refinance costs.</p>
          </aside>
        </div>
      </section>

      <RefinanceCalculator />

      <section className="border-y border-navy/10 bg-ivory py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald">How to read the result</p>
            <h2 className="mt-4 font-[var(--font-dm-serif)] text-4xl leading-tight text-navy sm:text-5xl">A lower rate is useful only when it fits your timeline.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
            {[
              ["01", "Estimate savings", "We compare principal-and-interest payments using standard fixed-rate amortization."],
              ["02", "Recover costs", "Your break-even month is closing costs divided by monthly required-payment savings."],
              ["03", "Check your horizon", "Refinancing is more compelling when you expect to keep the loan beyond break-even."],
            ].map(([number, title, description]) => (
              <div key={number} className="border-t border-navy/20 pt-5">
                <span className="text-xs font-black tabular-nums text-emerald">{number}</span>
                <h3 className="mt-5 font-extrabold text-navy">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slateink">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="scenarios" className="scroll-mt-6 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald">Popular refinance scenarios</p>
              <h2 className="mt-4 font-[var(--font-dm-serif)] text-4xl text-navy sm:text-5xl">Explore by balance and rate drop</h2>
            </div>
            <p className="text-sm leading-6 text-slateink lg:col-span-4 lg:col-start-9">Each guide is pre-calculated with a common U.S. mortgage scenario, then lets you adjust every input.</p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredScenarios.map((scenario) => (
              <Link
                key={`${scenario.amountSlug}-${scenario.ratesSlug}`}
                href={`/refinance/${scenario.amountSlug}/${scenario.ratesSlug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-navy/10 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-emerald hover:shadow-float"
              >
                <span>
                  <span className="block text-xs font-bold text-slateink/60">${scenario.amount / 1000}k mortgage</span>
                  <span className="mt-1 block font-extrabold text-navy">{scenario.currentRate}% → {scenario.newRate}%</span>
                </span>
                <ArrowRight className="size-4 text-slateink transition group-hover:text-emerald" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ocean py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <BadgeDollarSign className="mt-1 size-7 shrink-0 text-emerald" aria-hidden="true" />
            <div>
              <h2 className="font-[var(--font-dm-serif)] text-3xl">Make the fee visible before you sign.</h2>
              <p className="mt-2 text-sm leading-6 text-white/60">Run your loan estimate through the calculator with every lender credit, point, and closing cost included.</p>
            </div>
          </div>
          <a href="#calculator" className="shrink-0 rounded-full border border-white/25 px-5 py-2.5 text-sm font-extrabold transition hover:border-emerald hover:text-emerald">Recalculate</a>
        </div>
      </section>
    </main>
  );
}
