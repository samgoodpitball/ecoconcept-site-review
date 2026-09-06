import Image from "next/image";
import Link from "next/link";
import { ru, contacts } from "@/content/site";
import LeadButton from "./LeadButton";
import ImageSlot from "./ImageSlot";
import { getSlotMediaMap } from "@/lib/media";

function WaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.6.1-.8l.4-.5c.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

export async function Hero() {
  return (
    <section className="relative overflow-hidden bg-off">
      <Image
        src="/brand/leaf.png"
        alt=""
        width={560}
        height={525}
        className="pointer-events-none absolute -right-24 -bottom-28 w-[420px] opacity-[0.06]"
        priority
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-12 md:grid-cols-[1.05fr_0.95fr] md:px-6 md:pb-20 md:pt-16">
        <div>
          <span className="kicker">{ru.hero.kicker}</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-[52px]">
            {ru.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">{ru.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LeadButton source="hero">{ru.hero.ctaPrimary}</LeadButton>
            <a
              href={contacts.whatsapp("hero")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <WaIcon />
              {ru.hero.ctaWhatsApp}
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {ru.hero.chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative">
            <ImageSlot
              slotId="home-hero"
              alt={ru.hero.imageAlt}
              src="/images/phnix-g20.png"
              priority
              sizes="(max-width: 768px) 92vw, 460px"
              rounded="rounded-[20px]"
              className="bg-tint"
              imageClassName="object-cover"
              fallbackClassName="object-contain p-6 md:p-8"
            />
            <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 font-head text-[13px] font-bold text-eco-dark shadow-sm">
              Тепловые насосы · R290
            </div>
          </div>

          {/* Плавающие карточки-факты */}
          <div className="absolute -bottom-5 left-2 hidden max-w-[190px] rounded-[12px] bg-white px-4 py-3 shadow-[0_12px_32px_rgba(20,20,20,0.14)] md:block">
            <div className="font-head text-[20px] font-extrabold leading-none text-eco-dark">−25 °C</div>
            <p className="mt-1.5 text-[12px] leading-snug text-muted">работают в морозы</p>
          </div>
          <div className="absolute -top-4 right-2 hidden max-w-[200px] rounded-[12px] bg-white px-4 py-3 shadow-[0_12px_32px_rgba(20,20,20,0.14)] lg:block">
            <div className="font-head text-[20px] font-extrabold leading-none text-eco-dark">до 4,8 кВт</div>
            <p className="mt-1.5 text-[12px] leading-snug text-muted">тепла из 1 кВт электричества</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function BrandsStrip() {
  // Логотип из CMS (slotId logo-*) имеет приоритет, иначе — статический файл бренда
  const media = await getSlotMediaMap();
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <p className="kicker !text-muted text-center">{ru.brands.kicker}</p>
        <ul className="mt-6 grid grid-cols-3 items-center gap-x-6 gap-y-6">
          {ru.brands.items.map((b) => {
            const logo = media.get(b.slot);
            const src = logo?.url ?? b.image;
            return (
              <li key={b.name} className="flex flex-col items-center justify-center gap-2">
                <div className="flex h-14 w-32 items-center justify-center">
                  <Image
                    src={src}
                    alt={b.name}
                    width={200}
                    height={60}
                    className="max-h-12 max-w-full w-auto object-contain"
                  />
                </div>
                <span className="text-[12px] text-muted">{b.note}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-center text-[13px] text-muted">{ru.brands.footnote}</p>
      </div>
    </section>
  );
}

/** Блок «боль → решение»: локальная правда о смоге, тарифах и отключениях. */
export function ProblemSolution() {
  const p = ru.problemSolution;
  return (
    <section className="bg-off">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <span className="kicker">{p.kicker}</span>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">{p.title}</h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">{p.intro}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {p.pairs.map((pair) => (
            <div key={pair.pain} className="rounded-[12px] border border-line bg-white p-6">
              <div className="flex items-start gap-2.5">
                <svg width="20" height="20" viewBox="0 0 20 20" className="mt-0.5 shrink-0 text-muted" aria-hidden="true">
                  <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M10 5.8v4.6M10 13.4v.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <p className="font-head text-[15px] font-bold text-graphite">{pair.pain}</p>
              </div>
              <div className="mt-3.5 flex items-start gap-2.5 border-t border-line pt-3.5">
                <svg width="20" height="20" viewBox="0 0 20 20" className="mt-0.5 shrink-0" aria-hidden="true">
                  <circle cx="10" cy="10" r="9" fill="#EAF3DF" />
                  <path d="M6.2 10.3l2.6 2.6 5-5.2" stroke="#448A16" strokeWidth="1.9" fill="none" strokeLinecap="round" />
                </svg>
                <p className="text-[14.5px] leading-relaxed text-ink">{pair.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsBand() {
  const stats = [
    { v: "3–4 кВт", l: "тепла из 1 кВт электричества — физика теплового насоса" },
    { v: "−25 °C", l: "рабочие морозы линеек PHNIX и Hisense" },
    { v: "635 Вт", l: "мощность солнечного модуля Trina Vertex N" },
    { v: "30 лет", l: "гарантия на мощность солнечных модулей" },
  ];
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-eco to-eco-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 opacity-[0.06]"
        style={{ backgroundImage: "url(/brand/leaf_white.png)", backgroundSize: "104px", transform: "rotate(-8deg)" }}
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-7 px-4 py-10 md:grid-cols-4 md:px-6 md:py-12">
        {stats.map((s) => (
          <div key={s.v}>
            <div className="font-head text-[30px] font-extrabold leading-none text-white">{s.v}</div>
            <p className="mt-2 max-w-[220px] text-[13px] leading-snug text-white/80">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function Directions() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <span className="kicker">{ru.directions.kicker}</span>
      <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">{ru.directions.title}</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ru.directions.items.map((d) => (
          <article key={d.id} id={d.id} className="card card-hover flex scroll-mt-24 flex-col overflow-hidden">
            <Link href={d.href} aria-label={d.title} className="block">
              <ImageSlot
                slotId={d.slot}
                alt={d.imageAlt}
                src={d.image}
                sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 380px"
                rounded="rounded-none"
                imageClassName="object-cover"
                fallbackClassName="object-contain p-6"
                label={d.title}
              />
            </Link>
            <div className="flex grow flex-col border-t border-line p-6 md:p-7">
              <h3 className="text-[21px] font-bold">{d.title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{d.text}</p>
              <ul className="mt-4 space-y-2">
                {d.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[14px] text-ink">
                    <svg width="18" height="18" viewBox="0 0 18 18" className="mt-0.5 shrink-0" aria-hidden="true">
                      <circle cx="9" cy="9" r="8" fill="#EAF3DF" />
                      <path d="M5.5 9.2l2.3 2.3 4.7-4.8" stroke="#448A16" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={d.href}
                className="mt-auto inline-flex items-center gap-1.5 pt-5 font-head text-[14px] font-bold text-eco-dark hover:underline"
              >
                Подробнее о направлении
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8h9M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Why() {
  return (
    <section id="why" className="scroll-mt-24 bg-off">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <span className="kicker">{ru.why.kicker}</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{ru.why.title}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ru.why.items.map((item, i) => (
            <div key={item.title} className="rounded-[12px] border border-line bg-white p-6">
              <div className="font-head text-2xl font-extrabold text-eco-dark">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-3 text-[17px] font-bold">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Steps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <span className="kicker">{ru.steps.kicker}</span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{ru.steps.title}</h2>
      <ol className="mt-10 grid gap-4 md:grid-cols-5">
        {ru.steps.items.map((s, i) => (
          <li key={s.title} className="card relative p-5">
            <div className="font-head text-3xl font-extrabold text-eco/25">{i + 1}</div>
            <h3 className="mt-2 text-[15px] font-bold leading-snug">{s.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Solutions() {
  return (
    <section id="solutions" className="scroll-mt-24 bg-tint/60">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kicker">{ru.solutions.kicker}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{ru.solutions.title}</h2>
          </div>
          <p className="max-w-sm text-[14px] text-muted">{ru.solutions.note}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {ru.solutions.items.map((s) => (
            <article key={s.title} className="flex flex-col overflow-hidden rounded-[12px] border border-line bg-white">
              <div className="relative flex h-48 items-center justify-center bg-off p-6">
                <span className="absolute left-4 top-4 rounded-full bg-tint px-3 py-1 font-head text-[11px] font-bold uppercase tracking-wider text-eco-dark">
                  {s.tag}
                </span>
                <Image src={s.image} alt={s.title} width={300} height={300} className="h-full w-auto object-contain" />
              </div>
              <div className="grow border-t border-line p-6">
                <h3 className="text-lg font-bold">{s.title}</h3>
                <div className="font-head text-[13px] font-bold uppercase tracking-wide text-eco-dark">{s.subtitle}</div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-muted">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
