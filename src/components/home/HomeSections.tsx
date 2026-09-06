import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/product/SectionKit";
import { home } from "@/content/home";

/**
 * Секции главной страницы (/).
 *
 * Язык тот же, что на продуктовых страницах: линии вместо теней, один акцент,
 * ничего не появляется при прокрутке. Секция «Почему EcoConcept» здесь не своя,
 * а общий компонент WhyUs — он подключается прямо на странице.
 *
 * ⚠️ Не путать со старыми файлами в этой же папке (Hero, Heat, Solar, Combo…):
 * это вёрстка главной прежнего поколения, снесённой при чистом старте 03.09.
 */

/** Стрелка ссылки: та же, что в секции брендов на /about. */
function Arrow() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      aria-hidden="true"
      className="transition-transform group-hover:translate-x-1"
    >
      <path
        d="M0 5h14M10 1l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Лента производителей.
 *
 * Горизонтальный ряд из четырёх логотипов, разделённых вертикальными линиями:
 * на десктопе — в одну строку, на телефоне — в две по два. Логотипы серые и
 * получают цвет при наведении, как на /about. Под каждым — роль, чтобы ряд
 * читался как факт, а не как «нам доверяют».
 */
export function Brands() {
  const b = home.brands;
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-10">
          <Eyebrow>{b.kicker}</Eyebrow>
          <h2 className="font-head text-[17px] font-bold leading-[1.3] tracking-[-0.01em] text-graphite md:text-[19px]">
            {b.title}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4">
          {b.items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex flex-col items-start gap-4 border-line px-1 py-6 [&:not(:nth-child(2n))]:border-r md:px-6 md:py-2 md:border-r md:[&:last-child]:border-r-0 md:[&:first-child]:pl-0 md:[&:last-child]:pr-0"
            >
              <span className="flex h-9 items-center md:h-10">
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={220}
                  height={56}
                  className={`${item.height} w-auto object-contain object-left grayscale transition-[filter] duration-200 group-hover:grayscale-0`}
                />
              </span>
              <span className="font-head text-[11px] font-bold uppercase leading-[1.4] tracking-[0.14em] text-muted transition-colors group-hover:text-eco-dark">
                {item.role}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Этапы работы — горизонтальный таймлайн.
 *
 * Третий визуальный ход для одного и того же сюжета: на продуктовых страницах
 * это тёмная полоса с аккордеоном и фотографией до края экрана, на /about —
 * сетка 2×2 с линейными иконками. Здесь ни фото, ни иконок, ни тёмного фона:
 * одна линия с засечками, крупные номера и строка «на выходе» под каждым
 * этапом. Так секция не спорит с лентой «Почему EcoConcept», которая стоит
 * следом и целиком построена на снимках.
 *
 * Раскладка: на десктопе четыре колонки под общей горизонтальной линией, на
 * телефоне — вертикальная линия слева и те же засечки.
 */
export function Steps() {
  const s = home.steps;
  return (
    <section className="border-b border-line bg-off">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <Eyebrow>{s.kicker}</Eyebrow>
        <div className="mt-6 grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-end">
          <h2 className="max-w-[14em] text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[38px]">
            {s.title}
          </h2>
          <p className="max-w-[34em] text-[16px] leading-[1.6] text-muted">{s.text}</p>
        </div>

        <div className="relative mt-14">
          {/* Общая линия этапов. На десктопе проходит под номерами, на телефоне
              её заменяет вертикальная — она задана рамкой у каждой строки. */}
          <span
            aria-hidden
            className="absolute left-0 right-0 top-[69px] hidden h-px bg-line md:block"
          />

          {/* subgrid выравнивает одноимённые части всех четырёх колонок по общим
              строкам: иначе линия «На выходе» стоит в каждой колонке на своей
              высоте — тексты этапов разной длины. */}
          <ol className="grid gap-10 md:grid-cols-4 md:grid-rows-[auto_auto_1fr_auto] md:gap-x-8 md:gap-y-0">
            {s.items.map((item) => (
              <li
                key={item.n}
                className="relative pl-8 md:row-span-4 md:grid md:grid-rows-subgrid md:pl-0"
              >
                {/* Вертикальная линия телефонной раскладки. */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-[4px] top-2 w-px bg-line md:hidden"
                />

                <span className="block">
                  <span className="hidden font-head text-[44px] font-bold leading-none tabular-nums text-graphite/20 md:block">
                    {item.n}
                  </span>
                  {/* Засечка на линии: квадрат, а не точка — та же геометрия, что
                      у отметок списков в SectionKit. */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-[6px] block h-[9px] w-[9px] bg-eco md:relative md:left-auto md:top-0 md:mt-[16px]"
                  />
                </span>

                <span className="mt-1 block md:mt-6">
                  <span className="flex items-baseline gap-3">
                    <span className="font-head text-[15px] font-bold tabular-nums text-graphite/40 md:hidden">
                      {item.n}
                    </span>
                    <h3 className="font-head text-[19px] font-bold leading-[1.2] text-graphite md:text-[21px]">
                      {item.title}
                    </h3>
                  </span>
                  {item.term ? (
                    <span className="mt-2 block font-head text-[12px] font-bold uppercase tracking-[0.14em] text-eco-dark">
                      {item.term}
                    </span>
                  ) : null}
                </span>

                <p className="mt-3 text-[15px] leading-[1.6] text-muted">{item.text}</p>

                <p className="mt-5 border-t border-line pt-4 text-[14.5px] leading-[1.5] text-graphite">
                  <span className="mb-1.5 block font-head text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">
                    На выходе
                  </span>
                  {item.result}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
