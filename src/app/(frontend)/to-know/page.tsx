import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PhotoBadge } from "@/components/product/SectionKit";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lead from "@/components/Lead";
import { toKnow as c } from "@/content/to-know";

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: { canonical: "/to-know" },
};

/**
 * Индекс раздела разборов.
 *
 * Без него страницы-разборы остаются сиротами: попасть на них можно только с
 * двух блоков главной. Здесь же они собираются в раздел, на который можно
 * ссылаться из шапки, футера и продуктовых страниц.
 */
export default function ToKnowPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 md:px-6 md:pb-14 md:pt-16">
            <span className="block font-head text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
              {c.kicker}
            </span>
            <h1 className="mt-5 max-w-[14em] text-[32px] font-bold leading-[1.06] tracking-[-0.02em] md:text-[48px]">
              {c.title}
            </h1>
            <p className="mt-5 max-w-[42em] text-[16.5px] leading-[1.65] text-muted md:text-[18px]">{c.lead}</p>
          </div>
        </section>

        <section className="border-t border-line bg-off">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              {c.articles.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="group overflow-hidden rounded-[20px] border border-line bg-white transition-colors hover:border-eco"
                >
                  <div className="relative aspect-[16/9] w-full">
                    <Image src={a.photo} alt={a.alt} fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
                    {a.badge ? (
                      <PhotoBadge>{a.badge}</PhotoBadge>
                    ) : null}
                  </div>
                  <div className="p-6 md:p-8">
                    <span className="font-head text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                      {a.minutes}
                    </span>
                    <h2 className="mt-3 font-head text-[22px] font-bold leading-[1.2] text-graphite md:text-[26px]">
                      {a.title}
                    </h2>
                    <p className="mt-3 max-w-[34em] text-[15.5px] leading-[1.65] text-muted md:text-[16px]">{a.text}</p>
                    <span className="mt-6 flex items-center gap-2.5 font-head text-[13.5px] font-semibold text-graphite transition-colors group-hover:text-eco-dark">
                      Читать
                      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
                        <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Очередь тем показываем честно: так видно, что раздел живой, и не
                приходится ставить ссылки на страницы, которых ещё нет. */}
            <div className="mt-12 border-t border-line pt-8">
              <span className="font-head text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                Готовим дальше
              </span>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {c.planned.map((p) => (
                  <li key={p} className="text-[15px] leading-[1.5] text-muted">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Lead source="to-know" />
      </main>
      <Footer />
    </>
  );
}
