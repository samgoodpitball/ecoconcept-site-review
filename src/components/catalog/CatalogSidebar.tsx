"use client";

import { useState } from "react";
import Link from "next/link";
import LeadButton from "@/components/LeadButton";
import {
  categories,
  categoryHref,
  itemsOf,
  productHref,
  shortTitle,
  type CatalogCategory,
} from "@/lib/catalog-view";

/**
 * Левая колонка каталога: разделы с раскрывающимся списком моделей.
 *
 * Название раздела ведёт на его страницу, стрелка раскрывает список — оттуда
 * можно уйти сразу в нужную модель, не заходя в раздел. Раздел, в котором мы
 * находимся, раскрыт с самого начала.
 */
export default function CatalogSidebar({
  category,
  slug,
}: {
  category?: CatalogCategory;
  slug?: string;
}) {
  const [opened, setOpened] = useState<CatalogCategory | null>(category ?? null);

  return (
    <aside className="flex flex-col gap-7">
      <nav aria-label="Разделы каталога">
        <h2 className="kicker">Каталог</h2>
        <ul className="mt-3.5 flex flex-col gap-2">
          {categories.map((c) => {
            const items = itemsOf(c.id);
            const isCurrent = c.id === category;
            const isOpen = opened === c.id;

            return (
              <li key={c.id}>
                {/* Плитка раздела: название ведёт на страницу, шеврон раскрывает модели */}
                <div
                  className={`relative flex items-center rounded-[12px] transition-[background-color,border-color,box-shadow] duration-150 ${
                    isOpen || isCurrent
                      ? "border border-eco-dark bg-eco-dark shadow-[0_2px_10px_rgba(46,98,16,0.25)]"
                      : "border border-line bg-white shadow-[0_1px_2px_rgba(20,20,20,0.04)] hover:border-[#cfd8cb] hover:shadow-[0_2px_10px_rgba(20,20,20,0.07)]"
                  }`}
                >
                  <Link
                    href={categoryHref(c.id)}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`flex-1 py-3.5 pl-4 pr-2 font-head text-[14.5px] font-semibold leading-snug transition-colors ${
                      isOpen || isCurrent ? "text-white" : "text-graphite hover:text-eco-dark"
                    }`}
                  >
                    {c.title}
                  </Link>

                  <span
                    className={`text-[12.5px] tabular-nums ${
                      isOpen || isCurrent ? "text-white/60" : "text-muted"
                    }`}
                  >
                    {items.length}
                  </span>

                  <button
                    type="button"
                    onClick={() => setOpened(isOpen ? null : c.id)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? `Свернуть ${c.title}` : `Показать модели: ${c.title}`}
                    className={`mr-1.5 flex h-9 w-9 items-center justify-center rounded-[12px] transition-colors ${
                      isOpen || isCurrent ? "text-white hover:bg-white/12" : "text-muted hover:bg-off hover:text-eco-dark"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2.5 4.5L6 8l3.5-3.5" />
                    </svg>
                  </button>
                </div>

                {isOpen && (
                  // 24 инвертора в раскрытом виде уводили колонку далеко вниз — длинные списки прокручиваются внутри себя
                  <ul className="mb-1 mt-1.5 max-h-[320px] space-y-0.5 overflow-y-auto py-1 pl-4 pr-1">
                    {items.map((item) => {
                      const active = item.slug === slug;
                      return (
                        <li key={item.slug}>
                          <Link
                            href={productHref(item)}
                            aria-current={active ? "page" : undefined}
                            className={`block rounded-[12px] px-3 py-2 text-[13.5px] leading-snug transition-colors hover:bg-off hover:text-eco-dark ${
                              active ? "bg-tint font-semibold text-eco-dark" : "text-muted"
                            }`}
                          >
                            {shortTitle(item)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="rounded-[12px] bg-tint p-5">
        <h3 className="text-[16px] font-bold leading-snug">Не знаете, что выбрать?</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          Назовите площадь дома — подберём мощность и соберём комплект за один звонок.
        </p>
        <LeadButton source="catalog-sidebar" className="btn-primary mt-3.5 !px-5 !py-2.5 text-[14px]">
          Подобрать
        </LeadButton>
      </div>

      <div className="card p-5">
        <span className="kicker">Оптом и дилерам</span>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
          От пяти единиц считаем по дилерской цене. Пришлём прайс и остатки по складу.
        </p>
        <LeadButton
          interest="Опт"
          source="catalog-wholesale"
          className="btn-outline mt-3.5 !px-5 !py-2.5 text-[14px]"
        >
          Запросить прайс
        </LeadButton>
      </div>
    </aside>
  );
}
