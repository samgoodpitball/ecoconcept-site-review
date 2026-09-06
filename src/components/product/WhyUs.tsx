"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoBadge } from "@/components/product/SectionKit";

/**
 * Секция «Почему EcoConcept» — причины выбрать нас, а не соседа по рынку.
 *
 * Раскладка снята с блока «Power your home, your way» на energysage.com:
 * ряд высоких плиток, у каждой фотография во всю плитку и крупный белый
 * заголовок внизу. Плитки узкие, пока их не тронули; наведение расширяет одну
 * за счёт соседних, клик раскрывает текст причины.
 *
 * Разделение «навёл — шире, нажал — текст» — постановка заказчика 05.09.2026.
 * Смысл: пробегая мышью по ряду, человек читает только заголовки и не получает
 * прыгающих абзацев; текст приходит, когда он его выбрал.
 *
 * Затемнение под белым текстом — сплошная плашка, а не градиент: градиенты
 * запрещены дизайн-системой, а без затемнения белый заголовок не читается на
 * светлых кадрах.
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
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="text-center">
          <h2 className="text-[30px] font-bold leading-[1.08] tracking-[-0.02em] md:text-[44px]">{title}</h2>
          <p className="mt-4 text-[19px] leading-[1.35] text-muted md:text-[24px]">{subtitle}</p>
        </div>

        <div
          className="mt-12 flex flex-col gap-3 md:h-[560px] md:flex-row"
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
                className={`group relative overflow-hidden rounded-[12px] text-left transition-all duration-200 ease-out motion-reduce:transition-none md:min-w-0 md:flex-1 md:basis-0 ${
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

                {/* Плашка держит контраст белого текста: 40% на узкой плитке,
                    60% на раскрытой, где под заголовком идёт абзац. */}
                <span
                  aria-hidden
                  className={`absolute inset-0 bg-graphite transition-opacity duration-200 motion-reduce:transition-none ${
                    showText ? "opacity-55" : isWide ? "opacity-40" : "opacity-30"
                  }`}
                />

                {item.badge ? (
                  <PhotoBadge>{item.badge}</PhotoBadge>
                ) : null}

                <span
                  className={`absolute inset-x-0 bottom-0 flex flex-col ${
                    isWide ? "p-5 md:p-6" : "p-4"
                  }`}
                >
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

                  {!showText ? (
                    <span className="mt-3 font-head text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">
                      Подробнее
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
