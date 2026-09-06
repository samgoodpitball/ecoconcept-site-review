"use client";

import { useState } from "react";
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
 * Этапы работы — вкладки с раскрытием.
 *
 * Раскладка снята с octopus.energy/heat-pump-explore: ряд переключателей
 * сверху, под ними панель выбранного этапа — текст слева, снимок справа.
 * Приём решает то, чего не мог маршрутный лист: секция занимает один экран
 * вместо четырёх, а человек читает ровно тот этап, который его интересует.
 *
 * Переключение — по клику, без появления при прокрутке: движение остаётся
 * откликом на действие.
 */
export function Steps() {
  const s = home.steps;
  const [active, setActive] = useState(0);
  const step = s.items[active];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="overflow-hidden rounded-[32px] bg-graphite px-6 py-10 md:px-10 md:py-12">
        <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr] md:items-end md:gap-8">
            <div>
              <Eyebrow light>{s.kicker}</Eyebrow>
              <h2 className="mt-4 max-w-[14em] text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-[34px]">
                {s.title}
              </h2>
            </div>
            <p className="max-w-[34em] text-[15.5px] leading-[1.6] text-white/70">{s.text}</p>
          </div>

        {/* Переключатели этапов. На телефоне едут вбок: четыре названия в
            строку не помещаются, а перенос ломает ряд. */}
          <div className="mt-7 -mx-6 overflow-x-auto px-6 md:mx-0 md:overflow-visible md:px-0">
          <div
            role="tablist"
            aria-label={s.title}
            className="flex min-w-max gap-2 rounded-[12px] border border-white/15 p-1.5 md:min-w-0"
          >
            {s.items.map((item, i) => {
              const on = i === active;
              return (
                <button
                  key={item.n}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={`flex flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-[8px] px-4 py-3 transition-colors ${
                    on ? "bg-eco-bright text-graphite" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className={`num text-[13px] ${on ? "text-graphite/70" : "text-white/45"}`}>{item.n}</span>
                  <span className="font-head text-[15px] font-semibold md:text-[16px]">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

          {/* Панель этапа: номер, заголовок и текст. Снимки и блок «На выходе»
              сняты 06.09.2026 — секция должна занимать минимум места, а
              подробности этапа человек получает в разговоре, а не на главной.
              Поля photo/result в контенте сохранены. */}
          <div
            key={step.n}
            className="mt-4 flex flex-col gap-4 rounded-[20px] border border-white/12 p-6 [animation:fade-in_.22s_ease-out] motion-reduce:[animation:none] md:flex-row md:items-start md:gap-8 md:p-8"
          >
            <span className="num-hero shrink-0 text-[36px] leading-none text-eco-bright md:text-[44px]">
              {step.n}
            </span>
            <div>
              <h3 className="font-head text-[21px] font-bold leading-[1.2] text-white md:text-[24px]">
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-[46em] text-[15px] leading-[1.6] text-white/75 md:text-[16px]">
                {step.text}
              </p>
              {step.term ? (
                <span className="mono-label mt-3 block text-eco-bright">{step.term}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
