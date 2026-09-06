import { combo } from "@/content/home-v2";

/**
 * Объясняет, почему станцию и насос продают вместе.
 * Три шага здесь пронумерованы честно: это причинно-следственная цепочка,
 * порядок несёт смысл.
 */
export default function Combo() {
  return (
    <section className="border-b border-[color:var(--color-border)]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-20">
        <h2 className="t-h2 max-w-2xl">{combo.title}</h2>

        <ol className="mt-9 grid border-t border-[color:var(--color-border-strong)] md:grid-cols-3">
          {combo.steps.map((s) => (
            <li
              key={s.n}
              className="border-b border-[color:var(--color-border)] py-6 md:border-b-0 md:border-r md:pr-8 md:last:border-r-0 md:[&:not(:first-child)]:pl-8"
            >
              <span className="t-eyebrow">
                Шаг {s.n}
              </span>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-[color:var(--color-fg)]">
                {s.text}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-[0.9375rem] text-[color:var(--color-fg-muted)]">
          {combo.conclusion}
        </p>
      </div>
    </section>
  );
}
