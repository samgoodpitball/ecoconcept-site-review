import { Check, Minus } from "@phosphor-icons/react/dist/ssr";
import { scope } from "@/content/home-v2";

/**
 * Граница работ. Список того, чего мы не делаем, стоит на сайте намеренно:
 * клиент должен узнать это до договора, а не на объекте.
 */
export default function Scope() {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="t-h2">{scope.title}</h2>
          <ul className="mt-6 border-t border-[color:var(--color-border-strong)]">
            {scope.included.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-[color:var(--color-border)] py-3 text-[0.9375rem] text-[color:var(--color-fg)]"
              >
                <Check
                  size={16}
                  weight="bold"
                  className="mt-1 shrink-0 text-[color:var(--color-brand)]"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="t-h2">{scope.excludedTitle}</h2>
          <ul className="mt-6 border-t border-[color:var(--color-border-strong)]">
            {scope.excluded.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-b border-[color:var(--color-border)] py-3 text-[0.9375rem] text-[color:var(--color-fg-muted)]"
              >
                <Minus
                  size={16}
                  weight="bold"
                  className="mt-1 shrink-0 text-[color:var(--color-fg-subtle)]"
                />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.875rem] leading-relaxed text-[color:var(--color-fg-muted)]">
            {scope.excludedNote}
          </p>
        </div>
      </div>
    </section>
  );
}
