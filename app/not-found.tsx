import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-navy px-5 text-white">
      <div className="max-w-xl text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald">404 · Scenario not found</p>
        <h1 className="mt-5 font-[var(--font-dm-serif)] text-5xl">This mortgage scenario is not in the ledger.</h1>
        <p className="mt-5 leading-7 text-white/60">Return to the main calculator and enter any loan balance, rate, term, and closing cost.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-extrabold text-navy">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Open calculator
        </Link>
      </div>
    </main>
  );
}
