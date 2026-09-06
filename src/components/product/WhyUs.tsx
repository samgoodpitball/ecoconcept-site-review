"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoBadge, Eyebrow } from "@/components/product/SectionKit";
import type { IconName } from "@/components/ui/icons";

/**
 * Секция «Почему EcoConcept» — причины выбрать нас, а не соседа по рынку.
 *
 * Возвращена лента плиток со снимками (решение заказчика, третий заход):
 * протокол без фотографий не подошёл. Структура — прежняя, из ветки main
 * (ряд высоких плиток по образцу energysage.com: наведение расширяет,
 * клик раскрывает текст), но одета в систему «инженерного журнала»:
 * левая шапка с номером секции вместо центра, радиус 10px, затемнение —
 * плоская хвоя, служебная метка «Подробнее» — моно-голосом. Плашки
 * происхождения снимков обязательны, пока нет своей съёмки.
 *
 * Разделение «навёл — шире, нажал — текст» — постановка заказчика
 * 05.09.2026: пробегая мышью по ряду, человек читает только заголовки и
 * не получает прыгающих абзацев; текст приходит, когда он его выбрал.
 *
 * Секция общая для всех страниц, различается только контент.
 */

export type WhyItem = {
  readonly title: string;
  readonly text: string;
  readonly photo: string;
  readonly alt: string;
  /** Плашка на снимке: «Сток · заменить» или «ИИ-генерация». Пусто — своя съёмка. */
  readonly badge?: string;
  /** Знак сущности; лентой не используется, поле сохранено для других подач. */
  readonly icon?: IconName;
};

export default function WhyUs({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: readonly WhyItem[];
}) {
  /* Открытая кликом плитка: она показывает текст. Первая открыта сразу —
     иначе по ряду заголовков не видно, что за ними есть содержание. */
  const [open, setOpen] = useState(0);
  /* Наведение только расширяет плитку и текста не показывает. */
  const [hovered, setHovered] = useState<number | null>(null);

  const wide = hovered ?? open;

  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        {/* Подзаголовок играет роль рубрики — секция получает ту же левую
            шапку с номером, что и все остальные. */}
        <Eyebrow>{subtitle}</Eyebrow>
        <h2 className="mt-5 max-w-[16em] text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">
          {title}
        </h2>

        <div
          className="mt-10 flex flex-col gap-3 md:mt-12 md:h-[560px] md:flex-row"
          onMouseLeave={() => setHovered(null)}
        >
          {items.map((item, i) => {
            const isWide = wide === i;
            const isOpen = open === i;
            /* Текст показывается только в широкой плитке: пока мышь на соседней,
               открытая сжата до 150 px, и абзац в ней не читается. */
            const showText = isOpen && isWide;
            return (
              <button
                key={item.title}
                type="button"
                aria-expanded={isOpen}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onClick={() => setOpen(isOpen ? -1 : i)}
                style={{ flexGrow: isWide ? 3 : 1 }}
                className={`group relative overflow-hidden rounded-[10px] text-left transition-all duration-200 ease-out motion-reduce:transition-none md:min-w-0 md:flex-1 md:basis-0 ${
                  isOpen ? "h-[300px]" : "h-[116px]"
                } md:h-auto`}
              >
                <Image
                  src={item.photo}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 520px"
                  className="object-cover"
                />

                {/* Затемнение под белым текстом — плоская хвоя, не градиент:
                    40% на узкой плитке, 55% на раскрытой с абзацем. */}
                <span
                  aria-hidden
                  className={`absolute inset-0 bg-graphite transition-opacity duration-200 motion-reduce:transition-none ${
                    showText ? "opacity-55" : isWide ? "opacity-40" : "opacity-30"
                  }`}
                />

                {item.badge ? <PhotoBadge>{item.badge}</PhotoBadge> : null}

                <span className={`absolute inset-x-0 bottom-0 flex flex-col ${isWide ? "p-5 md:p-6" : "p-4"}`}>
                  <span
                    className={`font-head font-bold leading-[1.15] tracking-[-0.01em] text-white [hyphens:auto] ${
                      isWide ? "text-[20px] md:text-[26px]" : "text-[16px]"
                    }`}
                  >
                    {item.title}
                  </span>

                  {/* Текст живёт в сетке, схлопнутой до нуля: так он выезжает
                      без скачка высоты и не требует знать свою высоту заранее. */}
                  <span
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${
                      showText ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block max-w-[36em] text-[15px] leading-[1.6] text-white/85 md:text-[15.5px]">
                        {item.text}
                      </span>
                    </span>
                  </span>

                  {!showText ? <span className="mono-label mt-3 !text-white/70">Подробнее</span> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
