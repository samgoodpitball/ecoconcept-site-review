import { now } from "@/content/home-v2";

/**
 * Рыночный контекст. Не карточки с иконками, а именованные строки:
 * читается как сводка, а не как реклама.
 */
export default function Now() {
  return (
    <section className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-6 md:py-20">
        <h2 className="t-h2 max-w-2xl">{now.title}</h2>
        <p className="t-lead mt-4">{now.lead}</p>

        <div className="mt-10 border-t border-[color:var(--color-border-strong)]">
          {now.items.map((item) => (
            <article
              key={item.key}
              className="grid gap-2 border-b border-[color:var(--color-border)] py-7 md:grid-cols-[160px_1fr] md:gap-10"
            >
              <div className="t-eyebrow pt-1">{item.key}</div>
              <div>
                <h3 className="t-h3">{item.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--color-fg-muted)]">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
