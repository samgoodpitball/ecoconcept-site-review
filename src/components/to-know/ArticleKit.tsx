import Image from "next/image";
import { PhotoBadge } from "@/components/product/SectionKit";
import Link from "next/link";

/**
 * Примитивы страниц-объяснений (`/to-know/*`).
 *
 * Раскладка снята со статьи octopus.energy/blog/heat-pumps-explained: заголовок
 * и широкий баннер, врезка с вводным абзацем в рамке, полосы-заявления другого
 * оттенка, текст с подзаголовками, нумерованный список выгод, блок «текст плюс
 * круглый снимок», три карточки и переходы в конце.
 *
 * Наши цвета вместо фиолетовых: тёмные полосы — зелёный градиент той же
 * диагонали, что в блоках главной; светлые — белый и `off`. Акцент один.
 */

/* ─────────────────────────────────────────────────────────── обложка */

export function ArticleHero({
  kicker,
  title,
  lead,
  photo,
  alt,
  badge,
}: {
  kicker: string;
  title: string;
  lead: string;
  photo: string;
  alt: string;
  badge?: string;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 md:px-6 md:pb-14 md:pt-16">
        <span className="block text-center font-head text-[11px] font-bold uppercase tracking-[0.24em] text-muted">
          {kicker}
        </span>
        <h1 className="mx-auto mt-5 max-w-[18em] text-center text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[46px]">
          {title}
        </h1>

        <div className="relative mt-9 aspect-[16/7] w-full overflow-hidden rounded-[32px] md:mt-12 md:rounded-[32px]">
          <Image src={photo} alt={alt} fill priority sizes="(max-width: 768px) 100vw, 1152px" className="object-cover" />
          {badge ? (
            <PhotoBadge>{badge}</PhotoBadge>
          ) : null}
        </div>

        {/* Врезка с вводным абзацем — тот же приём, что в референсе: рамка,
            крупный текст, никакого фона. */}
        <p className="mt-8 rounded-[20px] border border-line p-6 text-[17px] leading-[1.6] text-graphite md:mt-10 md:p-8 md:text-[19px]">
          {lead}
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────── полоса-заявление */

/** Крупное утверждение во всю ширину — разделяет главы статьи. */
export function Statement({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{ background: "linear-gradient(140deg, #275a19 0%, #1b3a12 42%, #16240f 78%, #111a10 100%)" }}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <p className="max-w-[18em] font-head text-[26px] font-bold leading-[1.12] tracking-[-0.02em] text-white md:text-[42px]">
          {children}
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────── глава с текстом */

export function Chapter({
  title,
  paragraphs,
  children,
  tone = "white",
}: {
  title: string;
  paragraphs?: readonly string[];
  children?: React.ReactNode;
  tone?: "white" | "off";
}) {
  return (
    <section className={tone === "off" ? "border-y border-line bg-off" : "bg-white"}>
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <h2 className="max-w-[16em] text-[26px] font-bold leading-[1.12] tracking-[-0.02em] md:text-[36px]">
          {title}
        </h2>
        {paragraphs?.map((p) => (
          <p key={p} className="mt-5 max-w-[44em] text-[16px] leading-[1.7] text-muted md:text-[17px]">
            {p}
          </p>
        ))}
        {children}
      </div>
    </section>
  );
}

/* ─────────────────────────────────── нумерованный список выгод */

export function NumberedList({ items }: { items: readonly { title: string; text: string }[] }) {
  return (
    <ol className="mt-9 flex flex-col">
      {items.map((item, i) => (
        <li key={item.title} className="flex gap-5 border-t border-line py-6 last:border-b">
          <span className="font-head text-[15px] font-bold tabular-nums text-eco-dark md:text-[17px]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>
            <span className="block font-head text-[17px] font-bold leading-[1.3] text-graphite md:text-[19px]">
              {item.title}
            </span>
            <span className="mt-2 block max-w-[42em] text-[15.5px] leading-[1.65] text-muted md:text-[16.5px]">
              {item.text}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────────── текст и круглый снимок рядом */

export function SplitMedia({
  title,
  paragraphs,
  photo,
  alt,
  badge,
  cta,
  reverse = false,
}: {
  title: string;
  paragraphs: readonly string[];
  photo: string;
  alt: string;
  badge?: string;
  cta?: { label: string; href: string };
  reverse?: boolean;
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:gap-14 md:px-6 md:py-20">
        <div className={reverse ? "md:order-2" : ""}>
          <h2 className="max-w-[14em] text-[26px] font-bold leading-[1.12] tracking-[-0.02em] md:text-[34px]">
            {title}
          </h2>
          {paragraphs.map((p) => (
            <p key={p} className="mt-5 max-w-[38em] text-[16px] leading-[1.7] text-muted md:text-[17px]">
              {p}
            </p>
          ))}
          {cta ? (
            <Link href={cta.href} className="btn-primary mt-8 inline-flex">
              {cta.label}
            </Link>
          ) : null}
        </div>

        {/* Снимок в круге — приём референса: он разбивает прямоугольную сетку
            страницы, не добавляя ни рамок, ни теней. */}
        <div className={`relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-full ${reverse ? "md:order-1" : ""}`}>
          <Image src={photo} alt={alt} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
          {badge ? (
            <PhotoBadge position="bottom-center">{badge}</PhotoBadge>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────── три карточки */

export function CardsRow({
  title,
  items,
  fit = "cover",
}: {
  title?: string;
  items: readonly { title: string; text: string; photo?: string; alt?: string; badge?: string }[];
  /** Рендеры оборудования нельзя кадрировать: им нужен `contain` и подложка. */
  fit?: "cover" | "contain";
}) {
  return (
    <section className="border-y border-line bg-off">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        {title ? (
          <h2 className="max-w-[16em] text-[26px] font-bold leading-[1.12] tracking-[-0.02em] md:text-[36px]">
            {title}
          </h2>
        ) : null}
        <div className="mt-9 grid gap-5 md:grid-cols-3 md:gap-6">
          {items.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[20px] border border-line bg-white">
              {item.photo ? (
                <div className={`relative aspect-[16/10] w-full ${fit === "contain" ? "bg-off" : ""}`}>
                  <Image
                    src={item.photo}
                    alt={item.alt ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className={fit === "contain" ? "object-contain p-6" : "object-cover"}
                  />
                  {item.badge ? (
                    <PhotoBadge>{item.badge}</PhotoBadge>
                  ) : null}
                </div>
              ) : null}
              <div className="p-6 md:p-7">
                <h3 className="font-head text-[19px] font-bold leading-[1.25] text-graphite md:text-[21px]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-muted md:text-[15.5px]">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────── призыв и переходы дальше */

export function NextSteps({
  title,
  text,
  cta,
  links,
}: {
  title: string;
  text: string;
  cta: { label: string; href: string };
  links: readonly { title: string; label: string; href: string }[];
}) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <div className="text-center">
          <h2 className="mx-auto max-w-[16em] text-[26px] font-bold leading-[1.12] tracking-[-0.02em] md:text-[36px]">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-[40em] text-[16px] leading-[1.65] text-muted md:text-[17px]">{text}</p>
          <Link href={cta.href} className="btn-primary mt-8 inline-flex">
            {cta.label}
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex flex-col justify-between rounded-[20px] border border-line p-6 transition-colors hover:border-eco md:p-7"
            >
              <span className="font-head text-[19px] font-bold leading-[1.25] text-graphite md:text-[21px]">
                {l.title}
              </span>
              <span className="mt-8 flex items-center gap-2.5 font-head text-[13.5px] font-semibold text-graphite transition-colors group-hover:text-eco-dark">
                {l.label}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
                  <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────── откуда числа */

export function SourcesNote({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6 md:pb-20">
        <details className="group border-t border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between py-5 [&::-webkit-details-marker]:hidden">
            <span className="font-head text-[15px] font-bold text-graphite group-hover:text-eco-dark md:text-[16.5px]">
              Откуда эти числа
            </span>
            <span aria-hidden className="relative flex h-6 w-6 items-center justify-center text-eco-dark">
              <span className="absolute h-[1.5px] w-[15px] bg-current" />
              <span className="absolute h-[15px] w-[1.5px] bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
            </span>
          </summary>
          <div className="grid gap-x-10 gap-y-5 pb-7 md:grid-cols-2">
            {items.map((i) => (
              <div key={i.q}>
                <h3 className="font-head text-[14px] font-bold text-graphite">{i.q}</h3>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">{i.a}</p>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
