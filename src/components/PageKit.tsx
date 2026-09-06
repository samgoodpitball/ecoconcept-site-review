import Image from "next/image";
import { contacts } from "@/content/site";
import type { Model, Faq } from "@/content/pages";
import LeadButton from "./LeadButton";
import ImageSlot from "./ImageSlot";

export async function PageHero({
  kicker,
  title,
  text,
  image,
  imageAlt,
  chips,
  interest,
  slotId,
}: {
  kicker: string;
  title: string;
  text: string;
  image: string;
  imageAlt: string;
  chips: string[];
  interest?: string;
  slotId?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-off">
      <Image
        src="/brand/leaf.png"
        alt=""
        width={480}
        height={450}
        className="pointer-events-none absolute -right-24 -bottom-24 w-[360px] opacity-[0.05]"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-10 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:pb-16 md:pt-14">
        <div>
          <span className="kicker">{kicker}</span>
          <h1 className="mt-3 text-3xl font-extrabold leading-[1.12] tracking-tight md:text-[42px]">{title}</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">{text}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <LeadButton interest={interest} source={`hero-${interest ?? "page"}`}>
              Получить расчёт
            </LeadButton>
            <a
              href={contacts.whatsapp(kicker)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Написать в WhatsApp
            </a>
          </div>
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {chips.map((c) => (
              <li key={c} className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink">
                {c}
              </li>
            ))}
          </ul>
        </div>
        {slotId ? (
          <ImageSlot
            slotId={slotId}
            alt={imageAlt}
            src={image}
            priority
            sizes="(max-width: 768px) 90vw, 460px"
            rounded="rounded-[20px]"
            className="bg-tint"
            imageClassName="object-cover"
            fallbackClassName="object-contain p-8"
          />
        ) : (
          <div className="flex items-center justify-center rounded-[20px] bg-tint p-8">
            <Image
              src={image}
              alt={imageAlt}
              width={480}
              height={480}
              priority
              quality={70}
              sizes="(max-width: 768px) 80vw, 420px"
              className="max-h-[340px] w-auto object-contain"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export function TripleRow({
  kicker,
  title,
  items,
  note,
  numbered = true,
  cols = 3,
  id,
  hideHeading = false,
}: {
  kicker: string;
  title: string;
  items: { title: string; text: string }[];
  note?: string;
  numbered?: boolean;
  cols?: 2 | 3 | 4;
  id?: string;
  /** Скрыть заголовок визуально: например, когда он уже нарисован на схеме выше. */
  hideHeading?: boolean;
}) {
  const colsClass = cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 md:px-6 md:py-16">
      <div className={hideHeading ? "sr-only" : ""}>
        <span className="kicker">{kicker}</span>
        <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      </div>
      <div className={`${hideHeading ? "" : "mt-8"} grid gap-6 ${colsClass}`}>
        {items.map((s, i) => (
          <div key={s.title} className="card p-6">
            {numbered && <div className="font-head text-2xl font-extrabold text-eco/30">{String(i + 1).padStart(2, "0")}</div>}
            <h3 className="mt-2 text-[17px] font-bold">{s.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.text}</p>
          </div>
        ))}
      </div>
      {note && (
        <p className="mt-6 rounded-[12px] bg-tint px-5 py-4 text-[14px] font-medium text-eco-dark">{note}</p>
      )}
    </section>
  );
}

export function Models({
  kicker,
  title,
  items,
  id,
}: {
  kicker: string;
  title: string;
  items: Model[];
  id?: string;
}) {
  const cols = items.length >= 3 ? "md:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1 md:max-w-3xl";
  return (
    <section id={id} className="scroll-mt-24 bg-off">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <span className="kicker">{kicker}</span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        <div className={`mt-8 grid gap-6 ${cols}`}>
          {items.map((m) => (
            <article key={m.name} className="flex flex-col overflow-hidden rounded-[12px] border border-line bg-white">
              {m.image && (
                <div className="flex h-48 items-center justify-center border-b border-line bg-white p-6">
                  <Image src={m.image} alt={m.name} width={320} height={320} className="h-full w-auto object-contain" />
                </div>
              )}
              <div className="grow p-6">
                <h3 className="text-lg font-bold">{m.name}</h3>
                <p className="mt-1 text-[13px] text-muted">{m.subtitle}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.chips.map((c) => (
                    <span key={c} className="rounded-full bg-tint px-3 py-1 font-head text-[11.5px] font-bold text-eco-dark">
                      {c}
                    </span>
                  ))}
                </div>
                <dl className="mt-4 space-y-2.5 border-t border-line pt-4">
                  {m.specs.map((s) => (
                    <div key={s.k} className="grid grid-cols-[92px_1fr] gap-3 text-[13.5px]">
                      <dt className="text-muted">{s.k}</dt>
                      <dd className="font-medium text-ink">{s.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-muted">
          Характеристики — по каталогам производителей. Точную комплектацию под ваш объект подберём в расчёте.
        </p>
      </div>
    </section>
  );
}

/**
 * Витрина бренда: фирменные промо-изображения сеткой 2×2 и под ними —
 * компактный перечень моделей без картинок.
 */
export function BrandShowcase({
  kicker,
  title,
  text,
  gallery,
  models,
  id,
}: {
  kicker: string;
  title: string;
  text?: string;
  gallery: { src: string; alt: string }[];
  models: Model[];
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 bg-off">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <span className="kicker">{kicker}</span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        {text && <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted">{text}</p>}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {gallery.map((g, i) => (
            <div key={g.src} className="overflow-hidden rounded-[12px] border border-line bg-white">
              <Image
                src={g.src}
                alt={g.alt}
                width={800}
                height={800}
                quality={80}
                priority={i === 0}
                sizes="(max-width: 768px) 92vw, 560px"
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {models.map((m) => (
            <article key={m.name} className="flex flex-col rounded-[12px] border border-line bg-white p-6">
              <h3 className="text-lg font-bold">{m.name}</h3>
              <p className="mt-1 text-[13px] text-muted">{m.subtitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {m.chips.map((c) => (
                  <span key={c} className="rounded-full bg-tint px-3 py-1 font-head text-[11.5px] font-bold text-eco-dark">
                    {c}
                  </span>
                ))}
              </div>
              <dl className="mt-4 space-y-2.5 border-t border-line pt-4">
                {m.specs.map((s) => (
                  <div key={s.k} className="grid grid-cols-[92px_1fr] gap-3 text-[13.5px]">
                    <dt className="text-muted">{s.k}</dt>
                    <dd className="font-medium text-ink">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-muted">
          Характеристики — по каталогам производителя. Точную комплектацию под ваш объект подберём в расчёте.
        </p>
      </div>
    </section>
  );
}

export function SpecTable({
  kicker,
  title,
  note,
  columns,
  rows,
  id,
}: {
  kicker: string;
  title: string;
  note?: string;
  columns: string[];
  rows: string[][];
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 md:px-6 md:py-16">
      <span className="kicker">{kicker}</span>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <div className="mt-8 overflow-x-auto rounded-[12px] border border-line">
        <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
          <thead>
            <tr className="bg-tint text-left">
              {columns.map((c) => (
                <th key={c} className="whitespace-nowrap px-4 py-3 font-head font-bold text-eco-dark">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-line">
                {r.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-ink">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-4 text-[13px] text-muted">{note}</p>}
    </section>
  );
}

export function FaqBlock({ items }: { items: Faq[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 md:px-6 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <span className="kicker">Частые вопросы</span>
      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">Спрашивают перед покупкой</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((f, i) => (
          <details key={f.q} open={i === 0} className="card group p-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-head text-[15px] font-bold text-graphite [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tint text-eco-dark transition-transform group-open:rotate-45">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="px-5 pb-5 text-[14px] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
