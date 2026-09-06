"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoBadge } from "./SectionKit";
import Link from "next/link";
import LeadButton from "@/components/LeadButton";

/**
 * Секция «Как мы работаем» по образцу 1KOMMA5°: тёмная полоса на всю ширину,
 * слева заголовок и аккордеон из трёх шагов, справа фотография во всю высоту.
 * Раскрыт всегда ровно один шаг — он же выбирает фотографию справа.
 *
 * Отличия от референса только в цвете: графит вместо угольного, наш зелёный
 * #7CC24B вместо сиреневого (тот же акцент, что в футере и на /about — на
 * тёмном фоне основной #448a16 не проходит AA для мелкого текста).
 *
 * Секция общая для продуктовых страниц: шаги приходят из контента страницы,
 * различаются только текст и снимки.
 */

const ACCENT = "#7CC24B";

export type Step = {
  readonly n: string;
  readonly title: string;
  readonly text: string;
  readonly cta: string;
  readonly ctaHref?: string;
  readonly photo: string;
  readonly photoAlt: string;
  readonly stock?: boolean;
};

/** Плюс/минус справа от заголовка шага. Тонкие линии, без кружков и заливок. */
function Toggle({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative mt-1 block h-4 w-4 shrink-0">
      <span className="absolute left-0 top-1/2 block h-px w-4 -translate-y-1/2 bg-white/70" />
      <span
        className={`absolute left-1/2 top-0 block h-4 w-px -translate-x-1/2 bg-white/70 transition-transform duration-200 ease-out motion-reduce:transition-none ${
          open ? "scale-y-0" : "scale-y-100"
        }`}
      />
    </span>
  );
}

export default function StepsAccordion({
  kicker,
  title,
  items,
  source,
  interest,
}: {
  kicker: string;
  title: string;
  items: readonly Step[];
  /** Префикс источника лида: к нему добавляется номер шага. */
  source: string;
  interest: string;
}) {
  const [active, setActive] = useState(0);
  const photo = items[active];

  return (
    /* Плоская фирменная хвоя вместо диагональной растяжки: градиент 04.09
       компенсировал «чужой» чёрный графит, в новой палитре тёмный сам по
       себе брендовый, и якорные секции по всему сайту одноцветные. */
    <section className="bg-graphite">
      <div className="grid items-stretch md:grid-cols-2">
        {/* Левая колонка выровнена по общей сетке страницы (max-w-6xl = 72rem),
            правая уходит фотографией в край экрана — как в референсе. */}
        <div className="px-4 py-16 md:py-24 md:pl-[max(1.5rem,calc((100vw-72rem)/2))] md:pr-12 lg:pr-16">
          <span className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-8 bg-white/40" />
            <span className="font-head text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">
              {kicker}
            </span>
          </span>

          <h2 className="mt-6 max-w-[13em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] !text-white md:text-[42px]">
            {title}
          </h2>

          <ol className="mt-10 flex flex-col gap-3">
            {items.map((item, i) => {
              const open = i === active;
              return (
                <li
                  key={item.n}
                  /* У раскрытого шага ни рамки, ни заливки — текст лежит прямо
                     на градиенте (решение заказчика 04.09). Свёрнутые остаются
                     плашками, поэтому выбранный всё равно читается как выбранный. */
                  className={`rounded-[12px] transition-colors duration-200 ease-out motion-reduce:transition-none ${
                    open ? "bg-transparent" : "bg-white/[0.07] hover:bg-white/[0.1]"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`${source}-step-${item.n}`}
                      onClick={() => setActive(i)}
                      className="flex w-full cursor-pointer items-start justify-between gap-6 px-6 py-6 text-left md:px-7 md:py-7"
                    >
                      <span className="font-head text-[17px] font-bold leading-[1.3] text-white md:text-[20px]">
                        <span className="tabular-nums">{i + 1}.</span> {item.title}
                      </span>
                      <Toggle open={open} />
                    </button>
                  </h3>

                  {/* Раскрытие через grid-rows: высота считается браузером,
                      без замеров в JS и без скачка при смене шрифта. */}
                  <div
                    id={`${source}-step-${item.n}`}
                    className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-7 md:px-7">
                        <p className="max-w-[34em] text-[15.5px] leading-[1.7] text-white/[0.72]">{item.text}</p>
                        <div className="mt-5">
                          {item.ctaHref ? (
                            <Link
                              href={item.ctaHref}
                              className="font-head text-[15px] font-bold underline-offset-4 hover:underline"
                              style={{ color: ACCENT }}
                              tabIndex={open ? undefined : -1}
                            >
                              {item.cta}
                            </Link>
                          ) : (
                            <LeadButton
                              source={`${source}-step-${item.n}`}
                              interest={interest}
                              className="cursor-pointer font-head text-[15px] font-bold underline-offset-4 hover:underline"
                            >
                              <span style={{ color: ACCENT }}>{item.cta}</span>
                            </LeadButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="relative min-h-[300px] md:min-h-full">
          {items.map((item, i) => (
            <Image
              key={item.photo}
              src={item.photo}
              alt={item.photoAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
              className={`object-cover transition-opacity duration-200 ease-out motion-reduce:transition-none ${
                i === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {photo.stock ? (
            <PhotoBadge position="bottom-left">ИИ-генерация · заменить своей съёмкой</PhotoBadge>
          ) : null}
        </div>
      </div>
    </section>
  );
}
