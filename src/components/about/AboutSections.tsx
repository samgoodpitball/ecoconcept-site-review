import Image from "next/image";
import { PhotoBadge, Eyebrow } from "@/components/product/SectionKit";
import Link from "next/link";
import LeadButton from "@/components/LeadButton";
import CareersForm from "./CareersForm";
import { about, type Gap } from "@/content/about";
import { contacts } from "@/content/site";

/**
 * Секции страницы «О компании».
 *
 * Визуальный язык — «инженерный документ», решение заказчика 04.09.2026:
 * типографика и линии вместо карточек с тенями, широкие фотополосы, один
 * акцентный цвет. Шапка, форма заявки и футер берутся со страницы каталога
 * без изменений — их оформление сюда не переносится.
 */

/** Факт, которого ещё нет в базе. Жёлтая пометка, чтобы её нельзя было не заметить. */
function GapMark({ value }: { value: Gap }) {
  return (
    <span className="whitespace-nowrap rounded-[4px] border-b border-dashed border-[#d3a35a] bg-[#fdefd6] px-1.5 font-semibold text-[#a8620a]">
      [{value.gap}]
    </span>
  );
}

/** Пометка на стоковой фотографии: появится своя съёмка — эта уходит. */
/** Обёртка над общей плашкой: на /about она стоит в левом нижнем углу. */
function StockBadge({ text = "Сток · заменить" }: { text?: string }) {
  return <PhotoBadge position="bottom-left">{text}</PhotoBadge>;
}


/* ────────────────────────────────────────────────────────────── hero */

