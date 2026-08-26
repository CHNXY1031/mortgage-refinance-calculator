# Mortgage Refinance Break-Even Calculator

A production-ready Next.js 14 calculator for U.S. homeowners comparing the
monthly-payment and lifetime-interest impact of refinancing a fixed-rate
mortgage.

## Features

- Standard fixed-rate mortgage amortization
- Closing-cost break-even calculation
- Optional extra-principal payoff simulation
- Monthly payment and lifetime interest comparisons
- 162 statically generated refinance scenario pages
- FAQ and WebApplication JSON-LD
- Generated sitemap, robots policy, canonical URLs, and Google verification
- Responsive, accessible financial dashboard interface

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Calculation model

The required monthly principal-and-interest payment uses the standard fixed-rate
amortization formula. The payment break-even month is:

```text
ceil(closing costs / (old required monthly payment - new required monthly payment))
```

Optional extra payments reduce the modeled new-loan payoff time and total
interest. They are intentionally excluded from required-payment savings so the
break-even comparison remains like-for-like.

## Production URL

`https://mortgage-refinance-calculator.vercel.app`

## Dependency note

This project intentionally stays on Next.js 14 to meet the project requirement.
As of August 2026, `npm audit` reports upstream advisories that npm resolves only
through a breaking upgrade to Next.js 16. Review the migration path before a
public production launch.

## Disclaimer

Estimates are educational and include principal and interest only. They are not
a loan offer, tax advice, or financial advice.
