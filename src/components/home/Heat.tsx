import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { heat } from "@/content/home-v2";

/**
 * Тепловые насосы. Компактнее солнечного блока: приоритет направлений 60/40.
 * Каждое утверждение проверяемое, с числом и единицей измерения.
 */
export default function Heat() {
  return (
    <section id="heat" className="scroll-mt-16 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h2 className="t-h2">{heat.title}</h2>
          <p className="t-lead mt-4">{heat.lead}</p>
          <p className="mt-4 text-[0.875rem] text-[color:var(--color-fg-subtle)]">{heat.brands}</p>
          <Link
            href={heat.href}
            className="mt-7 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-[color:var(--color-brand)] hover:underline"
          >
            Всё о тепловых насосах
            <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

        <dl className="grid content-start gap-0 self-center border-t border-[color:var(--color-border-strong)]">
          {heat.claims.map((c) => (
            <div
              key={c.value}
              className="grid grid-cols-[minmax(96px,auto)_1fr] items-baseline gap-6 border-b border-[color:var(--color-border)] py-5"
            >
              <dt className="flex items-baseline gap-1.5 leading-none">
                <span className="t-num text-[1.5rem] font-medium text-[color:var(--color-fg)]">
                  {c.value}
                </span>
                <span className="text-[0.875rem] text-[color:var(--color-fg-muted)]">{c.unit}</span>
              </dt>
              <dd className="text-[0.9375rem] leading-snug text-[color:var(--color-fg-muted)]">
                {c.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
