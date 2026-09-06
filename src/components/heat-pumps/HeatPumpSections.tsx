import Image from "next/image";
import Link from "next/link";
import StepsAccordion from "@/components/product/StepsAccordion";
import ModelsCarousel from "@/components/product/ModelsCarousel";
import { Eyebrow, Disclosure, CheckMark, ModelCard } from "@/components/product/SectionKit";
import VideoExplainer from "@/components/product/VideoExplainer";
import { heatPumps } from "@/content/heat-pumps";
import { itemsOf, categoryHref } from "@/lib/catalog-view";

/**
 * Секции страницы «Тепловые насосы» (/heat-pumps).
 *
 * Визуальный язык — тот же «инженерный документ», что на /about: типографика и
 * линии вместо карточек с тенями, один акцентный цвет, число с условием рядом.
 * Раскладка следует порядку вопросов клиента, а не порядку нашего ассортимента.
 */

/* ───────────────────────────────────────────────────────────  hero */

export function HpHero() {
  const h = heatPumps.hero;
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-2 md:gap-16 md:px-6 md:py-20">
        {/* Фотография оборудования из каталога, а не сток: раскладка hero повторяет
            референс 1KOMMA5° — снимок слева, заголовок и три факта справа. */}
        <figure className="order-2 md:order-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] border border-line bg-white">
            <Image
              src={h.photo.src}
              alt={h.photo.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 560px"
              className="scale-[1.06] object-cover object-center"
            />
          </div>
          <figcaption className="mt-3.5 text-[13.5px] text-muted">
            <Link href={h.photo.href} className="border-b border-line pb-0.5 transition-colors hover:border-eco hover:text-eco-dark">
              {h.photo.caption}
            </Link>
          </figcaption>
        </figure>

        <div className="order-1 md:order-2">
          <Eyebrow>{h.kicker}</Eyebrow>
          <h1 className="mt-6 text-[34px] font-bold leading-[1.06] tracking-[-0.025em] md:text-[52px]">{h.title}</h1>
          <p className="mt-7 max-w-[34em] text-[16.5px] leading-[1.65] text-muted md:text-[17px]">{h.text}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={h.primary.href} className="btn-primary">
              {h.primary.label}
            </Link>
            <Link href={h.secondary.href} className="btn-outline">
              {h.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────── четыре причины (категория) */

export function HpReasons() {
  const r = heatPumps.reasons;
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

/* ─────────────────────────────────────────── как работает: две схемы */

function CycleDiagram() {
  return (
    <div className="relative aspect-[1600/1195] w-full overflow-hidden rounded-[20px]">
      <Image
        src="/images/scheme-cycle-3d.webp"
        alt="Схема работы теплового насоса: испаритель, компрессор, конденсатор и клапан в замкнутом контуре; тепло воздуха входит слева, тепло уходит в радиатор справа, электричество подводится к компрессору"
        fill
        sizes="(max-width: 768px) 100vw, 560px"
        className="object-contain"
      />
    </div>
  );
}

/**
 * Разводка по дому: куда уходит тепло от насоса. Генерация принята 04.09,
 * вечером заменена объёмным вариантом — семь русских подписей, зелёный контур
 * отопления, синий на фанкойл, амбер на ГВС.
 *
 * На узком экране схема не сжимается до нечитаемых подписей, а прокручивается
 * вбок — правило для широких блоков из дизайн-системы.
 */
/**
 * ⏳ Статичный разрез дома. С 05.09.2026 его место занял ролик — та же схема,
 * но по шагам и с озвучкой. Компонент оставлен намеренно: вернуть картинку —
 * одна строка в HpHow.
 */
function HouseScheme() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 md:px-6 md:pb-28">
      <div className="overflow-x-auto">
        <div className="relative aspect-[1800/1049] min-w-[680px] overflow-hidden rounded-[12px] border border-line bg-white">
          <Image
            src="/images/scheme-house-3d.webp"
            alt="Разрез дома: наружный блок на стене, внутренний блок и бак ГВС в технической комнате; зелёный контур идёт на радиатор в спальне и на тёплый пол в гостиной, синий — на фанкойл в столовой, оранжевый — от бака ГВС на душ в ванной"
            fill
            sizes="(max-width: 768px) 680px, 1100px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export function HpHow() {
  const h = heatPumps.how;
  return (
    <section id="how" className="scroll-mt-24 border-y border-line bg-off">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-14 pt-20 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:px-6 md:pb-16 md:pt-28">
        <CycleDiagram />
        <div>
          <Eyebrow>{h.kicker}</Eyebrow>
          <h2 className="mt-6 max-w-[14em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[42px]">
            {h.title}
          </h2>
          {h.text.map((p) => (
            <p key={p} className="mt-6 max-w-[36em] text-[16px] leading-[1.7] text-muted">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Анимированный разрез дома вместо статичного: тот же дом и та же
          разводка, но по шагам и с озвучкой. Статичная схема осталась в public. */}
      <div className="pb-16 md:pb-20">
        <VideoExplainer {...heatPumps.video} />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────── оборудование */

/**
 * Оборудование. Горизонтальная лента вместо двух сеток: секция перестала быть
 * витриной каталога и стала одним жестом — пролистал, нажал «весь каталог».
 * Бытовые идут первыми, коммерческие следом; вводный абзац и подзаголовки
 * групп убраны (решение заказчика: «без лишнего текста»).
 */
export function HpModels() {
  const m = heatPumps.models;
  const all = itemsOf("heat-pumps");
  const ordered = [
    ...all.filter((i) => i.group !== "Коммерческие"),
    ...all.filter((i) => i.group === "Коммерческие"),
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>{m.kicker}</Eyebrow>
          <h2 className="mt-6 text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">{m.title}</h2>
        </div>
        <Link
          href={categoryHref("heat-pumps")}
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
              <ModelCard item={item} />
            </div>
          ))}
        </ModelsCarousel>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────── три шага */

/**
 * Три шага. Раскладка по образцу 1KOMMA5°: тёмная полоса, аккордеон слева,
 * фотография шага справа. Вся секция — в клиентском компоненте, потому что
 * выбранный шаг управляет и текстом, и снимком.
 */
export function HpSteps() {
  const s = heatPumps.steps;
  return (
    <StepsAccordion kicker={s.kicker} title={s.title} items={s.items} source="heat-pumps" interest="heat" />
  );
}

/* ─────────────────────────────────────────────────────────────── FAQ */

export function HpFaq() {
  const f = heatPumps.faq;
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