export function AboutHero() {
  const h = about.hero;
  return (
    <section className="relative isolate flex min-h-[540px] flex-col justify-end overflow-hidden md:h-[80vh] md:max-h-[820px]">
      <Image
        src="/photo/stock/about-hero-v3.webp"
        alt={h.photoAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-graphite/60"
      />
      <span className="absolute right-4 top-4 z-10 rounded-[4px] bg-white/15 px-2 py-1 font-head text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">
        Сток · заменить своим объектом
      </span>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 md:px-6 md:pb-20 md:pt-44">
        <Eyebrow light>{h.kicker}</Eyebrow>
        <h1 className="mt-6 max-w-[15em] text-[36px] font-bold leading-[1.04] tracking-[-0.02em] !text-white md:text-[58px]">
          {h.title}
        </h1>
        <p className="mt-7 max-w-[36em] text-[16.5px] leading-[1.65] text-white/75 md:text-[18px]">{h.text}</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <LeadButton source="about-hero">{h.cta}</LeadButton>
          <Link
            href="/projects"
            className="border-b border-white/40 pb-1 font-head text-[15px] font-semibold text-white transition-colors hover:border-white"
          >
            {h.secondary}
          </Link>
        </div>
      </div>

      {/* Направления работы тонкой лентой — вместо блока с числами, которых у компании ещё нет */}
      <div className="relative border-t border-white/15 bg-graphite/40">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-10 gap-y-2 px-4 py-4 md:px-6">
          {h.marks.map((m) => (
            <li key={m} className="font-head text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">
              {m}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────── что значит «под ключ» */

/** Иконки этапов: обводка 2 px, скруглённые концы — единый вес по всей странице. */
const stepIcons = {
  ruler: (
    <>
      <rect x="6" y="4" width="11" height="32" rx="1.5" />
      <path d="M6 11h5M6 17h6.5M6 23h5M6 29h6.5" />
      <path d="M25 4h9v24l-4.5 9L25 28z" />
      <path d="M25 12h9" />
    </>
  ),
  plan: (
    <>
      <rect x="4" y="7" width="32" height="26" rx="1.5" />
      <path d="M4 14h32" />
      <rect x="11" y="20" width="9" height="8" rx="1" />
      <path d="M26 20h5M26 26h6" />
    </>
  ),
  wrench: (
    <>
      <path d="M28.5 4.5a9.5 9.5 0 0 0-8.6 13.2L5.6 31.9a3.1 3.1 0 0 0 4.4 4.4l14.2-14.2A9.5 9.5 0 0 0 36 12.9l-5.3 5.3-5.3-1.3-1.3-5.3 5.3-5.3a9.5 9.5 0 0 0-.9-1.8Z" />
    </>
  ),
  badge: (
    <>
      <circle cx="20" cy="14.5" r="9.5" />
      <path d="M13.5 22.5 11 36l9-4.8 9 4.8-2.5-13.5" />
      <path d="m20 10 1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6z" />
    </>
  ),
};

function StepIcon({ name }: { name: keyof typeof stepIcons }) {
  return (
    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center">
      <svg
        width="34"
        height="34"
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-eco-dark"
      >
        {stepIcons[name]}
      </svg>
    </span>
  );
}

export function AboutTurnkey() {
  const t = about.turnkey;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div>
        <Eyebrow>{t.kicker}</Eyebrow>
        <h2 className="mt-6 max-w-[16em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
          {t.title}
        </h2>
        <p className="mt-6 max-w-[40em] text-[16.5px] leading-[1.65] text-muted md:text-[17px]">{t.text}</p>
      </div>

      <div className="mt-16 grid gap-x-16 gap-y-12 md:mt-20 md:grid-cols-2 md:gap-y-16">
        {t.steps.map((step) => (
          <div
            key={step.title}
            className="flex gap-6 md:gap-7"
          >
            <StepIcon name={step.icon} />
            <div className="flex flex-col gap-3.5">
              <h3 className="font-head text-[17px] font-bold uppercase tracking-[0.05em] text-graphite md:text-[18px]">
                {step.title}
              </h3>
              <p className="max-w-[32em] text-[15.5px] leading-[1.7] text-muted">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href={t.link.href}
          className="group inline-flex items-center gap-3 font-head text-[14px] font-bold uppercase tracking-[0.12em] text-eco-dark transition-colors hover:text-eco"
        >
          {t.link.label}
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current transition-transform group-hover:translate-x-0.5">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
              <path d="m1.5 1 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────── команда: бригады и обучение (тёмная) */

export function AboutTeam() {
  const t = about.team;
  return (
    <section className="relative isolate overflow-hidden bg-graphite">
      <Image
        src="/photo/stock/about-training-v2.webp"
        alt={t.photoAlt}
        fill
        sizes="100vw"
        className="scale-x-[-1] object-cover object-[30%_center] opacity-40"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-graphite/80"
      />

      <div className="relative mx-auto grid max-w-6xl gap-14 px-4 py-20 md:grid-cols-[1.12fr_0.88fr] md:px-6 md:py-28">
        <div className="self-center">
          <Eyebrow light>{t.kicker}</Eyebrow>
          <h2 className="mt-6 max-w-[17em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] !text-white md:text-[42px]">
            {t.title}
          </h2>
          <p className="mt-7 max-w-[34em] text-[16.5px] leading-[1.7] text-white/[0.78] md:text-[17px]">{t.text}</p>
        </div>

        <figure className="self-center border-t border-white/15 pt-10 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          <svg width="30" height="23" viewBox="0 0 34 26" fill="none" aria-hidden="true" className="mb-6">
            <path
              d="M0 26V13.6C0 6.1 4.6 1.3 13 0l1.6 4.6C9.6 6 7 8.6 7 12.2h6.4V26H0Zm19.4 0V13.6C19.4 6.1 24 1.3 32.4 0L34 4.6C29 6 26.4 8.6 26.4 12.2h6.4V26H19.4Z"
              fill="#7CC24B"
            />
          </svg>
          {/* ⏳ Цитата показывается, только когда есть реальные слова и имя.
              Черновик с пропуском на месте имени посетителю видеть незачем —
              это заметка для нас, а не контент страницы. */}
          {typeof t.author === "string" ? (
            <>
              <blockquote className="font-head text-[21px] font-semibold leading-[1.4] !text-white md:text-[25px]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 text-[14.5px] text-white/65">
                {t.author} — {t.role}
              </figcaption>
            </>
          ) : (
            <p className="max-w-[26em] text-[16px] leading-[1.7] text-white/75">
              Мастеров обучали инженеры производителей — на том же оборудовании,
              которое мы ставим клиентам. Слова бригадира появятся здесь после съёмки
              на объекте.
            </p>
          )}
        </figure>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────── границы работ */

function Bullet() {
  return <span aria-hidden className="mt-[9px] block h-[5px] w-[5px] shrink-0 rounded-full bg-eco-dark" />;
}

export function AboutScope() {
  const s = about.scope;
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div>
          <Eyebrow>{s.kicker}</Eyebrow>
          <h2 className="mt-6 max-w-[18em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
            {s.title}
          </h2>
          <p className="mt-6 max-w-[40em] text-[16.5px] leading-[1.65] text-muted">{s.text}</p>
        </div>

        {/* блок «выполняем сами»: список слева, фотография справа */}
        <div className="mt-16 grid items-stretch bg-off md:grid-cols-[1.05fr_0.95fr]">
          <div className="p-8 md:p-12">
            <h3 className="font-head text-[22px] font-bold leading-tight text-graphite md:text-[26px]">
              {s.ours.title}
            </h3>
            <ul className="mt-7 flex flex-col gap-3.5">
              {s.ours.items.map((item) => (
                <li key={item} className="flex gap-3.5 text-[15.5px] leading-[1.6] text-ink">
                  <Bullet />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[280px] md:min-h-full">
            <Image
              src="/photo/stock/about-crew-v2.webp"
              alt={s.ours.photoAlt}
              fill
              sizes="(max-width: 768px) 100vw, 540px"
              className="object-cover"
            />
            <StockBadge />
          </div>
        </div>

        {/* блок «выполняют партнёры»: тот же список, но без фотографии */}
        <div className="mt-8 grid gap-8 border-t border-line pt-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
          <div>
            <h3 className="font-head text-[20px] font-bold leading-tight text-muted md:text-[22px]">
              {s.partners.title}
            </h3>
            <ul className="mt-6 grid gap-x-10 gap-y-3.5 sm:grid-cols-2 md:grid-cols-1">
              {s.partners.items.map((item) => (
                <li key={item} className="flex gap-3.5 text-[15.5px] leading-[1.6] text-muted">
                  <span aria-hidden className="mt-[11px] block h-px w-2.5 shrink-0 bg-[#9aa39c]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="max-w-[34em] self-start border-l-2 border-eco pl-6 text-[15.5px] leading-[1.7] text-muted">
            {s.note}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────── бренды */

export function AboutBrands() {
  const b = about.brands;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <Eyebrow>{b.kicker}</Eyebrow>
      <div className="mt-6 grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-end">
        <h2 className="max-w-[15em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
          {b.title}
        </h2>
        <p className="max-w-[34em] text-[16.5px] leading-[1.65] text-muted">{b.text}</p>
      </div>

      <div className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2">
        {b.items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex flex-col justify-between gap-7"
          >
            <div>
              <Image
                src={item.logo}
                alt={item.name}
                width={220}
                height={56}
                className={`${item.height} w-auto object-contain object-left grayscale transition-[filter] duration-200 group-hover:grayscale-0`}
              />
              <h3 className="mt-8 font-head text-[12px] font-bold uppercase tracking-[0.18em] text-eco-dark">
                {item.role}
              </h3>
              <p className="mt-4 max-w-[30em] text-[15.5px] leading-[1.7] text-muted">{item.text}</p>
            </div>
            <span className="flex items-center gap-2.5 font-head text-[13.5px] font-semibold text-graphite transition-colors group-hover:text-eco-dark">
              Смотреть в каталоге
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────── проекты */

export function AboutProjects() {
  const p = about.projects;
  return (
    <section className="border-y border-line bg-off">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow>{p.kicker}</Eyebrow>
            <h2 className="mt-6 text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">{p.title}</h2>
          </div>
          <Link
            href="/projects"
            className="group flex items-center gap-2.5 font-head text-[14px] font-semibold text-graphite transition-colors hover:text-eco-dark"
          >
            {p.link}
            <svg
              width="16"
              height="10"
              viewBox="0 0 16 10"
              fill="none"
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {p.items.map((item) => (
            <article key={item.title} className="group">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eceef0]">
                <Image
                  src={item.photo}
                  /* Содержательное изображение: пустой alt здесь скрывал бы от
                     скринридера единственное описание объекта. */
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 92vw, 360px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <StockBadge />
              </div>
              <h3 className="mt-6 border-t border-line pt-6 font-head text-[18px] font-bold text-graphite">
                {item.title}, <GapMark value={item.city} />
              </h3>
              <p className="mt-3 max-w-[30em] text-[15px] leading-[1.7] text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────── контакты и офис */

export function AboutOffice() {
  const o = about.office;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div className="grid gap-14 md:grid-cols-[1fr_1fr] md:gap-20">
        <div>
          <Eyebrow>{o.kicker}</Eyebrow>
          <h2 className="mt-6 max-w-[13em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
            {o.title}
          </h2>

          <dl className="mt-12 border-t border-line">
            <div className="grid gap-2 border-b border-line py-5 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">
              <dt className="font-head text-[11.5px] font-bold uppercase tracking-[0.16em] text-muted">Телефон</dt>
              <dd className="flex flex-col gap-1.5">
                <a href={contacts.phoneHref} className="font-head text-[19px] font-bold text-graphite hover:text-eco-dark">
                  {contacts.phoneDisplay}
                </a>
                <a href={contacts.phone2Href} className="font-head text-[19px] font-bold text-graphite hover:text-eco-dark">
                  {contacts.phone2Display}
                </a>
              </dd>
            </div>
            <div className="grid gap-2 border-b border-line py-5 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">
              <dt className="font-head text-[11.5px] font-bold uppercase tracking-[0.16em] text-muted">WhatsApp</dt>
              <dd className="text-[15.5px] text-ink">
                <a
                  href={contacts.whatsapp("about")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-eco-dark"
                >
                  {contacts.phoneDisplay}
                </a>{" "}
                — отвечаем в течение рабочего дня
              </dd>
            </div>
            {o.rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-2 border-b border-line py-5 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8"
              >
                <dt className="font-head text-[11.5px] font-bold uppercase tracking-[0.16em] text-muted">{row.label}</dt>
                <dd className={`max-w-[34em] text-[15.5px] ${row.accent ? "font-semibold text-eco-dark" : "text-ink"}`}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex min-h-[340px] items-center justify-center border border-line bg-off md:min-h-full">
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="#a7aeb3" strokeWidth="1.5" />
              <circle cx="12" cy="10" r="2.6" stroke="#a7aeb3" strokeWidth="1.5" />
            </svg>
            <span className="text-[13.5px] text-muted">{o.mapNote}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────── вакансии */

export function AboutCareers() {
  const c = about.careers;
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <h2 className="text-center text-[34px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[52px]">
          {c.title}
        </h2>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/photo/stock/about-careers-v2.webp"
              alt={c.photoAlt}
              fill
              sizes="(max-width: 768px) 92vw, 520px"
              className="object-cover"
            />
            <StockBadge text="Сток · заменить своей съёмкой" />
          </div>

          {/* текст оптически центрирован относительно фотографии, как в референсе */}
          <div className="flex flex-col md:pt-12">
            <h3 className="font-head text-[24px] font-bold leading-tight text-graphite md:text-[28px]">
              {c.subtitle}
            </h3>
            <p className="mt-6 max-w-[34em] text-[16.5px] leading-[1.7] text-muted">{c.text}</p>
            <p className="mt-5 max-w-[34em] text-[16.5px] leading-[1.7] text-muted">{c.text2}</p>
            <div className="mt-9">
              <CareersForm />
            </div>
            <span aria-hidden className="mt-14 hidden h-[3px] w-full max-w-[420px] self-end bg-eco md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
