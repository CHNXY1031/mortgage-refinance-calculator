import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenCheck, CircleDollarSign, Clock3 } from "lucide-react";

import RefinanceCalculator from "@/components/RefinanceCalculator";
import { calculateRefinance } from "@/lib/mortgageCalculator";
import { findScenario, REFINANCE_SCENARIOS } from "@/lib/refinanceScenarios";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface ScenarioPageProps {
  params: {
    amount: string;
    rates: string;
  };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return REFINANCE_SCENARIOS.map((scenario) => ({
    amount: scenario.amountSlug,
    rates: scenario.ratesSlug,
  }));
}

export function generateMetadata({ params }: ScenarioPageProps): Metadata {
  const scenario = findScenario(params.amount, params.rates);
  if (!scenario) {
    return {};
  }

  const amountLabel = `$${scenario.amount / 1000}k`;
  const title = `Refinance ${amountLabel} Mortgage from ${scenario.currentRate}% to ${scenario.newRate}%: Break-Even Calculator`;
  const description = `Calculate the monthly savings, closing-cost break-even month, and lifetime interest impact of refinancing a ${amountLabel} mortgage from ${scenario.currentRate}% to ${scenario.newRate}%.`;
  const canonical = `/refinance/${scenario.amountSlug}/${scenario.ratesSlug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default function ScenarioPage({ params }: ScenarioPageProps) {
  const scenario = findScenario(params.amount, params.rates);
  if (!scenario) {
    notFound();
  }

  const closingCosts = Math.round(scenario.amount * 0.012);
  const estimate = calculateRefinance({
    currentBalance: scenario.amount,
    currentAnnualRate: scenario.currentRate,
    currentRemainingYears: 25,
    newAnnualRate: scenario.newRate,
    newLoanYears: 30,
    closingCosts,
  });
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const amountLabel = `$${scenario.amount / 1000}k`;
  const pageUrl = `${SITE_URL}/refinance/${scenario.amountSlug}/${scenario.ratesSlug}`;
  const breakEvenText = estimate.breakEvenMonths === null ? "not reached from required-payment savings" : `${estimate.breakEvenMonths} months`;

  const faqs = [
    {
      question: `How long does it take to break even refinancing ${amountLabel} from ${scenario.currentRate}% to ${scenario.newRate}%?`,
      answer: `Using a 25-year remaining term, a new 30-year loan, and estimated closing costs of ${currency.format(closingCosts)}, the payment-savings break-even is ${breakEvenText}. Your actual result changes with term, fees, and loan details.`,
    },
    {
      question: "What costs belong in a refinance break-even calculation?",
      answer: "Include lender fees, appraisal, title services, recording fees, points, and other non-recurring costs. Exclude prepaid taxes and insurance when they are replacing funds you would have paid anyway.",
    },
    {
      question: "Do extra principal payments change the refinance break-even month?",
      answer: "Extra principal reduces payoff time and lifetime interest, but it is voluntary. This calculator keeps it out of required-payment savings so the closing-cost break-even comparison stays like-for-like.",
    },
    {
      question: "Is refinancing worthwhile if I may move soon?",
      answer: "Usually, the key test is whether you expect to sell, refinance again, or pay off the loan before the break-even month. If so, the upfront costs may not be recovered through monthly payment savings.",
    },
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      url: pageUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: `Interactive break-even calculator for refinancing a ${amountLabel} mortgage from ${scenario.currentRate}% to ${scenario.newRate}%.`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <section className="bg-navy py-14 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-emerald">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All refinance scenarios
          </Link>
          <div className="mt-9 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald">Personalized refinance guide</p>
              <h1 className="mt-5 font-[var(--font-dm-serif)] text-4xl leading-tight sm:text-6xl">
                Refinance {amountLabel} Mortgage from {scenario.currentRate}% to {scenario.newRate}%
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/65">Estimate your exact break-even timeline and understand how the new payment changes long-term mortgage interest.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-4">
              <div className="border-l border-white/15 pl-4">
                <Clock3 className="size-4 text-emerald" aria-hidden="true" />
                <p className="mt-3 text-xs font-bold text-white/45">Estimated break-even</p>
                <p className="mt-1 text-xl font-extrabold">{breakEvenText}</p>
              </div>
              <div className="border-l border-white/15 pl-4">
                <CircleDollarSign className="size-4 text-emerald" aria-hidden="true" />
                <p className="mt-3 text-xs font-bold text-white/45">Monthly savings</p>
                <p className="mt-1 text-xl font-extrabold">{currency.format(estimate.monthlyPaymentSavings)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RefinanceCalculator
        initialBalance={scenario.amount}
        initialCurrentRate={scenario.currentRate}
        initialNewRate={scenario.newRate}
      />

      <article className="border-t border-navy/10 bg-ivory py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.17em] text-emerald">
              <BookOpenCheck className="size-4" aria-hidden="true" />
              Scenario analysis
            </div>
            <h2 className="mt-4 font-[var(--font-dm-serif)] text-4xl leading-tight text-navy">What this rate reduction means for a {amountLabel} balance</h2>
            <div className="mt-7 space-y-5 text-base leading-8 text-slateink">
              <p>
                Moving from {scenario.currentRate}% to {scenario.newRate}% lowers the modeled required principal-and-interest payment from {currency.format(estimate.oldMonthlyPayment)} to {currency.format(estimate.newMonthlyPayment)}. That is an estimated {currency.format(estimate.monthlyPaymentSavings)} of monthly cash-flow relief before taxes, insurance, mortgage insurance, and HOA costs.
              </p>
              <p>
                With closing costs estimated at 1.2% of the balance ({currency.format(closingCosts)}), cumulative payment savings recover the upfront expense in {breakEvenText}. A practical decision should compare that timeline with how long you expect to own the property and keep this exact loan.
              </p>
              <p>
                Term choice matters as much as rate. Resetting a loan with 25 years remaining into a new 30-year term can lower the required payment but extend repayment. Try a 15- or 20-year term and add your intended extra payment to compare lifetime interest rather than relying on the rate alone.
              </p>
            </div>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="sticky top-6 rounded-[24px] bg-navy p-7 text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-emerald">Decision checklist</p>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-white/70">
                <li className="border-t border-white/10 pt-4">Add every lender, title, appraisal, recording, and point charge.</li>
                <li className="border-t border-white/10 pt-4">Compare APR as well as the note rate when evaluating offers.</li>
                <li className="border-t border-white/10 pt-4">Confirm that break-even comes before a likely sale or another refinance.</li>
                <li className="border-t border-white/10 pt-4">Review both monthly cash flow and lifetime interest.</li>
              </ul>
            </div>
          </aside>
        </div>
      </article>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-emerald">Common questions</p>
          <h2 className="mt-4 font-[var(--font-dm-serif)] text-4xl text-navy">Refinance break-even FAQ</h2>
          <div className="mt-9 divide-y divide-navy/10 border-y border-navy/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="cursor-pointer list-none pr-8 font-extrabold text-navy marker:hidden">{faq.question}</summary>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slateink">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
