import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import Link from "next/link";
import { Landmark } from "lucide-react";

import { BASE_URL, SITE_NAME } from "@/lib/site";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} | Free 2026 Tool`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Calculate mortgage refinance break-even time, monthly payment savings, and lifetime interest savings with optional extra payments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: "Mortgage Refinance Break-Even Calculator",
    description:
      "See when refinancing pays off and compare your old and new mortgage costs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Refinance Break-Even Calculator",
    description:
      "Estimate your refinance break-even month and lifetime interest savings.",
  },
  verification: { google: "google4bf79fc737f0ba77" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmSerif.variable}`}>
      <body className="font-[var(--font-manrope)] antialiased">
        <header className="border-b border-navy/10 bg-[#fbfaf6]/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-3 font-semibold tracking-tight text-navy"
              aria-label="Mortgage Refinance Calculator home"
            >
              <span className="grid size-9 place-items-center rounded-full bg-navy text-emerald">
                <Landmark className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden sm:inline">Refinance Ledger</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm font-semibold text-slateink" aria-label="Main navigation">
              <a className="transition hover:text-emerald" href="/#calculator">
                Calculator
              </a>
              <a className="transition hover:text-emerald" href="/#scenarios">
                Scenarios
              </a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-navy/10 bg-navy text-white/70">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 text-sm lg:grid-cols-[1fr_auto] lg:px-8">
            <div>
              <p className="font-semibold text-white">Refinance Ledger</p>
              <p className="mt-2 max-w-2xl leading-6">
                Educational estimates only. Taxes, insurance, points, APR, escrow,
                prepayment penalties, and lender-specific fees are not included.
              </p>
            </div>
            <p className="lg:text-right">© 2026 Refinance Ledger</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
