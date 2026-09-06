import Image from "next/image";
import { PhotoBadge } from "@/components/product/SectionKit";
import Link from "next/link";

/**
 * Предложение: один слитый блок — текст слева, снимок справа.
 *
 * Композиция снята с блока насосов octopus.energy: одна карточка, разделённая
 * пополам. Слева на тёмном — обещание с числом, отметки и кнопка; справа
 * снимок во всю высоту карточки, на нём вопрос «что это такое» и контурная
 * кнопка. Половины не разнесены зазором: это один объект, а не две карточки.
 *
 * Наши отличия: шапка секции — общая левая система с номером (не центр, как у
 * референса), тёмная половина — плоская фирменная хвоя, акцент на тёмном —
 * светлый зелёный #7CC24B, который проходит контраст на хвое.
 *
 * Две кнопки ведут в разные места: одна — на страницу направления, другая —
 * на объяснение, как это устроено.
 *
 * `reverse` переворачивает половины: второй такой же блок подряд без этого
 * читался бы как повтор вёрстки, а не как второе направление.
 */
export type OfferData = {
  readonly title: string;
  readonly subtitle: string;
  readonly deal: {
    readonly title: string;
    readonly note: string;
    readonly facts: readonly string[];
    readonly cta: { readonly label: string; readonly href: string };
  };
  readonly learn: {
    readonly title: string;
    readonly cta: { readonly label: string; readonly href: string };
    readonly photo: string;
    readonly alt: string;
    readonly badge?: string;
  };
};

export default function Offer({ data, reverse = false }: { data: OfferData; reverse?: boolean }) {
  const o = data;
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        {/* Шапка переведена с центра на общую левую систему: номер секции,
            линейка, заголовок; подзаголовок встаёт второй колонкой. Две
            конкурирующие системы шапок были находкой №3 брифа. */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <span className="flex items-center gap-3">
              <span aria-hidden className="sec-num num text-[0.78rem] font-medium leading-none text-eco-dark" />
              <span aria-hidden className="ruler w-8 shrink-0" />
            </span>
            <h2 className="mt-5 max-w-[15em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
              {o.title}
            </h2>
          </div>
          <p className="max-w-[26em] text-[16px] leading-[1.6] text-muted md:pb-1.5 md:text-[17px]">{o.subtitle}</p>
        </div>

        {/* Плоский хвойный вместо прежней диагональной растяжки: в новой
            палитре тёмный не «чёрная чужая плашка», а фирменная хвоя, и
            повод для отступления от правила «без градиентов» исчез. */}
        <div className="mt-12 overflow-hidden rounded-[10px] bg-graphite">
          <div className="grid md:grid-cols-2">
            {/* ─────────────────────── обещание с числом */}
            <div className={`flex flex-col p-7 md:p-11 lg:p-12 ${reverse ? "md:order-2" : ""}`}>
              <h3 className="max-w-[15em] font-head text-[24px] font-bold leading-[1.18] tracking-[-0.01em] text-white md:text-[30px]">
                {o.deal.title}
              </h3>

              <ul className="mt-8 flex flex-col gap-4">
                {o.deal.facts.map((fact) => (
                  <li key={fact} className="flex items-start gap-3.5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="mt-0.5 shrink-0">
                      <path
                        d="M3 10.5 8 15.5 17 4.5"
                        stroke="#7CC24B"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[15.5px] leading-[1.45] text-white/90 md:text-[16.5px]">{fact}</span>
                  </li>
                ))}
              </ul>

              <Link href={o.deal.cta.href} className="btn-primary mt-9 self-start">
                {o.deal.cta.label}
              </Link>

              <p className="mt-auto pt-9 text-[12.5px] leading-[1.55] text-white/55">{o.deal.note}</p>
            </div>

            {/* ─────────────────────── «что это такое» */}
            <Link
              href={o.learn.cta.href}
              className={`group relative flex min-h-[340px] items-end md:min-h-[440px] ${
                reverse ? "md:order-1" : ""
              }`}
            >
              <Image
                src={o.learn.photo}
                alt={o.learn.alt}
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                className="object-cover"
              />
              {/* Сплошная плашка, а не градиент: без затемнения белый заголовок
                  не читается на светлом снимке. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-graphite/45 transition-colors duration-200 group-hover:bg-graphite/55"
              />

              {o.learn.badge ? (
                <PhotoBadge>{o.learn.badge}</PhotoBadge>
              ) : null}

              <span className="relative p-7 md:p-11 lg:p-12">
                <span className="block max-w-[9em] font-head text-[26px] font-bold leading-[1.15] tracking-[-0.01em] text-white md:text-[34px]">
                  {o.learn.title}
                </span>
                <span className="btn-outline-light mt-7 inline-flex">{o.learn.cta.label}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
