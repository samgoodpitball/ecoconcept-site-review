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
 * Этапы работы — «маршрутный лист» проекта (третий заход, по просьбе
 * заказчика сделать секцию одной из самых заметных на странице).
 *
 * Решение: единственная полноширинная хвойная секция в середине страницы —
 * тёмный якорь между светлыми блоками данных, читается как разворот
 * документа. Каждый этап — строка ведомости: гигантский моно-номер
 * (число-герой, светло-зелёный на хвое), заголовок с текстом и справа
 * штамп «НА ВЫХОДЕ» — рамка с моно-меткой, как печать на чертеже. Между
 * строками — линейка с делениями (ruler--dark): фирменная граница системы.
 *
 * Содержание не тронуто: четыре этапа, тексты и строки «На выходе»
 * дословно из src/content/home.ts. Поле term (сроки) по-прежнему пусто и
 * не рендерится, пока заказчик не даст реальные сроки.
 *
 * На 390 px строка складывается: номер и заголовок в одну линию, штамп
 * на всю ширину под текстом.
 */
export function Steps() {
  const s = home.steps;
  return (
    <section className="bg-graphite">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <Eyebrow light>{s.kicker}</Eyebrow>
        <div className="mt-6 grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-end">
          <h2 className="max-w-[14em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] !text-white md:text-[44px]">
            {s.title}
          </h2>
          <p className="max-w-[34em] text-[16px] leading-[1.6] text-white/65">{s.text}</p>
        </div>

        <ol className="mt-12 md:mt-14">
          {s.items.map((item) => (
            <li key={item.n}>
              <span aria-hidden className="ruler ruler--dark block" />
              <div className="grid gap-x-10 gap-y-4 py-8 md:grid-cols-[150px_minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-start md:py-10">
                {/* Номер-герой: главный визуальный такт секции */}
                <span
                  aria-hidden
                  className="num-hero block text-[56px] leading-[0.9] text-[#7CC24B]/85 md:text-[88px]"
                >
                  {item.n}
                </span>

                <div>
                  <h3 className="font-head text-[20px] font-bold leading-[1.2] text-white md:text-[24px]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[36em] text-[15.5px] leading-[1.65] text-white/70 md:text-[16px]">
                    {item.text}
                  </p>
                </div>

                {/* Штамп результата: что заказчик держит в руках после этапа */}
                <div className="rounded-[8px] border border-[#7CC24B]/45 p-4 md:justify-self-end md:p-5 md:min-w-[260px] md:max-w-[320px]">
                  <span className="mono-label !text-[#7CC24B]">На выходе</span>
                  <p className="mt-2 text-[14.5px] leading-[1.55] text-white/85">{item.result}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
