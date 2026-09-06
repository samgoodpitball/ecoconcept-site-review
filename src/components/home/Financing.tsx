import { financing } from "@/content/home-v2";

/**
 * Госкредит. Тёмный блок: это смысловой узел страницы, а не рядовая секция.
 */
export default function Financing() {
  return (
    <section className="bg-[color:var(--color-ink)] text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 md:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <h2 className="t-h2 !text-white">{financing.title}</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-white/70">
            {financing.lead}
          </p>

          <p className="mt-6 text-[0.9375rem] leading-relaxed text-white/70">
            <span className="font-medium text-white">Что финансируется. </span>
            {financing.covers}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[0.875rem] text-white/60">
            <span>
              <span className="text-white/40">Банки: </span>
              {financing.banks.join(", ")}
            </span>
            <span>
              <span className="text-white/40">География: </span>
              {financing.geo}
            </span>
          </div>

          <p className="mt-6 text-[0.8125rem] leading-relaxed text-white/45">
            {financing.disclaimer}
          </p>
        </div>

        <dl className="self-center border-t border-white/15">
          {financing.terms.map((t) => (
            <div
              key={t.k}
              className="flex items-baseline justify-between gap-4 border-b border-white/15 py-4"
            >
              <dt className="text-[0.9375rem] text-white/60">{t.k}</dt>
              <dd className="t-num text-[1.125rem] font-medium text-white">{t.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
