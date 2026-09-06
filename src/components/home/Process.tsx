import { process } from "@/content/home-v2";

/**
 * Пять шагов работы. Нумерация здесь честная: это последовательность,
 * порядок несёт информацию.
 */
export default function Process() {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="t-h2">{process.title}</h2>
            <p className="t-lead mt-3">{process.lead}</p>
          </div>
          <p className="text-[0.9375rem] font-medium text-[color:var(--color-brand-strong)]">
            {process.free}
          </p>
        </div>

        <ol className="mt-10 border-t border-[color:var(--color-border-strong)]">
          {process.steps.map((s, i) => (
            <li
              key={s.title}
              className="grid gap-1 border-b border-[color:var(--color-border)] py-5 md:grid-cols-[48px_240px_1fr] md:gap-8"
            >
              <span className="t-mono text-[0.9375rem] text-[color:var(--color-fg-subtle)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="t-h3">{s.title}</h3>
              <p className=" text-[0.9375rem] leading-relaxed text-[color:var(--color-fg-muted)]">
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
