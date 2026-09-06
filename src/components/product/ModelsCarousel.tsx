"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Горизонтальная лента моделей: свайп на тач-устройствах, стрелки на десктопе.
 *
 * Карточки приходят готовыми из серверного компонента — здесь только прокрутка,
 * поэтому данные каталога не уезжают в клиентский бандл.
 *
 * Автопрокрутки нет сознательно: DESIGN.md запрещает автокарусели — лента едет
 * только по действию читателя.
 */
export default function ModelsCarousel({
  children,
  arrows = "bottom",
}: {
  children: React.ReactNode;
  /** Где стоят стрелки: под лентой (каталог) или по центру над ней (секция «Почему»). */
  arrows?: "bottom" | "top-center";
}) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft > el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const el = track.current;
    if (!el) return;
    const onResize = () => sync();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sync]);

  const step = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    // Шаг — примерно экран карточек, но не больше видимой ширины.
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

  /* Стрелки — только там, где нет свайпа пальцем. */
  const controls = (
    <div
      className={`hidden gap-3 md:flex ${
        arrows === "top-center" ? "mb-12 justify-center" : "mt-8"
      }`}
    >
      <ArrowButton dir="left" disabled={atStart} onClick={() => step(-1)} />
      <ArrowButton dir="right" disabled={atEnd} onClick={() => step(1)} />
    </div>
  );

  return (
    <div className="relative">
      {arrows === "top-center" && controls}

      <div
        ref={track}
        onScroll={sync}
        className="hp-carousel -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 md:mx-0 md:px-0"
      >
        {children}
      </div>

      {arrows === "bottom" && controls}
    </div>
  );
}

function ArrowButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Предыдущие модели" : "Следующие модели"}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-graphite transition-colors hover:border-eco hover:text-eco-dark disabled:cursor-default disabled:border-line disabled:text-line"
    >
      <svg width="9" height="14" viewBox="0 0 7 10" fill="none" aria-hidden="true" className={dir === "left" ? "rotate-180" : ""}>
        <path d="m1.5 1 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
