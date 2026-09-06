import Link from "next/link";
import { ru, contacts } from "@/content/site";
import LeadButton from "./LeadButton";
import ImageSlot from "./ImageSlot";

/** Тонкая полоса доверия под hero: 4 коротких факта с линейными иконками. */
export function TrustBar() {
  return (
    <section className="border-y border-line bg-tint/50">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-3 px-4 py-4 md:grid-cols-4 md:px-6">
        {ru.trustBar.map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-[13.5px] font-medium text-ink">
            <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0 text-eco-dark" aria-hidden="true">
              <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <path d="M6.2 10.3l2.6 2.6 5-5.2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Сквозная полоса призыва. dark — тёмный вариант (для низа страниц), иначе Leaf Tint. */
export function CtaBand({
  title = ru.finalCta.title,
  text = ru.finalCta.text,
  source = "cta",
  interest,
  dark = false,
}: {
  title?: string;
  text?: string;
  source?: string;
  interest?: string;
  dark?: boolean;
}) {
  return (
    <section className={dark ? "relative overflow-hidden bg-graphite" : "bg-tint/60"}>
      {dark && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-10 opacity-[0.05]"
          style={{ backgroundImage: "url(/brand/leaf_white.png)", backgroundSize: "112px", transform: "rotate(-6deg)" }}
        />
      )}
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between md:px-6 md:py-16">
        <div className="max-w-xl">
          <h2 className={`text-2xl font-bold tracking-tight md:text-3xl ${dark ? "!text-white" : ""}`}>{title}</h2>
          <p className={`mt-3 text-[15px] leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>{text}</p>
          <p className={`mt-4 text-[14px] ${dark ? "text-white/80" : "text-muted"}`}>
            Или позвоните:{" "}
            <a
              href={contacts.phoneHref}
              className={`font-semibold underline underline-offset-4 ${dark ? "text-white" : "text-eco-dark"}`}
            >
              {contacts.phoneDisplay}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <LeadButton interest={interest} source={source}>
            Получить расчёт
          </LeadButton>
          <a
            href={contacts.whatsapp(source)}
            target="_blank"
            rel="noopener noreferrer"
            className={dark ? "btn-outline-light" : "btn-outline"}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/** Хлебные крошки + BreadcrumbList JSON-LD. items — без «Главная», она добавляется сама. */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const base = process.env.SITE_URL ?? "https://www.ecoconcept.kg";
  const all = [{ label: "Главная", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `${base}${it.href === "/" ? "" : it.href}` } : {}),
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Хлебные крошки" className="mx-auto max-w-6xl px-4 pt-5 md:px-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
          {all.map((it, i) => (
            <li key={it.label} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {it.href ? (
                <Link href={it.href} className="transition-colors hover:text-eco-dark">
                  {it.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {it.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/**
 * Схема на всю ширину контентной колонки. На схемах мелкий текст, поэтому
 * на узких экранах даём горизонтальный скролл с минимальной шириной 1100px —
 * иначе подписи становятся нечитаемыми.
 *
 * `titleInImage` — у части схем заголовок нарисован прямо на картинке;
 * тогда заголовок секции остаётся в разметке для семантики и поиска,
 * но визуально не дублируется.
 */
export async function SchemeBlock({
  slotId,
  kicker,
  title,
  note,
  titleInImage = false,
  id,
}: {
  slotId: string;
  kicker: string;
  title: string;
  note?: string;
  titleInImage?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 md:px-6 md:py-16">
      <div className={titleInImage ? "sr-only" : ""}>
        <span className="kicker">{kicker}</span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      </div>
      <div className={titleInImage ? "" : "mt-8"}>
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="min-w-[1100px] md:min-w-0">
            <ImageSlot
              slotId={slotId}
              sizes="(max-width: 1024px) 1100px, 1100px"
              rounded="rounded-[12px]"
              className="border border-line bg-white"
              imageClassName="object-contain"
            />
          </div>
        </div>
        <p className="mt-2 text-[12.5px] text-muted md:hidden">
          Схему можно прокрутить вбок
        </p>
      </div>
      {note && (
        <p className="mt-6 rounded-[12px] bg-tint px-5 py-4 text-[14px] font-medium text-eco-dark">{note}</p>
      )}
    </section>
  );
}

/** Маркированный список-«галочки» — для блоков «что входит». */
export function CheckList({
  kicker,
  title,
  items,
  note,
}: {
  kicker: string;
  title: string;
  items: string[];
  note?: string;
}) {
  return (
    <section className="bg-off">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <span className="kicker">{kicker}</span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        <ul className="mt-8 grid gap-x-8 gap-y-3.5 md:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
              <svg width="20" height="20" viewBox="0 0 20 20" className="mt-0.5 shrink-0" aria-hidden="true">
                <circle cx="10" cy="10" r="9" fill="#EAF3DF" />
                <path d="M6.2 10.3l2.6 2.6 5-5.2" stroke="#448A16" strokeWidth="1.9" fill="none" strokeLinecap="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
        {note && <p className="mt-6 text-[13px] text-muted">{note}</p>}
      </div>
    </section>
  );
}
