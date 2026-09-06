import Image from "next/image";
import Link from "next/link";
import StepsAccordion from "@/components/product/StepsAccordion";
import ModelsCarousel from "@/components/product/ModelsCarousel";
import StationSchemes from "@/components/solar/StationScheme";
import { Eyebrow, Disclosure, CheckMark, ModelCard } from "@/components/product/SectionKit";
import { solar } from "@/content/solar";
import { itemsOf, categoryHref, subtitle, facts, type CatalogItem } from "@/lib/catalog-view";

/**
 * Секции страницы «Солнечные станции» (/solar).
 *
 * Раскладка и типографика те же, что на /heat-pumps: страницы отличаются
 * содержанием, а не языком. Две осмысленные разницы:
 *
 * 1. Вместо двух объёмных схем — сравнение сетевой и гибридной станции
 *    таблицей на линиях: у клиента здесь не вопрос «как это работает
 *    физически», а вопрос «что будет, когда выключат свет».
 * 2. В ленте оборудования три раздела каталога вместо одного, и у Deye нет
 *    фотографий — вместо серой заглушки в карточке стоит главное число модели.
 */

/* ─────────────────────────────────────────────────────────────── hero */

export function SolHero() {
  const h = solar.hero;
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-2 md:gap-16 md:px-6 md:py-20">
        <figure className="order-2 md:order-1">
          {/* Рендер оборудования на прозрачном фоне: ни рамки, ни подложки —
              панели лежат прямо на фоне секции (правка заказчика 05.09).
              Отсюда и object-contain: обрезать нечего, кадр вписан целиком. */}
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={h.photo.src}
              alt={h.photo.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-contain"
            />
          </div>
          <figcaption className="mt-3.5 text-[13.5px] text-muted">
            <Link
              href={h.photo.href}
              className="border-b border-line pb-0.5 transition-colors hover:border-eco hover:text-eco-dark"
            >
              {h.photo.caption}
            </Link>
          </figcaption>
        </figure>

        <div className="order-1 md:order-2">
          <Eyebrow>{h.kicker}</Eyebrow>
          <h1 className="mt-6 text-[34px] font-bold leading-[1.06] tracking-[-0.025em] md:text-[52px]">{h.title}</h1>
          <p className="mt-7 max-w-[34em] text-[16.5px] leading-[1.65] text-muted md:text-[17px]">{h.text}</p>

          <ul className="mt-10 flex flex-col gap-5">
            {h.facts.map((fact) => (
              <li key={fact} className="flex items-start gap-4">
                <CheckMark />
                <span className="text-[16px] leading-[1.5] text-ink md:text-[16.5px]">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────── зачем ставить станцию */

export function SolReasons() {
  const r = solar.reasons;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <Eyebrow>{r.kicker}</Eyebrow>
      <h2 className="mt-6 max-w-[16em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
        {r.title}
      </h2>
      <div className="mt-12">
        {r.items.map((item, i) => (
          <Disclosure key={item.q} q={item.q} a={item.a} open={i === 0} large />
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────────── как устроена: сетевая или гибридная */

/**
 * Сравнение двух типов станции. Не карточки и не схема, а таблица на тонких
 * линиях: слева вопрос, справа два ответа. На узком экране колонки становятся
 * двумя подписанными строками внутри того же блока — таблица не сжимается до
 * нечитаемой и не уезжает вбок.
 */
export function SolHow() {
  const h = solar.how;
  return (
    <section id="how" className="scroll-mt-24 border-y border-line bg-off">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <Eyebrow>{h.kicker}</Eyebrow>
        <h2 className="mt-6 max-w-[14em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[42px]">
          {h.title}
        </h2>
        <p className="mt-6 max-w-[42em] text-[16px] leading-[1.7] text-muted">{h.text}</p>

        {/* Чертёжная схема двух станций — конспект таблицы, см. StationScheme */}
        <div className="mt-10">
          <StationSchemes />
        </div>

        <div className="mt-12 border-t border-line">
          {/* Шапка таблицы только на широком экране: на телефоне её роль играют
              подписи внутри строки. */}
          <div className="hidden grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,1.1fr)] gap-x-10 border-b border-line py-4 md:grid">
            <span />
            {h.columns.map((c) => (
              <span key={c} className="font-head text-[15px] font-bold text-graphite">
                {c}
              </span>
            ))}
          </div>

          {h.rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-x-10 gap-y-3 border-b border-line py-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,1.1fr)] md:py-7"
            >
              <span className="font-head text-[13px] font-bold uppercase tracking-[0.12em] text-muted md:normal-case md:tracking-normal md:text-[16px] md:text-graphite">
                {row.label}
              </span>
              <p className="text-[15.5px] leading-[1.65] text-muted md:text-[16px]">
                <span className="font-head font-bold text-graphite md:hidden">{h.columns[0]}: </span>
                {row.grid}
              </p>
              <p className="text-[15.5px] leading-[1.65] text-muted md:text-[16px]">
                <span className="font-head font-bold text-graphite md:hidden">{h.columns[1]}: </span>
                {row.hybrid}
              </p>
            </div>
          ))}
        </div>

        {/* Микрогенерация: наш внутренний факт и внешние публикации расходятся,
            поэтому она стоит пометкой, а не обещанием в тексте секции. */}
        <div className="mt-8 max-w-[52em] rounded-r-[10px] border-l-[3px] border-[color:var(--color-amber)] bg-[color:var(--color-amber)]/8 px-5 py-4">
          <p className="text-[14.5px] leading-[1.65] text-ink/85">{h.note}</p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── оборудование */

/**
 * Главное число модели вместо фотографии: снимков Deye нет ни у одной из 29
 * позиций инверторов и батарей, поэтому фильтровать ленту по наличию фото
 * нечем — останется одна панель.
 *
 * Подпись «фото ожидается» убрана 06.09.2026: она читалась как заглушка и
 * признавалась в том, чего у карточки нет. Вместо неё — вторая характеристика
 * из каталога, и карточка становится строкой спецификации, а не пустым местом.
 */
function NumberSlot({ item }: { item: CatalogItem }) {
  const [value, second] = facts(item);
  return (
    <span className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
      <span className="font-head text-[30px] font-bold leading-none tracking-[-0.02em] text-graphite">
        {value ?? ""}
      </span>
      {second ? (
        <span className="font-head text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{second}</span>
      ) : null}
    </span>
  );
}

/**
 * Оборудование. Та же горизонтальная лента, что у насосов, но собирается из
 * трёх разделов каталога: панель, инверторы, батареи — в порядке сборки
 * станции. Из инверторов взята бытовая линейка на 220 В; трёхфазные и
 * коммерческие до 110 кВт остаются в каталоге, ссылка на него рядом.
 */
export function SolModels() {
  const m = solar.models;
  const ordered = [
    ...itemsOf("solar-panels"),
    ...itemsOf("inverters").filter((i) => i.phase === "1ф"),
    // BOS-W-PDU-2 — модуль управления батареей без собственной ёмкости,
    // в витрине он читается как «батарея на 0 кВт·ч».
    ...itemsOf("batteries").filter((i) => (i.capacity ?? 0) > 0),
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>{m.kicker}</Eyebrow>
          <h2 className="mt-6 text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">{m.title}</h2>
        </div>
        <Link
          href={categoryHref("solar-panels")}
          className="group inline-flex items-center gap-3 font-head text-[14px] font-bold uppercase tracking-[0.12em] text-eco-dark transition-colors hover:text-eco"
        >
          {m.link}
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current transition-transform group-hover:translate-x-0.5">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
              <path d="m1.5 1 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>

      <div className="mt-12">
        <ModelsCarousel>
          {ordered.map((item) => (
            <div key={item.slug} className="w-[248px] shrink-0 snap-start sm:w-[272px]">
              <ModelCard
                item={item}
                placeholder={(i) => <NumberSlot item={i} />}
                note={(i) => subtitle(i)}
              />
            </div>
          ))}
        </ModelsCarousel>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── три шага */

export function SolSteps() {
  const s = solar.steps;
  return <StepsAccordion kicker={s.kicker} title={s.title} items={s.items} source="solar" interest="solar" />;
}

/* ─────────────────────────────────────────────────────────────── FAQ */

export function SolFaq() {
  const f = solar.faq;
  return (
    <section className="border-t border-line bg-off">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <Eyebrow>{f.kicker}</Eyebrow>
        <h2 className="mt-6 text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">{f.title}</h2>
        <div className="mt-12 grid items-start md:grid-cols-2 md:gap-x-14">
          {f.items.map((item) => (
            <Disclosure key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
